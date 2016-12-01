# Be sure to restart your server when you modify this file.
# Action Cable runs in a loop that does not support auto reloading.

class PomodoroChannel < ApplicationCable::Channel

  def subscribed
    stream_from stream_name
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    # puts
    # ap data
    # puts

    case data.fetch('message')['action']
      when 'start'
        start data
      when 'pause'
        pause data
      when 'stop'
        stop data
      else
        ActionCable.server.broadcast stream_name, {action: 'Wrong Action'}
    end
  end

  private

  def stream_name
    "pomodoro_channel_#{current_user.email}"
  end

  def loading
    puts
    ap 'LOADING METHOD'

    # Должен менять:
    #   если current_user.pomo_started? то:
    #     если end_time - Time.now <= 0 то:
    #       вызвать метод end
    #     если end_time - Time.now > 0 то:
    #       вызвать метод start
  end

  def start data
    puts
    ap 'START METHOD'

    # Должен менять:
    #   если помидор уже был запущен вернуть информацию об этом
    #   current_user.started_proect на номер запушеного проекта
    #   status: 'starting'
    #   разослать  action: 'start', end_time: period.end_time

    unless User.find(current_user.id).pomo_started? # when pomo NOT started

      porject_id = data.fetch('message')['project']
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
        period = pomo_cycle.periods.create({periods_type: 'pomo', status: 'starting', end_time: (Time.now + 1.minutes - 1.second).to_m})
      elsif period.ended?
        if period.periods_type == 'shot break'
          period = pomo_cycle.periods.create({periods_type: 'pomo', status: 'starting', end_time: (Time.now + 1.minutes - 1.second).to_m})
        elsif period.periods_type == 'pomo'
          if pomo_cycle.periods.size == 7
            period = pomo_cycle.periods.create({periods_type: 'long break', status: 'starting', end_time: (Time.now + 1.minutes - 1.second).to_m})
          else
            period = pomo_cycle.periods.create({periods_type: 'shot break', status: 'starting', end_time: (Time.now + 1.minutes - 1.second).to_m})
          end
        end
      elsif period.paused?
        period.update({status: 'starting', end_time: Time.now.to_m + (period.end_time - period.pause_time)})
      end

      User.find(current_user.id).update({started_project: project.id})
      ActionCable.server.broadcast stream_name, {action: 'start', end_time: period.end_time, period_type: period.periods_type}
    end

  end

  def pause data
    puts
    ap 'PAUSE METHOD'

    # Должен менять:
    #   current_user.started_project на nil
    #   period status: 'paused'
    #   записать в базу время паузы
    #   разослать action: 'pause'

    if User.find(current_user.id).pomo_started?
      User.find(current_user.id).update({started_project: nil})

      porject_id = data.fetch('message')['project']
      project = current_user.projects.find(porject_id)

      period = project.pomo_cycles.last.periods.last
      period.update({status: 'paused', pause_time: Time.now.to_m})

      ActionCable.server.broadcast stream_name, {action: 'pause'}
    end

  end

  def stop data
    puts
    ap 'STOP METHOD'

    # Должен менять:
    #   current_user.started_project на nil
    #   удалить текущий период

    if User.find(current_user.id).pomo_started?

      porject_id = data.fetch('message')['project']
      project = current_user.projects.find(porject_id)

      period = project.pomo_cycles.last.periods.last

      User.find(current_user.id).update({started_project: nil})
      # current_user.started_project = nil
      # current_user.save

      if period
        period.destroy
      end

      ActionCable.server.broadcast stream_name, {action: 'stop'}
    end

  end

  def end
    # Должен менять:
    #   period status: 'ended'
    #
    #   если последний период в цикле то:
    #     изменить pomo_cycle.ended на true    И разослать информацию о завершении цикла ???
    #     current_user.started_proect на nil
    #   если НЕ последний период в цикле то:
    #     запустить следующий период

    ap 'END METHOD'
  end

end