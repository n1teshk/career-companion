class ApplicationsController < ApplicationController
  def new
    @application = Application.new
  end

  def create
    @application = Application.new(application_params)
    @application.user = current_user

    if @application.save
      redirect_to trait_application_path(@application), notice: "Application created!", status: :see_other
    else
      render :new, status: :unprocessable_entity
    end
  end

  def trait
    @application = Application.find(params[:id])
    return unless request.patch?

    session[:trait_choice1] = params[:trait_choice1]
    session[:trait_choice2] = (params[:trait_choice2] == "Other" ? params[:trait_choice2_other].presence : params[:trait_choice2])
    session[:trait_choice3] = params[:trait_choice3]
    session[:trait_choice4] = (params[:trait_choice4] == "Other" ? params[:trait_choice2_other].presence : params[:trait_choice4])

    redirect_to overview_application_path(@application)
  end

  def overview
    @traits = [session[:trait_choice1], session[:trait_choice2], session[:trait_choice3], session[:trait_choice4]]

    @llm_prompt = <<~PROMPT
    You are an AI career assistant. Based on the applicant's profile below,
    generate a professional cover letter draft for me.

    Cover Letter Tone: #{@traits[0]}
    Main Professional Strength: #{@traits[1]}
    Experience Level: #{@traits[2]}
    Career Motivation: #{@traits[3]}

    Instructions:
    - Keep the writing concise (max 3 short paragraphs).
    - Match the selected tone.
    - Highlight the strength of me.
    - Frame the experience level appropriately.
    - End with how my motivation makes me a strong candidate.
  PROMPT
  end

  private

  def application_params
    params.require(:application).permit(:job_d, :cv)
  end
end
