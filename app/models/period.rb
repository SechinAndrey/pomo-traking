class Period < ApplicationRecord
  belongs_to :pomo_cycle

  def ended?
    self.status == 'ended'
  end

  def paused?
    self.status == 'paused'
  end

end
