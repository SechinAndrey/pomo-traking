class ProjectsController < ApplicationController
  before_action :authenticate_user!

  def index
    # TODO: Sort
    #  alphabet, alphabet:DESC
    #  date, date:DESC
    #  pomo_count, pomo_count:desc

    # ap '========================='
    # ap params
    # ap '========================='

    page = params[:page]
    per_page = params[:per_page]
    sort = params[:sort]

    case sort
      when 'alphabet'
        @projects = current_user.projects.order(:title).page(page).per(per_page).as_json(only: [:id, :title])
      when 'alphabet:DESC'
        @projects = current_user.projects.order(title: :desc).page(page).per(per_page).as_json(only: [:id, :title])
      when 'date'
        @projects = current_user.projects.order(:updated_at).page(page).per(per_page).as_json(only: [:id, :title])
      when 'date:DESC'
        @projects = current_user.projects.order(updated_at: :desc).page(page).per(per_page)
      when 'pomo_count'
        @projects = current_user.projects.order(:title).page(page).per(per_page).as_json(only: [:id, :title]) # TODO
      when 'pomo_count:desc'
        @projects = current_user.projects.order(:title).page(page).per(per_page).as_json(only: [:id, :title]) # TODO
      else
        ap '------- Default Sort'
        @projects = current_user.projects.order(:title).page(page).per(per_page).as_json(only: [:id, :title])
    end
    render json: @projects
  end

  def show
    render json: current_user.projects.find(params[:id]).as_json(only: [:id, :title])
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

  def destroy

  end

  private
  def project_params
    params.require(:project).permit(:title)
  end

  def project_channel
    "project_channel_#{current_user.id}"
  end


  def broadcast
    ActionCable.server.broadcast project_channel, @broadcast_data
  end
end
