class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :pomo_cycle, :pomo_count, :time

  def pomo_cycle
    object.pomo_cycle.serialize
  end

  def pomo_count
    @pomo_count = object.statistics.count * 4
    @pomo_count += object.pomo_cycle.periods.where(periods_type: 'pomo', ended: true).count if object.pomo_cycle
    @pomo_count
  end

  def time
    "#{@pomo_count/60}:#{@pomo_count%60}"
  end

end
