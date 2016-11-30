class ChangeIntegerLimitInTables < ActiveRecord::Migration[5.0]
  def change
    change_column :periods, :end_time, :integer, limit: 8
  end
end
