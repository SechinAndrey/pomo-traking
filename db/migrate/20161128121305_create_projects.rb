class CreateProjects < ActiveRecord::Migration[5.0]
  def change
    create_table :projects do |t|
      t.integer :user_id
      t.string :title
      t.integer :pomo_time
      t.integer :short_break_time
      t.integer :long_break_time

      t.timestamps
    end
  end
end
