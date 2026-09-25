/** A visitor's rating and comment for one place. */
export interface ReviewInput {
  rating: number
  text: string
}

/** Returns an error message, or null when the review can be saved. */
export function validateReview({ rating, text }: ReviewInput): string | null {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Choose a rating from 1 to 5 stars.'
  const body = text.trim()
  if (body.length < 8) return 'Write a short comment, at least 8 characters.'
  if (body.length > 800) return 'Keep the comment under 800 characters.'
  return null
}

export function averageRating(ratings: number[]): number | null {
  if (ratings.length === 0) return null
  const total = ratings.reduce((sum, rating) => sum + rating, 0)
  return Math.round((total / ratings.length) * 10) / 10
}
