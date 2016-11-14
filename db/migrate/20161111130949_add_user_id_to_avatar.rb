class AddUserIdToAvatar < ActiveRecord::Migration[5.0]
  def change
    add_column :avatars, :user_id, :integer
  end
end
