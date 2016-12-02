class AddCurrentProjectStatusToUser < ActiveRecord::Migration[5.0]
  def change
    rename_column :users, :started_project, :current_project
    add_column :users, :current_project_status, :string
  end
end
