class DashboardsController < ApplicationController
  before_action :authenticate_user!

  def index
    @applications = current_user.applications.includes(:pitches)
    @pitches = current_user.pitches.includes(:application)
    @recent_pitches = @pitches.order(created_at: :desc).limit(9)
  end
end
