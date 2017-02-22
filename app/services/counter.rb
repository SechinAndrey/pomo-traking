class Counter
  def initialize(user)
    @user = user
  end

  def loading
    puts
    ap 'LOADING METHOD'

    @user.reload
    unless @user.current_project.nil?
      project = @user.projects.find(@user.current_project)
      pomo_cycle = project.pomo_cycles.last
      period = pomo_cycle.periods.last if pomo_cycle

      unless period.nil?
        if @user.pomo_started?
          if period.end_time - Time.now.to_m <= 0
            end_pomo @user.current_project
          else
            return {action: 'start', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status]), project: project.as_json(only: [:id, :title])}
          end
        elsif @user.pomo_paused?
          period.update({status: 'paused', end_time: Time.now.to_m + (period.end_time - period.pause_time), pause_time: Time.now.to_m})
          @user.update({current_project_status: 'paused'})
          return {action: 'loading', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status]), project: project.as_json(only: [:id, :title])}
        end
      end
    end

    ap 'END LOADING'
  end

  def start porject_id
    puts
    ap 'START METHOD'

    @user.reload
    project = @user.projects.find(porject_id)

    pomo_cycle = project.pomo_cycles.last
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

    @user.update({current_project: project.id, current_project_status: 'started'})
    {action: 'start', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
  end

  def pause porject_id
    puts
    ap 'PAUSE METHOD'

    @user.reload
    @user.update({current_project_status: 'paused'})

    project = @user.projects.find(porject_id)

    pomo_cycle = project.pomo_cycles.last
    period = pomo_cycle.periods.last
    period.update({status: 'paused', pause_time: Time.now.to_m})

    {action: 'pause', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
  end

  def stop porject_id
    puts
    ap 'STOP METHOD'

    @user.reload
    project = @user.projects.find(porject_id)

    pomo_cycle = project.pomo_cycles.last
    period = pomo_cycle.periods.last

    @user.update({current_project_status: 'stopped'})

    if period
      period.destroy
    end

    {action: 'stop', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
  end

  def end_pomo porject_id
    ap "END METHOD #{REDIS.get("sync_end_action_#{@user.id}")}"

    @user.reload
    if @user.pomo_started?
      project = @user.projects.find(porject_id)

      pomo_cycle = project.pomo_cycles.last
      periods = pomo_cycle.periods
      period = periods.last

      period.update({status: 'ended'})
      @user.update({current_project_status: 'ended'})

      if periods.size == 8
        pomo_cycle.update({ended: true})
        return {action: 'end', periods: pomo_cycle.periods.as_json(only: [:end_time, :periods_type, :status])}
      else
        start porject_id
      end
    end
  end

end