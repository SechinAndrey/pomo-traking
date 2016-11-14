class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  # skip_before_filter :verify_authenticity_token
  # protect_from_forgery with: :null_session

  before_action :configure_permitted_parameters, if: :devise_controller?
  respond_to :json

  def angular
    render 'layouts/application'
  end

  private
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username, :file])
  end
end