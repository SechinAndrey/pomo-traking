class ChangeProjectColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :periods, :ended, :status
    change_column :periods, :status, :string
    add_column :periods, :pause_time, :integer, limit: 8
  end
end
