class CreatePitches < ActiveRecord::Migration[7.1]
  def change
    create_table :pitches do |t|
      t.references :application, null: false, foreign_key: true
      t.string :title
      t.text :content

      t.timestamps
    end
  end
end
