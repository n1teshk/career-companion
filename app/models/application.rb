class Application < ApplicationRecord
  belongs_to :user

  validates :job_d, presence: true
end
