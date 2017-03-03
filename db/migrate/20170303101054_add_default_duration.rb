class AddDefaultDuration < ActiveRecord::Migration[5.0]
  def change
    change_column :duration_settings, :pomo_duration, :integer, :default => 25
    change_column :duration_settings, :short_break_duration, :integer, :default => 5
    change_column :duration_settings, :long_break_duration, :integer, :default => 15
  end
end
