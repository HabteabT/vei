import { Star, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useAuth } from '../app/auth'
import { useObservable } from '../app/hooks'
import { useServices } from '../app/services'
import { averageRating, validateReview } from '../domain/reviews'
import { Button } from '../ui/Button'
import { useAuthGate } from './useAuthGate'

function Stars({ value, onChange, label }: { value: number; onChange?: (next: number) => void; label: string }) {
  const shown = onChange ? value : Math.round(value)
  return (
    <div className="stars" role={onChange ? 'group' : 'img'} aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) =>
        onChange ? (
          <button key={star} type="button" className={star <= shown ? 'is-on' : ''} aria-pressed={value === star} aria-label={`${star} star${star === 1 ? '' : 's'}`} onClick={() => onChange(star)}>
            <Star aria-hidden="true" />
          </button>
        ) : (
          <Star key={star} className={star <= shown ? 'is-on' : ''} aria-hidden="true" />
        ),
      )}
    </div>
  )
}

/** Ratings and comments for one place. Writing needs a signed-in account. */
export function PlaceReviews({ placeId, placeName }: { placeId: string; placeName: string }) {
  const { user } = useAuth()
  const { reviews } = useServices()
  const all = useObservable(reviews)
  const [gate, gateModal] = useAuthGate('Sign in to rate this place and write a comment.')
  const mine = all.find((review) => review.placeId === placeId && review.userId === user?.id)
  const list = all.filter((review) => review.placeId === placeId).sort((a, b) => b.createdAt - a.createdAt)
  const average = averageRating(list.map((review) => review.rating))
  const [rating, setRating] = useState(mine?.rating ?? 0)
  const [text, setText] = useState(mine?.text ?? '')
  const [error, setError] = useState<string | null>(null)

  const save = (event: FormEvent) => {
    event.preventDefault()
    if (!user) return
    const problem = validateReview({ rating, text })
    if (problem) return setError(problem)
    reviews.save({ placeId, userId: user.id, authorName: user.name, rating, text })
    setError(null)
  }

  return (
    <section className="card card--pad stack" aria-labelledby="reviews-h">
      <div className="reviews__head">
        <h2 id="reviews-h" className="card-title">
          Ratings and comments
        </h2>
        {average !== null && (
          <p className="reviews__avg">
            <Stars value={average} label={`${average} out of 5, from ${list.length} review${list.length === 1 ? '' : 's'}`} />
            <span>
              {average} · {list.length} review{list.length === 1 ? '' : 's'}
            </span>
          </p>
        )}
      </div>

      {user ? (
        <form className="stack" onSubmit={save}>
          <Stars value={rating} onChange={setRating} label={`Your rating for ${placeName}`} />
          <label className="field">
            <span className="field__label">{mine ? 'Edit your comment' : 'Your comment'}</span>
            <textarea className="field__input review__text" rows={4} value={text} onChange={(event) => setText(event.target.value)} placeholder="What was it like, and how did you get there?" />
          </label>
          {error && <p className="field__error" role="alert">{error}</p>}
          <div className="row">
            <Button type="submit">{mine ? 'Update review' : 'Publish review'}</Button>
            {mine && (
              <Button type="button" variant="danger" onClick={() => { reviews.remove(mine.id, user.id); setRating(0); setText(''); setError(null) }}>
                <Trash2 aria-hidden="true" /> Delete
              </Button>
            )}
          </div>
        </form>
      ) : (
        <Button type="button" variant="secondary" onClick={gate(() => undefined)}>
          Sign in to rate and comment
        </Button>
      )}

      {list.length === 0 ? (
        <p className="muted">No comments yet.</p>
      ) : (
        <ul className="reviews">
          {list.map((review) => (
            <li key={review.id} className="review">
              <div className="review__top">
                <strong>{review.authorName}</strong>
                <Stars value={review.rating} label={`${review.rating} out of 5`} />
              </div>
              <p>{review.text}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="fineprint">In this demo, comments stay in this browser. Other people on this device can read them. A later version would keep them on a server.</p>
      {gateModal}
    </section>
  )
}
