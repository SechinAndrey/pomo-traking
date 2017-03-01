class AddDuratuionToPeriod < ActiveRecord::Migration[5.0]
  def change
    add_column :periods, :duration, :integer
  end
end
