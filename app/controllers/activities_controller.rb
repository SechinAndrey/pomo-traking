class ActivitiesController < ApplicationController
  before_action :authenticate_user!

  # statistics row count
  # User.eager_load(projects: :statistics)
  # .select('distinct statistics.id')
  # .where('users.id = 3 AND statistics.created_at BETWEEN ? AND ?', 1.month.ago, Time.now).count

  # statistics row count
  # User.eager_load(projects: :statistics)
  # .where('users.id = 3 AND statistics.created_at BETWEEN ? AND ?', 1.month.ago, Time.now)

  def activities
    response = Array.new
    params[:activities].each do |activity|
      response.push Activities.new activity, current_user, params
    end
    render json: response
  end

end

