class AddEndedToPeriods < ActiveRecord::Migration[5.0]
  def change
    add_column :periods, :ended, :boolean, :default => false
  end
end
