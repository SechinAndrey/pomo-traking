class ChangeCurrentProjectToCurrentProjectId < ActiveRecord::Migration[5.0]
  def change
    rename_column :users, :current_project, :current_project_id
  end
end
