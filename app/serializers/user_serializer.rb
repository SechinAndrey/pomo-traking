class UserSerializer < ActiveModel::Serializer
  ap '*' *1000
  attributes :id, :current_project_id, :email, :username,
             :pomo_duration, :short_break_duration, :long_break_duration

  def pomo_duration
    object.duration_settings&.pomo_duration
  end

  def short_break_duration
    object.duration_settings&.short_break_duration
  end

  def long_break_duration
    object.duration_settings&.long_break_duration
  end
end
