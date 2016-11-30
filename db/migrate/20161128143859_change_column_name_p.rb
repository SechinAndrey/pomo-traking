class ChangeColumnNameP < ActiveRecord::Migration[5.0]
  def change
    rename_column :periods, :parts_type, :periods_type
  end
end
