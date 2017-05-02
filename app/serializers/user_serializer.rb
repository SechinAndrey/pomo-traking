class UserSerializer < ActiveModel::Serializer
  attributes :id, :current_project_id, :email, :username, :avatar,
             :pomo_duration, :short_break_duration, :long_break_duration

  def avatar
    object.avatar&.avatar_url
  end

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
