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
    unless started?

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

end
