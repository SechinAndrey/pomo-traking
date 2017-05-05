class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :pomo_cycle, :pomo_count, :time,
             :pomo_duration, :short_break_duration, :long_break_duration

  def pomo_cycle
    PomoCycle.where(id: object.pomo_cycle&.id).last.serialize
  end

  def pomo_count
    @pomo_count = object.statistics.count * 4
    @pomo_count += object.pomo_cycle.periods.where(periods_type: 'pomo', ended: true).count if object.pomo_cycle
    @pomo_count
  end

  def time
    "#{@pomo_count/60}:#{@pomo_count%60}"
  end

  def pomo_duration
    object.duration_settings&.pomo_duration || object.user.duration_settings.pomo_duration
  end

  def short_break_duration
    object.duration_settings&.short_break_duration || object.user.duration_settings.short_break_duration
  end

  def long_break_duration
    object.duration_settings&.long_break_duration || object.user.duration_settings.long_break_duration
  end
end
