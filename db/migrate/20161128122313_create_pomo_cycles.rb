class CreatePomoCycles < ActiveRecord::Migration[5.0]
  def change
    create_table :pomo_cycles do |t|
      t.integer :project_id
      t.boolean :ended

      t.timestamps
    end
  end
end
