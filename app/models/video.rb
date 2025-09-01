class Video < ApplicationRecord
  belongs_to :application
  has_one_attached :file
end
