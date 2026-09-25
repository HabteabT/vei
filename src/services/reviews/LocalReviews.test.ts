import { describe, expect, it } from 'vitest'
import type { IdGenerator } from '../auth/LocalAuthService'
import { MemoryStore } from '../storage/MemoryStore'
import { LocalReviews } from './LocalReviews'

function setup() {
  let n = 0
  const ids: IdGenerator = { id: () => `r${++n}`, token: () => 't' }
  let clock = 100
  const reviews = new LocalReviews(new MemoryStore(), ids, () => clock++)
  return reviews
}

describe('LocalReviews', () => {
  it('lets a signed-in visitor rate, edit, and delete their own comment', () => {
    const reviews = setup()
    const saved = reviews.save({ placeId: 'dyreparken', userId: 'u1', authorName: 'Ada', rating: 5, text: 'We spent the whole day here.' })
    expect(saved.rating).toBe(5)
    const edited = reviews.save({ placeId: 'dyreparken', userId: 'u1', authorName: 'Ada', rating: 4, text: 'Still a great day for the family.' })
    expect(edited.id).toBe(saved.id)
    expect(reviews.get()).toHaveLength(1)
    expect(reviews.get()[0].rating).toBe(4)
    reviews.remove(saved.id, 'someone-else')
    expect(reviews.get()).toHaveLength(1)
    reviews.remove(saved.id, 'u1')
    expect(reviews.get()).toEqual([])
  })

  it('keeps other people\'s comments and drops them when that account is deleted', () => {
    const reviews = setup()
    reviews.save({ placeId: 'dyreparken', userId: 'u1', authorName: 'Ada', rating: 5, text: 'Easy to reach by bus.' })
    reviews.save({ placeId: 'dyreparken', userId: 'u2', authorName: 'Bo', rating: 3, text: 'Busy, but the children loved it.' })
    expect(reviews.get().map((review) => review.userId)).toEqual(['u1', 'u2'])
    reviews.purgeUser('u1')
    expect(reviews.get().map((review) => review.authorName)).toEqual(['Bo'])
  })

  it('rejects an empty comment', () => {
    const reviews = setup()
    expect(() => reviews.save({ placeId: 'dyreparken', userId: 'u1', authorName: 'Ada', rating: 5, text: 'Hi' })).toThrow(/at least 8/)
  })
})
