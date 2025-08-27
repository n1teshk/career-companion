class ApplicationsController < ApplicationController
  require "ruby_llm"

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
    session[:trait_choice2] = (params[:trait_choice2] == "Other" ? params[:trait_choice2_other] : params[:trait_choice2])
    session[:trait_choice3] = params[:trait_choice3]
    session[:trait_choice4] = (params[:trait_choice4] == "Other" ? params[:trait_choice4_other] : params[:trait_choice4])

    redirect_to overview_application_path(@application)
  end

  def overview
    @traits = [session[:trait_choice1], session[:trait_choice2], session[:trait_choice3], session[:trait_choice4]]
    @application = Application.find(params[:id])

    @llm_prompt_cl = <<~PROMPT
    You are an AI career assistant. Based on my applicant profile below,
    generate a professional cover letter draft for me.

    Cover Letter Tone: #{@traits[0]}
    Main Professional Strength: #{@traits[1]}
    Experience Level: #{@traits[2]}
    Career Motivation: #{@traits[3]}

    Instructions:
    - Keep the writing concise (max 3 short paragraphs).
    - Minumin 300 words.
    - Match the selected tone.
    - Highlight the strength of me.
    - Frame the experience level appropriately.
    - End with how my motivation makes me a strong candidate.
  PROMPT




@llm_prompt_video = <<~PROMPT
You are an AI career coach. Based on my applicant profile below, generate a first-person
video pitch script I can record. The pitch must run 60–90 seconds total.

Applicant profile:
- Video Tone: #{@traits[0]}
- Main Professional Strength: #{@traits[1]}
- Experience Level: #{@traits[2]}
- Career Motivation: #{@traits[3]}

Constraints:
- 135–200 words (aim ~165) to fit 60–90 seconds at natural speaking pace.
- Conversational, confident, and #{ @traits[0] } in tone. No jargon, no filler.
- Write in **first person** (“I…”). Keep sentences short and speakable.
- Include **light** stage directions in [brackets] (e.g., [smile], [pause]) only where helpful.

Structure (with loose timestamps):
- 0:00 Hook (1–2 lines): a quick, human opener that fits the tone.
- 0:10 Strength + proof (2–3 lines): spotlight #{@traits[1]}
- 0:30 Experience frame (2–3 lines): position my #{@traits[2]} level clearly
- 0:50 Motivation & fit (2–3 lines): tie #{@traits[3]} to the role/team/company impact.
- 1:10 Call-to-action (1–2 lines): invite next step; warm, concise close.

Output format:
1) Total word count at the top (e.g., “~170 words”).
2) Script with timestamps like:
   [0:00] ...
   [0:10] ...
   [0:30] ...
   [0:50] ...
   [1:10] ...
  PROMPT

  end


  def generate_cl
    @application = Application.find(params[:id])
    prompt = params[:prompt_cl]
    chat = RubyLLM.chat
    chat.with_instructions(prompt)
    response = chat.ask("Help me generate the paragraphs with the job description here: #{@application.job_d}")
    @message = response.content

     respond_to do |format|
    format.html { redirect_to overview_application_path(@application), notice: "CL generated." }
    format.turbo_stream
    end
  end


  def generate_video
    @application = Application.find(params[:id])
    prompt = params[:prompt_video]
    chat = RubyLLM.chat
    chat.with_instructions(prompt)
    response = chat.ask("Help me generate the pitch with the job description here: #{@application.job_d}")
    @message = response.content

     respond_to do |format|
    format.html { redirect_to overview_application_path(@application), notice: "Video generated." }
    format.turbo_stream
    end
  end



  private

  def application_params
    params.require(:application).permit(:job_d, :cv)
  end
end
