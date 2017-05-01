class RegistrationsController < Devise::RegistrationsController

  def update
    super
    @broadcast_data = {
        user_updated: true,
        current_user: resource.serialize
    }
    broadcast
  end


  private

  def respond_with(resource, opts = {})
    render json: resource
  end

  def update_resource(resource, params)
    resource.update_without_password(params)
  end

  def stream_name
    "pomodoro_channel_#{current_user.id}"
  end

  def broadcast
    ActionCable.server.broadcast stream_name, @broadcast_data
  end

end