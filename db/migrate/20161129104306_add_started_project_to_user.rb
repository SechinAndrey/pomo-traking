class AddStartedProjectToUser < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :started_project, :integer
  end
end
