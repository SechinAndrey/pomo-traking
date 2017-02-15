class ProjectsController < ApplicationController
  before_action :authenticate_user!


  def index
    render json: current_user.projects.all.as_json(only: [:id, :title])
  end

  def show
    render json: current_user.projects.find(params[:id]).as_json(only: [:id, :title])
  end

  def create
    render json: current_user.projects.create(project_params)
  end

  private
  def project_params
    params.require(:project).permit(:title, :pomo_time, :short_break_time, :long_break_time)
  end

end
