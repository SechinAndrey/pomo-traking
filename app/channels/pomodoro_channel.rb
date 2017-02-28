
=begin
  TODO: 1. Add project to pomo-action response.
=end

class PomodoroChannel < ApplicationCable::Channel

  def subscribed
    stream_from stream_name
    ap 'subscribed'

    ActionCable.server.broadcast stream_name, current_user.current_project.serialize

    # current_user.current_project.load_timer if current_user.current_project

    # data = current_user.counter.loading
    # ActionCable.server.broadcast stream_name, data
  end

  def receive(data)
    action = data.fetch('message')['action']
    project = data.fetch('message')['project']

    if project.nil?
      ap "[Pomo Log]: Action '#{action}' - project_id is NIL"
    else
      case action
        when 'start'
          unless User.find(current_user.id).pomo_started?
            data = current_user.counter.start project
            ActionCable.server.broadcast stream_name, data
          end
        when 'pause'
          if User.find(current_user.id).pomo_started?
            data = current_user.counter.pause project
            ActionCable.server.broadcast stream_name, data
          end
        when 'stop'
          if User.find(current_user.id).pomo_started? or User.find(current_user.id).pomo_paused?
            data = current_user.counter.stop project
            ActionCable.server.broadcast stream_name, data
          end
        when 'end'
          if  REDIS.get("sync_end_action_#{current_user.id}") != true
            REDIS.set("sync_end_action_#{current_user.id}", true)
            data = current_user.counter.end_pomo project
            ActionCable.server.broadcast stream_name, data
            REDIS.set("sync_end_action_#{current_user.id}", false)
          end
        else
          ActionCable.server.broadcast stream_name, {action: 'Wrong Action'}
      end
    end
  end

  private

  def stream_name
    "pomodoro_channel_#{current_user.id}"
  end

end
