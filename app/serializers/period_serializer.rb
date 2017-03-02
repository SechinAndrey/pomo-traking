class PeriodSerializer < ActiveModel::Serializer
  attributes :periods_type, :end_time, :pause_time, :ended
end
