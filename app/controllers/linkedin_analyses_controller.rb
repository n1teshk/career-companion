# LinkedIn Profile Analysis Controller
# Handles user interactions with LinkedIn profile analysis features
class LinkedinAnalysesController < ApplicationController
  before_action :authenticate_user!
  
  def show
    @presenter = LinkedinAnalysisPresenter.new(current_user)
    @analyses = @presenter.recent_analyses
    @latest_analysis = @analyses.first
  end

  def new
    # Display upload form for LinkedIn profile PDF
  end

  def create
    unless ApplicationConfig.linkedin_integration_enabled?
      redirect_to new_linkedin_analysis_path, alert: "LinkedIn analysis is currently unavailable."
      return
    end

    # Validate file and check rate limiting
    presenter = LinkedinAnalysisPresenter.new(current_user)
    
    if presenter.rate_limit_exceeded?
      redirect_to new_linkedin_analysis_path, 
                  alert: "Please wait before analyzing another profile."
      return
    end

    pdf_file = params[:linkedin_profile]
    validation_result = presenter.validate_pdf_file(pdf_file)
    
    unless validation_result[:valid]
      redirect_to new_linkedin_analysis_path, alert: validation_result[:errors].first
      return
    end
    
    # Initialize LinkedIn analysis service
    linkedin_service = LinkedinProfileAnalysisService.new(current_user)
    
    begin
      # Perform analysis
      result = linkedin_service.analyze_profile_pdf(pdf_file)
      
      if result[:success]
        # Store analysis results in session for immediate display
        session[:linkedin_analysis_result] = {
          profile_score: result[:profile_score],
          analysis: result[:analysis],
          recommendations: result[:recommendations],
          summary: result[:summary],
          analyzed_at: Time.current
        }

        respond_to do |format|
          format.html { redirect_to linkedin_analysis_results_path, notice: "Profile analysis completed!" }
          format.json { render json: { success: true, redirect_url: linkedin_analysis_results_path } }
        end
      else
        respond_to do |format|
          format.html { redirect_to new_linkedin_analysis_path, alert: "Analysis failed: #{result[:error]}" }
          format.json { render json: { success: false, error: result[:error] } }
        end
      end

    rescue StandardError => e
      Rails.logger.error("LinkedIn analysis failed: #{e.message}")
      
      respond_to do |format|
        format.html { redirect_to new_linkedin_analysis_path, alert: "An error occurred during analysis." }
        format.json { render json: { success: false, error: "Analysis service unavailable" } }
      end
    end
  end

  def results
    @analysis_result = session[:linkedin_analysis_result]
    
    unless @analysis_result
      redirect_to new_linkedin_analysis_path, alert: "No analysis results found. Please upload a profile first."
      return
    end

    @presenter = LinkedinAnalysisPresenter.new(current_user, @analysis_result)
    @formatted_result = @presenter.formatted_analysis_result
    @improvement_timeline = @presenter.improvement_timeline(@formatted_result[:recommendations])
    
    # Clear session data after displaying (optional - user choice)
    # session.delete(:linkedin_analysis_result)
  end

  def improvement_report
    unless ApplicationConfig.linkedin_integration_enabled?
      redirect_to new_linkedin_analysis_path, alert: "LinkedIn analysis is currently unavailable."
      return
    end

    linkedin_service = LinkedinProfileAnalysisService.new(current_user)
    result = linkedin_service.generate_profile_improvement_report

    if result[:success]
      @improvement_report = result[:report]
      render :improvement_report
    else
      redirect_to new_linkedin_analysis_path, alert: "No cached analysis found. Please analyze your profile first."
    end
  end

  private
end