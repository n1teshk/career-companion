# ML Predictions Controller
# Handles user interactions with ML prediction features
class MlPredictionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_application, only: [:show, :generate, :status]
  before_action :authorize_application_access, only: [:show, :generate, :status]

  def show
    @presenter = MlPredictionsPresenter.new(@application, current_user)
    @ml_predictions = @presenter.recent_predictions
    @latest_predictions = @presenter.latest_predictions_by_type
    @prediction_summary = @presenter.prediction_summary(@latest_predictions)
  end

  def generate
    unless ApplicationConfig.ml_predictions_enabled?
      redirect_to application_path(@application), alert: "ML predictions are currently unavailable."
      return
    end

    # Check rate limiting
    presenter = MlPredictionsPresenter.new(@application, current_user)
    if presenter.rate_limit_exceeded?
      redirect_to application_ml_predictions_path(@application), 
                  alert: "Please wait before generating new predictions."
      return
    end

    # Enqueue background job for ML prediction generation
    GenerateMlPredictionsJob.perform_later(@application.id, current_user.id)

    respond_to do |format|
      format.html { redirect_to application_ml_predictions_path(@application), notice: "Generating ML predictions..." }
      format.json { render json: { status: 'processing', message: 'ML predictions are being generated' } }
    end
  end

  def status
    presenter = MlPredictionsPresenter.new(@application, current_user)
    render json: presenter.status_data
  end

  private

  def set_application
    @application = Application.find(params[:id] || params[:application_id])
  rescue ActiveRecord::RecordNotFound
    redirect_to applications_path, alert: "Application not found."
  end

  def authorize_application_access
    unless @application.user == current_user
      redirect_to applications_path, alert: "You don't have access to this application."
    end
  end

end