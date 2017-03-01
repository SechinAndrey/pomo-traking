class AddDefaultToEnded < ActiveRecord::Migration[5.0]
  def change
    change_column :pomo_cycles, :ended, :boolean, :default => false
  end
end
