class ProjectChannel < ApplicationCable::Channel

  def subscribed
    stream_from stream_name
    ap 'ProjectChannel subscribed'
  end

  def unsubscribed
    ap 'ProjectChannel - UNsubscribed'
    connection.close
  end


  def receive(data)

  end

  private

  def stream_name
    "project_channel_#{current_user.id}"
  end

end
