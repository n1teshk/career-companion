class ReplaceClAndPitchIdsWithTextOnFinals < ActiveRecord::Migration[7.1]
  def up
    # drop indexes/FKs if they exist (safe-guarded)
    remove_index :finals, :cl_id    if index_exists?(:finals, :cl_id)
    remove_index :finals, :pitch_id if index_exists?(:finals, :pitch_id)

    begin remove_foreign_key :finals, :cls     rescue StandardError; end
    begin remove_foreign_key :finals, :pitches rescue StandardError; end

    # remove the wrong columns
    remove_column :finals, :cl_id,    :bigint
    remove_column :finals, :pitch_id, :bigint

    # add the correct text columns
    add_column :finals, :cl,    :text
    add_column :finals, :pitch, :text
  end

  def down
    # rollback: remove text columns, restore *_id columns + indexes
    remove_column :finals, :cl
    remove_column :finals, :pitch

    add_column :finals, :cl_id,    :bigint, null: false
    add_column :finals, :pitch_id, :bigint, null: false
    add_index  :finals, :cl_id
    add_index  :finals, :pitch_id
  end
end
