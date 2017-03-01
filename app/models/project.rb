class Project < ApplicationRecord
  belongs_to :user
  has_many :pomo_cycles, dependent: :destroy
  has_one :duration_settings, as: :durationable

  validates :title, presence: true
  validates :title, length: { maximum: 100 }

  def load_timer
    if current?
      period = self.pomo_cycles.last.periods.last if self.pomo_cycles.last
      unless period.nil?
        if started?
          end_timer if period.end_time - Time.now.to_m <= 0
        elsif paused?
          period.update({
            status: 'paused',
            end_time: Time.now.to_m + (period.end_time - period.pause_time),
            pause_time: Time.now.to_m
            })
        end
      end
      self
    end
  end

  def start_timer
    if started?
      ap 'timer is started'
    elsif current?
      pomo_cycle = self.pomo_cycles.last
      pomo_cycle = self.pomo_cycles.create if !pomo_cycle or pomo_cycle.ended
      period = pomo_cycle.periods.last

      if !period
        period = pomo_cycle.periods.create({
           periods_type: 'pomo',
           duration: pomo_duration,
           end_time: (Time.now + pomo_duration.minutes).to_m
         })
      elsif period.ended?
        if period.periods_type == 'shot break'
          period = pomo_cycle.periods.create({
             periods_type: 'pomo',
             duration: pomo_duration,
             end_time: (Time.now + pomo_duration.minutes).to_m
          })
        elsif period.periods_type == 'pomo'
          if pomo_cycle.periods.size == 7 # pomo count in cycle
            period = pomo_cycle.periods.create({
                periods_type: 'long break',
                duration: long_break_duration,
                end_time: (Time.now + long_break_duration.minutes).to_m
            })
          else
            period = pomo_cycle.periods.create ({
                periods_type: 'shot break',
                duration: short_break_duration,
                end_time: (Time.now + short_break_duration.minutes).to_m
            })
          end
        end
      elsif paused?
        period.update({
            status: 'started',
            end_time: Time.now.to_m + (period.end_time - period.pause_time)
        })
      end

      self.user.update({current_project_id: self.id})
      self.update({status: 'started'})
    end
  end

  def pause_timer
    unless paused?

    end
  end

  def stop_timer
    unless stopped?

    end
  end

  def end_timer
    if started?

    end
  end

  def current?
    self.user.current_project_id == self.id
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

  def pomo_duration
    duration_settings = self.duration_settings
    duration_settings = self.user.duration_settings if duration_settings.nil?
    duration_settings[:pomo_duration]
  end

  def short_break_duration
    duration_settings = self.duration_settings
    duration_settings = self.user.duration_settings if duration_settings.nil?
    duration_settings[:short_break_duration]
  end

  def long_break_duration
    duration_settings = self.duration_settings
    duration_settings = self.user.duration_settings if duration_settings.nil?
    duration_settings[:long_break_duration]
  end

  def xxx
  end

end
