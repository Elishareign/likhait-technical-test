class Expense < ApplicationRecord
  belongs_to :category

  validates :description,
            presence: true,
            length: { maximum: 255 },
            format: { with: /\A[a-zA-Z0-9\s.,'-]+\z/, message: "contains invalid characters" }

  validates :amount,
            presence: true,
            numericality: { greater_than: 0, less_than_or_equal_to: 1_000_000 }

  validates :category_id, presence: true
  validates :date, presence: true

  private

end