class AddAvatarToAvatar < ActiveRecord::Migration[5.0]
  def change
    add_column :avatars, :avatar, :string
  end
end
