class AvatarsController < ApplicationController
  before_action :authenticate_user!, only: [:create]
  def create
    avatar = Avatar.create(avatar: params[:file])
    current_user.avatar = avatar
    render :json => current_user.avatar
  end
end
