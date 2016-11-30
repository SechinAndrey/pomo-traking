class CreatePeriods < ActiveRecord::Migration[5.0]
  def change
    create_table :periods do |t|
      t.integer :pomo_cycle_id
      t.string :type
      t.integer :end_time
      t.boolean :ended

      t.timestamps
    end
  end
end
