class AddApplicationToTraits < ActiveRecord::Migration[7.1]
  def change
    add_reference :traits, :application, foreign_key: true
  end
end
