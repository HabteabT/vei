import { validateReview } from '../../domain/reviews'
import type { IdGenerator } from '../auth/LocalAuthService'
import { JsonRecord } from '../storage/JsonRecord'
import type { KeyValueStore, Unsubscribe } from '../storage/KeyValueStore'

export interface StoredReview {
  id: string
  placeId: string
  userId: string
  authorName: string
  rating: number
  text: string
  createdAt: number
  updatedAt: number
}

/**
 * Reviews live in this browser, shared by every account on the device, so people
 * can read each other's comments. A real launch would move this to the server.
 */
export class LocalReviews {
  private readonly record: JsonRecord<StoredReview[]>

  constructor(
    store: KeyValueStore,
    private readonly ids: IdGenerator,
    private readonly now: () => number = Date.now,
  ) {
    this.record = new JsonRecord<StoredReview[]>(store, 'vei.data.reviews', [])
    this.get = this.get.bind(this)
    this.subscribe = this.subscribe.bind(this)
  }

  get(): StoredReview[] {
    return this.record.get()
  }

  subscribe(listener: () => void): Unsubscribe {
    return this.record.subscribe(listener)
  }

  /** Creates a review, or replaces the one this person already wrote for the place. */
  save(input: { placeId: string; userId: string; authorName: string; rating: number; text: string }): StoredReview {
    const text = input.text.trim()
    const error = validateReview({ rating: input.rating, text })
    if (error) throw new Error(error)
    const current = this.get()
    const existing = current.find((review) => review.placeId === input.placeId && review.userId === input.userId)
    if (existing) {
      const updated: StoredReview = {
        ...existing,
        authorName: input.authorName.trim() || existing.authorName,
        rating: input.rating,
        text,
        updatedAt: this.now(),
      }
      this.record.set(current.map((review) => (review.id === existing.id ? updated : review)))
      return updated
    }
    const created: StoredReview = {
      id: this.ids.id(),
      placeId: input.placeId,
      userId: input.userId,
      authorName: input.authorName.trim() || 'Visitor',
      rating: input.rating,
      text,
      createdAt: this.now(),
      updatedAt: this.now(),
    }
    this.record.set([...current, created])
    return created
  }

  /** Removes a review only when it belongs to this user. */
  remove(id: string, userId: string): void {
    this.record.set(this.get().filter((review) => !(review.id === id && review.userId === userId)))
  }

  purgeUser(userId: string): void {
    this.record.set(this.get().filter((review) => review.userId !== userId))
  }
}
