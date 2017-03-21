class Period < ApplicationRecord
  belongs_to :pomo_cycle

  # TODO:
  # 1. create method

  def ended?
    self.ended
  end
end
