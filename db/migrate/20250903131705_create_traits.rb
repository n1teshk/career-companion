class CreateTraits < ActiveRecord::Migration[7.1]
  def change
    create_table :traits do |t|
      t.text :first
      t.text :second
      t.text :third
      t.text :fourth

      t.timestamps
    end
  end
end
