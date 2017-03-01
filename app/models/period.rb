class Period < ApplicationRecord
  belongs_to :pomo_cycle

  def ended?
    self.ended
  end
end
