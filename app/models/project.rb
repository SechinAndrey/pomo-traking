class Project < ApplicationRecord
  belongs_to :user

  has_many :pomo_cycles, dependent: :destroy
end
