# ML Predictions Presenter
# Handles presentation logic for ML predictions display
class MlPredictionsPresenter
  attr_reader :application, :user

  def initialize(application, user)
    @application = application
    @user = user
  end

  # Get the latest prediction for each type
  def latest_predictions_by_type
    latest_predictions = {}
    
    MlPrediction::PREDICTION_TYPES.each do |type|
      prediction = application.ml_predictions
                             .for_prediction_type(type)
                             .completed
                             .recent
                             .first
      latest_predictions[type] = prediction if prediction
    end
    
    latest_predictions
  end

  # Generate summary statistics for predictions
  def prediction_summary(latest_predictions)
    return {} unless latest_predictions.any?

    {
      total_predictions: latest_predictions.count,
      high_confidence_count: latest_predictions.values.count(&:high_confidence?),
      average_confidence: calculate_average_confidence(latest_predictions),
      last_generated: latest_predictions.values.map(&:created_at).max
    }
  end

  # Check if user has exceeded rate limits for ML predictions
  def rate_limit_exceeded?
    rate_limits = ApplicationConfig.ml_prediction_rate_limit
    recent_predictions = user.ml_predictions.where(created_at: 1.hour.ago..Time.current)
    
    recent_predictions.count >= rate_limits[:requests_per_hour]
  end

  # Get recent predictions for display
  def recent_predictions
    application.ml_predictions.recent.includes(:user)
  end

  # Check if ML predictions are currently processing
  def predictions_processing?
    application.ml_predictions.where(status: 'processing').any?
  end

  # Get status data for AJAX polling
  def status_data
    predictions = application.ml_predictions.recent.limit(10)
    
    {
      has_predictions: predictions.any?,
      latest_predictions: predictions.map(&:formatted_results),
      processing: predictions.where(status: 'processing').any?,
      failed: predictions.where(status: 'failed').any?
    }
  end

  private

  def calculate_average_confidence(predictions)
    confidences = predictions.values.map(&:confidence_score).compact
    return 0 if confidences.empty?
    
    (confidences.sum / confidences.count).round(2)
  end
end