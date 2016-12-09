class ProjectsController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: current_user.projects.all.as_json(only: [:id, :title])
  end

end
