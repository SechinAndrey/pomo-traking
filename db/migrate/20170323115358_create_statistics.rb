class CreateStatistics < ActiveRecord::Migration[5.0]
  def change
    create_table :statistics do |t|
      t.references :project, foreign_key: true
      t.bigint :work_minutes

      t.timestamps
    end
  end
end
