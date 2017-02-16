class Project < ApplicationRecord
  belongs_to :user
  has_many :pomo_cycles, dependent: :destroy

  validates :title, :pomo_time, :short_break_time, :long_break_time, presence: true
  validates :title, length: { maximum: 100 }
  validates :pomo_time, :short_break_time, :long_break_time, numericality: {
      only_integer: true,
      greater_than_or_equal_to: 1,
      less_than_or_equal_to: 100
  }
end
