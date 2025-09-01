class AddFieldsToApplications < ActiveRecord::Migration[7.1]
  def change
    add_column :applications, :name, :text
    add_column :applications, :title, :text
  end
end
