class DurationSettings < ApplicationRecord
  belongs_to :durationable, polymorphic: true
end