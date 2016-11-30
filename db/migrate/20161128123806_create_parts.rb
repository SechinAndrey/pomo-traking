class CreateParts < ActiveRecord::Migration[5.0]
  def change
    create_table :parts do |t|
      t.integer :period_id
      t.string :type
      t.integer :time

      t.timestamps
    end
  end
end
