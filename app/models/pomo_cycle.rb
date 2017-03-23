class PomoCycle < ApplicationRecord
  belongs_to :project
  has_many :periods, dependent: :destroy

  def load_timer
    if current?
      period = self.periods.last
      unless period.nil?
        if started?
          end_timer if period.end_time - Time.now.to_m <= 0
        elsif paused?
          period.update({
              end_time: Time.now.to_m + (period.end_time - period.pause_time),
              pause_time: Time.now.to_m
          })
        end
      end
      self.project
    end
  end

  def start_timer
    if started?
      ap 'timer is started'
    else
      period = self.periods.last

      if !period
        period = self.periods.create({periods_type: 'pomo'})
      elsif period.ended?
        if period.periods_type == 'short break'
          period = self.periods.create({ periods_type: 'pomo'})
        elsif period.periods_type == 'pomo'
          if self.periods.size == 7 # pomo count in cycle
            period = self.periods.create({ periods_type: 'long break'})
          else
            period = self.periods.create ({ periods_type: 'short break' })
          end
        end
      elsif paused?
        period.update({ end_time: Time.now.to_m + (period.end_time - period.pause_time) })
      end

      self.project.user.update({current_project_id: self.project.id})
      self.update({status: 'started'})
    end
  end

  def pause_timer
    if started? and current?
      self.periods.last.update({pause_time: Time.now.to_m})
      self.update({status: 'paused'})
    end
  end

  def stop_timer
    if !stopped? and current?
      self.periods.last.destroy
      self.update({status: 'stopped'})
    end
  end

  def switch_timer
    if self.project.user.current_project.pomo_cycle.started?
      self.project.user.current_project.pomo_cycle.pause_timer
      self.start_timer
    end
  end

  def end_timer
    if started? and current?
      periods = self.periods
      if periods.size == 8
        work_minutes = 0
        periods.each { |period| work_minutes += period.duration if period.periods_type == 'pomo' }
        if self.project.statistics.new({work_minutes: work_minutes}).save
          self.destroy
        end
      else
        self.update({status: 'ended'})
        periods.last.update({ended: true})
        start_timer
      end
    end
  end

  def current?
    self.project.user.current_project_id == self.project.id
  end

  def started?
    self.status == 'started'
  end

  def paused?
    self.status == 'paused'
  end

  def stopped?
    self.status == 'stopped'
  end
end
