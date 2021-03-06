class PomodoroChannel < ApplicationCable::Channel

  def subscribed
    ap 'PomodoroChannel - subscribed'
    @statistics_params = ['all_time', 'last_month', 'last_week']
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
    current_project = current_user.current_project
    current_project = current_project.pomo_cycle.load_timer if current_project&.pomo_cycle
    statistics = current_user.get_statistics @statistics_params
    @broadcast_data = {current_project: current_project.serialize, statistics: statistics}
    broadcast
  end

  def start
    project = current_user.projects.where(id: @project_id).last
    if project and !current_user.current_project&.pomo_cycle&.started?
      pomo_cycle = project.pomo_cycle || project.create_pomo_cycle
      pomo_cycle.start_timer
      @broadcast_data = {current_project: project.serialize}
      broadcast
    end
  end

  def switch
    project = current_user.projects.where(id: @project_id).last
    if project and current_user.current_project&.pomo_cycle&.started?
      pomo_cycle = project.pomo_cycle || project.create_pomo_cycle
      pomo_cycle.switch_timer
      @broadcast_data = {
          current_project: project.serialize,
          switched: true
      }
      broadcast
    end
  end

  def pause
    current_project = current_user.current_project
    if current_project&.pomo_cycle&.started?
      current_project.pomo_cycle.pause_timer
      @broadcast_data = {current_project: current_project.serialize}
      broadcast
    end
  end

  def stop
    current_project = current_user.current_project
    if current_project and !current_project.pomo_cycle&.stopped?
      current_project.pomo_cycle.stop_timer
      @broadcast_data = {current_project: current_project.serialize}
      broadcast
    end
  end

  def end_timer
    if REDIS.get("sync_end_action_#{current_user.id}") == 'synchronized'
      REDIS.set("sync_end_action_#{current_user.id}", 'syncs')
      current_project = current_user.current_project
      if current_project&.pomo_cycle&.started?
        current_project.pomo_cycle.end_timer
        statistics = current_user.get_statistics @statistics_params
        @broadcast_data = {
            ended: true,
            current_project: current_project.serialize,
            statistics: statistics
        }
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