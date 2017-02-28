class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :status, :pomo_cycle

  def pomo_cycle
    object.pomo_cycles.last.serialize
  end
end
