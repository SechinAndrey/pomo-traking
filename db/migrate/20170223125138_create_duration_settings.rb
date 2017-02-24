class CreateDurationSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :duration_settings do |t|
      t.integer :pomo_duration
      t.integer :short_break_duration
      t.integer :long_break_duration

      t.integer :durationable_id
      t.string :durationable_type

      t.timestamps
    end
    add_index :duration_settings, [:durationable_id, :durationable_type], name: 'index_duration_settings'
  end
end
