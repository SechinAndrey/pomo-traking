class RemoveColumn < ActiveRecord::Migration[5.0]
  def change
    remove_column :periods, :status
    remove_column :projects, :pomo_time
    remove_column :projects, :short_break_time
    remove_column :projects, :long_break_time
    remove_column :users, :pomo_time
    remove_column :users, :short_break_time
    remove_column :users, :long_break_time
    remove_column :users, :current_project_status
  end
end
