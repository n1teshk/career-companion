class Application < ApplicationRecord
  belongs_to :user
  has_one_attached :cv
  validates :job_d, presence: true
  has_many :finals
end
