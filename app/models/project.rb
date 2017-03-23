class Project < ApplicationRecord
  belongs_to :user
  has_one :pomo_cycle, dependent: :destroy
  has_one :duration_settings, as: :durationable
  has_many :statistics, dependent: :destroy

  validates :title, presence: true
  validates :title, length: { maximum: 100 }
end
