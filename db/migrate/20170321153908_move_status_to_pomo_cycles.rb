class MoveStatusToPomoCycles < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :status
    add_column :pomo_cycles, :status, :string
  end
end
