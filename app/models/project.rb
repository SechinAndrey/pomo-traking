class Project < ApplicationRecord
  belongs_to :user
  has_many :pomo_cycles, dependent: :destroy
  has_one :duration_settings, as: :durationable

  validates :title, presence: true
  validates :title, length: { maximum: 100 }

  def load_timer
    ap 'qweqweqwe'
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