class ChangeColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :parts, :type, :parts_type
    rename_column :periods, :type, :parts_type
  end
end
