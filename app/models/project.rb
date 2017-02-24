class Project < ApplicationRecord
  belongs_to :user
  has_many :pomo_cycles, dependent: :destroy
  has_one :duration_settings, as: :durationable

  validates :title, presence: true
  validates :title, length: { maximum: 100 }
end
