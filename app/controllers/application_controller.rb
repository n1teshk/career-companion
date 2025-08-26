class ApplicationController < ActionController::Base
  # If you use Devise and were skipping it in PagesController:
  before_action :authenticate_user!
end
