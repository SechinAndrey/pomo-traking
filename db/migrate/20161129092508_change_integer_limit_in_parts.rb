class ChangeIntegerLimitInParts < ActiveRecord::Migration[5.0]
  def change
    change_column :parts, :time, :integer, limit: 8
  end
end
