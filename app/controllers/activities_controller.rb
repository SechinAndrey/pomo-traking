class ActivitiesController < ApplicationController
  before_action :authenticate_user!

  def activities
    response = Array.new
    params[:activities].each do |activity|
      response.push Activities.new activity, current_user, params
    end
    render json: response
  end

end

