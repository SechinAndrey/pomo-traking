class PomodoroChannel < ApplicationCable::Channel

  def subscribed
    ap 'PomodoroChannel - subscribed'
    stream_from stream_name
    load_timer
  end

  def unsubscribed
    ap 'PomodoroChannel - UNsubscribed'
    connection.close
  end

  def receive(data)
    action = data.fetch('message')['action']
    @project_id = data.fetch('message')['project']

    if @project_id.nil?
      ap "[Pomo Log]: Action '#{action}' - project_id is NIL"
    else
      case action
        when 'start'
          start
        when 'switch'
          switch
        when 'pause'
          pause
        when 'stop'
          stop
        when 'end'
          end_timer
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
    REDIS.set("sync_end_action_#{current_user.id}", 'synchronized')
    current_project = current_user.current_project.load_timer if current_user.current_project
    @broadcast_data = {current_project: current_project.serialize}
    broadcast
  end

  def start
    project = current_user.projects.where(id: @project_id).last

    if project and !current_user.current_project&.started?
      project.start_timer
      @broadcast_data = {current_project: project.serialize}
      broadcast
    end
  end

  def switch
    project = current_user.projects.where(id: @project_id).last

    if project and current_user.current_project&.started?
      project.switch_timer
      @broadcast_data = {
          current_project: project.serialize,
          switched: true
      }
      broadcast
    end
  end

  def pause
    current_project = current_user.current_project
    if current_project&.started?
      current_project.pause_timer
      @broadcast_data = {current_project: current_project.serialize}
      broadcast
    end
  end

  def stop
    current_project = current_user.current_project
    if current_project and !current_project.stopped?
      current_project.stop_timer
      @broadcast_data = {current_project: current_project.serialize}
      broadcast
    end
  end

  def end_timer
    if REDIS.get("sync_end_action_#{current_user.id}") == 'synchronized'
      REDIS.set("sync_end_action_#{current_user.id}", 'syncs')
      current_project = current_user.current_project
      if current_project&.started?
        current_project.end_timer
        @broadcast_data = {current_project: current_project.serialize}
        broadcast
      end
      REDIS.set("sync_end_action_#{current_user.id}", 'synchronized')
    end
  end

  def broadcast
    # ap @broadcast_data
    ActionCable.server.broadcast stream_name, @broadcast_data
  end
end
