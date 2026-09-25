import { describe, expect, it } from 'vitest'
import { averageRating, validateReview } from './reviews'

describe('reviews', () => {
  it('requires a star rating and a short comment', () => {
    expect(validateReview({ rating: 0, text: 'A full day with the family.' })).toMatch(/1 to 5/)
    expect(validateReview({ rating: 5, text: 'short' })).toMatch(/at least 8/)
    expect(validateReview({ rating: 4, text: 'We spent the whole day here.' })).toBeNull()
  })

  it('averages ratings and stays quiet when there are none', () => {
    expect(averageRating([])).toBeNull()
    expect(averageRating([5, 4, 4])).toBe(4.3)
  })
})
