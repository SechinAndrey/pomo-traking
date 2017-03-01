
=begin
  TODO: 1. Add project to pomo-action response.
=end

class PomodoroChannel < ApplicationCable::Channel

  def subscribed
    stream_from stream_name
    # load_timer
    # start
    # pause
    stop
  end

  def receive(data)
    action = data.fetch('message')['action']
    project = data.fetch('message')['project']

    if project.nil?
      ap "[Pomo Log]: Action '#{action}' - project_id is NIL"
    else
      case action
        when 'start'
          start
        when 'pause'
          pause
        when 'stop'
          stop
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

  def load_timer
    current_project = current_user.current_project.load_timer if current_user.current_project
    broadcast_data = {current_project: current_project.serialize}
    ActionCable.server.broadcast stream_name, broadcast_data
  end

  def start
    current_project = current_user.current_project
    if current_project and !current_project.started?
      current_project.start_timer
      broadcast_data = {current_project: current_project.serialize}
      ActionCable.server.broadcast stream_name, broadcast_data
    end
  end

  def pause
    current_project = current_user.current_project
    if current_project&.started?
      current_project.pause_timer
      broadcast_data = {current_project: current_project.serialize}
      ActionCable.server.broadcast stream_name, broadcast_data
    end
  end

  def stop
    current_project = current_user.current_project
    if current_project and !current_project.stopped?
      current_project.stop_timer
      broadcast_data = {current_project: current_project.serialize}
      ActionCable.server.broadcast stream_name, broadcast_data
    end
  end

end
