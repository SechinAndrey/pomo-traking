# Be sure to restart your server when you modify this file. Action Cable runs in a loop that does not support auto reloading.
class PomodoroChannel < ApplicationCable::Channel
  def subscribed
    stream_from stream_name
    @subscriber == nil ? @subscriber = 1 : @subscriber +=1
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    @subscriber -=1
    ap @subscriber
  end

  def receive(data)
    # ap 'recive...'
    ap  @subscriber
    ActionCable.server.broadcast stream_name, data.fetch('message')
  end

  private

  def stream_name
    "pomodoro_channel_#{user_email}"
  end

  def user_email
    params.fetch('data').fetch('user')
  end

end
