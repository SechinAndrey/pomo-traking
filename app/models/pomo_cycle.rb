class PomoCycle < ApplicationRecord
  belongs_to :project
  has_many :periods, dependent: :destroy
end
