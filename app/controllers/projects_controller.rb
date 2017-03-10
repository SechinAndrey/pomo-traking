class ProjectsController < ApplicationController
  before_action :authenticate_user!

  def index
    @projects = current_user.projects.all.as_json(only: [:id, :title])
    render json: current_user.projects.all.as_json(only: [:id, :title])
  end

  def show
    render json: current_user.projects.find(params[:id]).as_json(only: [:id, :title])
  end

  def create
    @project = current_user.projects.create(project_params)
    if @project.valid?
      ActionCable.server.broadcast stream_name, {action: 'Cooool ahahahaha'}
      render json: @project
    else
      render json: @project.errors.full_messages
    end
  end

  private
  def project_params
    params.require(:project).permit(:title)
  end

  def stream_name
    "pomodoro_channel_#{current_user.id}"
  end

end
