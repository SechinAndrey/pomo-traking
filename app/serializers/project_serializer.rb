class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :pomo_cycle,
             :pomo_count, :time, :pomo_cycle_count, :short_break_count, :long_break_count,
             :pomo_duration, :short_break_duration, :long_break_duration

  def pomo_cycle
    PomoCycle.where(id: object.pomo_cycle&.id).last.serialize
  end

  ### statistics
  def pomo_count
    @pomo_count = object.statistics.count * 4
    @periods = object.pomo_cycle&.periods&.where(periods_type: 'pomo', ended: true)
    @pomo_count += @periods.count if object.pomo_cycle
    @pomo_count
  end

  def time
    work_minutes = object.statistics.sum(:work_minutes)
    @periods&.each do |period|
      work_minutes += period.duration
    end
    time_str work_minutes
  end

  def pomo_cycle_count
    @pomo_cycle_count = object.statistics.count
  end

  def short_break_count
    sb_count = object.statistics.count
    sb_count += object.pomo_cycle&.periods&.where(periods_type: 'short break', ended: true).count
  end

  def long_break_count
    @pomo_cycle_count
  end

  ### durations
  def pomo_duration
    object.duration_settings&.pomo_duration || object.user.duration_settings.pomo_duration
  end

  def short_break_duration
    object.duration_settings&.short_break_duration || object.user.duration_settings.short_break_duration
  end

  def long_break_duration
    object.duration_settings&.long_break_duration || object.user.duration_settings.long_break_duration
  end

  private

  def time_str work_minutes
    hours = ('00'+(work_minutes/60).to_s.split('.')[0]).slice(-2, 2)
    mins = ('00'+(work_minutes%60).to_s.split('.')[0]).slice(-2,2)
    "#{hours}:#{mins}"
  end

end
