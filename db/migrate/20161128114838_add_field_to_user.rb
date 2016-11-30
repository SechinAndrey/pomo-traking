class AddFieldToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :pomo_time, :integer, default: 25
    add_column :users, :short_break_time, :integer, default: 5
    add_column :users, :long_break_time, :integer, default: 15
  end
end
