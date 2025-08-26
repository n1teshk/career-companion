class CreateFinals < ActiveRecord::Migration[7.1]
  def change
    create_table :finals do |t|
      t.references :cl, null: false, foreign_key: true
      t.references :pitch, null: false, foreign_key: true
      t.references :application, null: false, foreign_key: true

      t.timestamps
    end
  end
end
