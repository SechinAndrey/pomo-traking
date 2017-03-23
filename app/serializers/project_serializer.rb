class ProjectSerializer < ActiveModel::Serializer
  attributes :id, :title, :pomo_cycle

  def pomo_cycle
    object.pomo_cycle.serialize
  end
end
