class PomoCycleSerializer < ActiveModel::Serializer
  attributes :ended, :status
  has_many :periods
end
