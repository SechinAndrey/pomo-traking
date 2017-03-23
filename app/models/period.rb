class Period < ApplicationRecord
  before_create :set_duration
  belongs_to :pomo_cycle

  def ended?
    self.ended
  end

  private
  def set_duration
    self.duration = (self.pomo_cycle.project.duration_settings ||
        self.pomo_cycle.project.user.duration_settings)["#{self.periods_type.parameterize.underscore}_duration"]
    self.end_time = (Time.now + self.duration.minutes).to_m
  end

end
