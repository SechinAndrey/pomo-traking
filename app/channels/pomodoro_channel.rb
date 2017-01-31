
=begin
  TODO: 1. Add project to pomo-action response.
=end

class PomodoroChannel < ApplicationCable::Channel

  def subscribed
    stream_from stream_name
    ap "subscribed"

    loading
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # puts
    # ap data
    # puts
    # ActionCable.server.broadcast stream_name, {action: '666666666666666666666666666666666666666666666666666666666666666'}

    action = data.fetch('message')['action']
    project = data.fetch('message')['project']

    if project.nil?
      ap "[Pomo Log]: Action '#{action}' - project_id is NIL"
    else
      case action
        when 'start'
            start project
        when 'pause'
          pause project
        when 'stop'
          stop project
        when 'end'
          end_pomo project
        else
          ActionCable.server.broadcast stream_name, {action: 'Wrong Action'}
      end
    end
  end

  private

  def stream_name
    "pomodoro_channel_#{current_user.id}"
  end

  def loading
    puts
    ap 'LOADING METHOD'

    user =  User.find(current_user.id)
    unless user.current_project.nil?
      project = user.projects.find(user.current_project)
      pomo_cycle = project.pomo_cycles.last
      period = pomo_cycle.periods.last

      unless period.nil?
        if user.pomo_started?
          if period.end_time - Time.now.to_m <= 0
            end_pomo user.current_project
          else
            ap "1"
            ActionCable.server.broadcast stream_name, {action: 'start', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status]), project: project.as_json(only: [:id, :title])}
          end
        elsif user.pomo_paused?
          ap "2"
          period.update({status: 'paused', end_time: Time.now.to_m + (period.end_time - period.pause_time), pause_time: Time.now.to_m})
          User.find(current_user.id).update({current_project_status: 'paused'})
          ActionCable.server.broadcast stream_name, {action: 'loading', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status]), project: project.as_json(only: [:id, :title])}
        end
      end
    end

    ap 'END LOADING'

  end

  def start porject_id
    puts
    ap 'START METHOD'

    # Должен менять:
    #   если помидор уже был запущен вернуть информацию об этом
    #   current_user.started_proect на номер запушеного проекта
    #   status: 'started'
    #   разослать  action: 'start', end_time: period.end_time

    unless User.find(current_user.id).pomo_started? # when pomo NOT started

      # получаем проект
      project = current_user.projects.find(porject_id)

      # получаем последний цикл
      pomo_cycle = project.pomo_cycles.last
      # если цикла нет или он завершился создаем новый
      if !pomo_cycle or pomo_cycle.ended
        pomo_cycle = project.pomo_cycles.create({ended: false})
      end

      # получаем последний период
      period = pomo_cycle.periods.last
      # если периода нет или он завершился создаем новый если на паузе обновляем end_time
      if !period
        period = pomo_cycle.periods.create({periods_type: 'pomo', status: 'started', end_time: (Time.now + 25.minutes).to_m})
      elsif period.ended?
        if period.periods_type == 'shot break'
          period = pomo_cycle.periods.create({periods_type: 'pomo', status: 'started', end_time: (Time.now + 25.minutes).to_m})
        elsif period.periods_type == 'pomo'
          if pomo_cycle.periods.size == 7 # pomo count in cycle
            period = pomo_cycle.periods.create({periods_type: 'long break', status: 'started', end_time: (Time.now + 15.minutes).to_m})
          else
            period = pomo_cycle.periods.create({periods_type: 'shot break', status: 'started', end_time: (Time.now + 5.minutes).to_m})
          end
        end
      elsif period.paused?
        period.update({status: 'started', end_time: Time.now.to_m + (period.end_time - period.pause_time)})
      end

      User.find(current_user.id).update({current_project: project.id, current_project_status: 'started'})
      ActionCable.server.broadcast stream_name, {action: 'start', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
    end

  end

  def pause porject_id
    puts
    ap 'PAUSE METHOD'

    # Должен менять:
    #   current_user.started_project на nil
    #   period status: 'paused'
    #   записать в базу время паузы
    #   разослать action: 'pause'

    if User.find(current_user.id).pomo_started?
      User.find(current_user.id).update({current_project_status: 'paused'})

      project = current_user.projects.find(porject_id)

      pomo_cycle = project.pomo_cycles.last
      period = pomo_cycle.periods.last
      period.update({status: 'paused', pause_time: Time.now.to_m})

      ActionCable.server.broadcast stream_name, {action: 'pause', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
    end

  end

  def stop porject_id
    puts
    ap 'STOP METHOD'

    # Должен менять:
    #   current_user.started_project на nil
    #   удалить текущий период

    if User.find(current_user.id).pomo_started? or User.find(current_user.id).pomo_paused?

      project = current_user.projects.find(porject_id)


      pomo_cycle = project.pomo_cycles.last
      period = pomo_cycle.periods.last

      User.find(current_user.id).update({current_project_status: 'stopped'})

      if period
        period.destroy
      end

      ActionCable.server.broadcast stream_name, {action: 'stop', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
    end

  end

  def end_pomo porject_id
    # Должен менять:
    #   period status: 'ended'
    #
    #   если последний период в цикле то:
    #     изменить pomo_cycle.ended на true    И разослать информацию о завершении цикла ???
    #     current_user.started_proect на nil
    #   если НЕ последний период в цикле то:
    #     запустить следующий период

    ap "END METHOD #{REDIS.get("sync_end_action_#{current_user.id}")}"

    if  REDIS.get("sync_end_action_#{current_user.id}") != true
      REDIS.set("sync_end_action_#{current_user.id}", true)

      if User.find(current_user.id).pomo_started?

        project = current_user.projects.find(porject_id)

        pomo_cycle = project.pomo_cycles.last
        periods = pomo_cycle.periods
        period = periods.last

        period.update({status: 'ended'})
        User.find(current_user.id).update({current_project_status: 'ended'})

        if periods.size == 8
          pomo_cycle.update({ended: true})
          ActionCable.server.broadcast stream_name, {action: 'end', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
        else
          start porject_id
        end
      end

      REDIS.set("sync_end_action_#{current_user.id}", false)

    end

  end

end