class PeriodSerializer < ActiveModel::Serializer
  attributes :id, :periods_type, :end_time, :pause_time
end
