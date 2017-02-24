class DurationSettings < ApplicationRecord
  belongs_to :durationable, polymorphic: true

  validates :pomo_duration, :short_break_duration, :long_break_duration, presence: true
  validates :pomo_duration, :short_break_duration, :long_break_duration, numericality: {
      only_integer: true,
      greater_than_or_equal_to: 1,
      less_than_or_equal_to: 100
  }
end