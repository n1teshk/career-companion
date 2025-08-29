class AddGenerationFieldsToApplications < ActiveRecord::Migration[7.1]
  def change
    add_column :applications, :cl_message, :text
    add_column :applications, :cl_status, :string, default: "pending", null: false
    add_column :applications, :video_message, :text
    add_column :applications, :video_status, :string, default: "pending", null: false
  end
end
