class Period < ApplicationRecord
  belongs_to :pomo_cycle
  has_many :parts, dependent: :destroy

  def ended?
    self.status == 'ended'
  end

  def paused?
    self.status == 'paused'
  end

end
