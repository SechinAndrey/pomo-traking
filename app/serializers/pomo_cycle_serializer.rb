class PomoCycleSerializer < ActiveModel::Serializer
  attributes :ended
  has_many :periods
end
