# LinkedIn Analysis Presenter
# Handles presentation logic for LinkedIn profile analysis
class LinkedinAnalysisPresenter
  attr_reader :user, :analysis_result

  def initialize(user, analysis_result = nil)
    @user = user
    @analysis_result = analysis_result
  end

  # Check if user has exceeded rate limits for LinkedIn analysis
  def rate_limit_exceeded?
    rate_limits = ApplicationConfig.linkedin_analysis_rate_limit
    recent_analyses = user.linkedin_analyses.where(created_at: 1.hour.ago..Time.current)
    
    recent_analyses.count >= rate_limits[:requests_per_hour]
  end

  # Generate improvement timeline from recommendations
  def improvement_timeline(recommendations)
    return {} if recommendations.blank?

    timeline = {
      immediate: [],
      short_term: [],
      long_term: []
    }

    recommendations.each do |rec|
      case rec['effort']
      when 'low'
        timeline[:immediate] << rec
      when 'medium'
        timeline[:short_term] << rec
      when 'high'
        timeline[:long_term] << rec
      else
        timeline[:short_term] << rec
      end
    end

    timeline
  end

  # Validate uploaded PDF file
  def validate_pdf_file(pdf_file)
    errors = []

    unless pdf_file.present?
      errors << "Please select a LinkedIn profile PDF file."
      return { valid: false, errors: errors }
    end

    # Check file size
    max_size = ApplicationConfig.max_pdf_size_mb.megabytes
    if pdf_file.size > max_size
      errors << "File size too large. Maximum #{ApplicationConfig.max_pdf_size_mb}MB allowed."
    end

    # Check file type
    allowed_types = ['application/pdf']
    unless allowed_types.include?(pdf_file.content_type)
      errors << "Please upload a PDF file only."
    end

    { valid: errors.empty?, errors: errors }
  end

  # Get recent analyses for display
  def recent_analyses
    user.linkedin_analyses.recent.limit(10)
  end

  # Format analysis result for display
  def formatted_analysis_result
    return {} unless analysis_result

    {
      profile_score: analysis_result[:profile_score],
      analysis: analysis_result[:analysis],
      recommendations: analysis_result[:recommendations] || [],
      summary: analysis_result[:summary],
      analyzed_at: analysis_result[:analyzed_at]
    }
  end

  # Check if analysis result has expired
  def analysis_expired?
    return true unless analysis_result&.dig(:analyzed_at)
    
    cache_duration = ApplicationConfig.linkedin_analysis_cache_days.days
    analysis_result[:analyzed_at] < cache_duration.ago
  end

  # Get improvement metrics for report
  def improvement_metrics(recommendations)
    return {} if recommendations.blank?

    {
      total_recommendations: recommendations.count,
      high_impact: recommendations.count { |r| r['impact'] == 'high' },
      medium_impact: recommendations.count { |r| r['impact'] == 'medium' },
      low_impact: recommendations.count { |r| r['impact'] == 'low' },
      estimated_timeline: ApplicationConfig.improvement_timeline_estimate
    }
  end
end