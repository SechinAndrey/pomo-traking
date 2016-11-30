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
    puts
    ap data
    puts

    case data.fetch('message')['action']
      when 'start'
        start data
      when 'pause'
        pause
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
    #   разослать  action: 'start', end_time: period.end_time

    unless current_user.pomo_started? # when pomo NOT started

      porject_id = data.fetch('message')['project']
      project = current_user.projects.find(porject_id)

      # получаем последний цикл
      pomo_cycle = project.pomo_cycles.last
      # если цикла нет или он завершился создаем новый
      if !pomo_cycle or pomo_cycle.ended
        pomo_cycle = project.pomo_cycles.create({ended: false})
      end

      # получаем последний период
      period = pomo_cycle.periods.last
      # если периода нет или он завершился создаем новый
      if !period
        period = pomo_cycle.periods.create({periods_type: 'pomo', status: 'starting', end_time: (Time.now + 24.minutes - 1.second).to_m})
      elsif period.ended?
        if period.periods_type == 'shot break'
          period = pomo_cycle.periods.create({periods_type: 'pomo', status: 'starting', end_time: (Time.now + 24.minutes - 1.second).to_m})
        elsif period.periods_type == 'pomo'
          if period.id == 7
            period = pomo_cycle.periods.create({periods_type: 'long break', status: 'starting', end_time: (Time.now + 14.minutes - 1.second).to_m})
          else
            period = pomo_cycle.periods.create({periods_type: 'shot break', status: 'starting', end_time: (Time.now + 4.minutes - 1.second).to_m})
          end
        end
      end

      current_user.started_project = project.id
      current_user.save

      ap period
      ActionCable.server.broadcast stream_name, {action: 'start', end_time: period.end_time}
    end

  end

  def pause
    puts
    ap 'PAUSE METHOD'

    # Должен менять:
    #   current_user.started_project на nil
    #   записать в базу время паузы
    #   разослать action: 'pause'



    ActionCable.server.broadcast stream_name, {action: 'pause'}
  end

  def stop data
    puts
    ap 'STOP METHOD'

    # Должен менять:
    #   current_user.started_project на nil
    #   удалить текущий период

    if current_user.pomo_started?

      current_user.started_project = nil

      porject_id = data.fetch('message')['project']
      project = current_user.projects.find(porject_id)

      project.pomo_cycles.last.periods.last.destroy

      ActionCable.server.broadcast stream_name, {action: 'stop'}
    end


  end

  def end
    # Должен менять:
    #   current_user.started_project на nil
    #   изменить period.ended на true
    #   если последний период в цикле то:
    #     изменить pomo_cycle.ended на true И разослать информацию о завершении цикла ???
    #   если НЕ последний период в цикле то:
    #     запустить следующий период

    ap 'END METHOD'
  end

end
# [:project]



# #TODO: fix to run only one timer
# def start
#   ap 'START METHOD'
#
#   # Должен менять:
#   #   если помидор уже был запущен вернуть информацию об этом
#   #   current_user.started_proect на номер запушеного проекта
#   #   разослать  action: 'start', end_time: period.end_time
#
#
#   if current_user.pomo_started?
#     return ActionCable.server.broadcast stream_name, {action: 'start', end_time: period.end_time}
#   end
#
#   project = current_user.projects.find(current_user.started_proect)
#   pomo_cycle = project.pomo_cycles.last
#
#   if !pomo_cycle or pomo_cycle.ended
#     pomo_cycle = project.pomo_cycles.create({ended: false})
#   end
#
#   periods = pomo_cycle.periods
#   period = periods.last
#
#   if !period or period.ended
#     if periods.empty?
#       period = pomo_cycle.periods.create({periods_type:'pomo', end_time: (Time.now + 25.minutes).to_m})
#     elsif periods[periods.size - 1].periods_type == 'short brake'
#       period = pomo_cycle.periods.create({periods_type: 'pomo', end_time: (Time.now + 25.minutes).to_m})
#     elsif periods[periods.size - 1].periods_type == 'pomo'
#       (periods.size == (cycle_size - 1)) ?
#           period = pomo_cycle.periods.create({periods_type: 'long break', end_time: (Time.now + 15.minutes).to_m}) :
#           period = pomo_cycle.periods.create({periods_type: 'shot break', end_time: (Time.now + 5.minutes).to_m})
#     end
#   else
#     if period.parts.last and period.parts.last.parts_type == 'pause'
#       period.end_time = (Time.now + period.end_time - period.parts.last.time).to_m
#     end
#     period.save
#   end
#
#   part = period.parts.create({parts_type: 'start', time: Time.now.to_m})
#   ActionCable.server.broadcast stream_name, {action: 'start', end_time: period.end_time}
# end
