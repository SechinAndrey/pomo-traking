class ProjectsController < ApplicationController
  before_action :authenticate_user!

  def index
    # ap '========================='
    # ap params
    # ap '========================='

    page = params[:page]
    per_page = params[:per_page]
    sort = params[:sort]

    case sort
      when 'alphabet'
        @projects = current_user.projects.order(:title).page(page).per(per_page)
      when 'alphabet:desc'
        @projects = current_user.projects.order(title: :desc).page(page).per(per_page)
      when 'date'
        @projects = current_user.projects.order(:updated_at).page(page).per(per_page)
      when 'date:desc'
        @projects = current_user.projects.order(updated_at: :desc).page(page).per(per_page)
      when 'pomo_count'
        @projects = current_user.projects.left_joins(:statistics).group(:id).order('COUNT(statistics.id)').page(page).per(per_page)
      when 'pomo_count:desc'
        @projects = current_user.projects.left_joins(:statistics).group(:id).order('COUNT(statistics.id) DESC').page(page).per(per_page)
      else
        ap '------- Default Sort'
        @projects = current_user.projects.order(:title).page(page).per(per_page)
    end
    render json: @projects
  end

  def show
    render json: current_user.projects.find(params[:id])
  end

  def create
    @project = current_user.projects.create(project_params)
    if @project.valid?
      @broadcast_data = {
          created: true,
          project: @project.serialize
      }
      broadcast
      render json: { created: true }
    else
      render json: @project.errors.full_messages
    end
  end

  def update
    @project = current_user.projects.find(params[:id])
    duration_settings = @project&.duration_settings&.update(duration_settings_params) ||
        @project&.create_duration_settings(duration_settings_params).valid?
    if duration_settings and @project&.update(project_params)
      @broadcast_data = {
          updated: true,
          project: @project.serialize
      }
      broadcast
      render json: { deleted: true }
    else
      render json: { deleted: false }
    end

  end

  def destroy
    project = current_user.projects.find(params[:id])
    project.pomo_cycle&.stop_timer
    project.destroy
    if project.destroyed?
      @broadcast_data = {
          deleted: true,
          project: project.serialize
      }
      broadcast
      render json: { deleted: true }
    else
      render json: {deleted: false}
    end
  end

  private
  def project_params
    params.require(:project).permit(:title)
  end

  def duration_settings_params
    params.permit(:pomo_duration, :short_break_duration, :long_break_duration)
  end

  def project_channel
    "project_channel_#{current_user.id}"
  end


  def broadcast
    ActionCable.server.broadcast project_channel, @broadcast_data
  end
end
