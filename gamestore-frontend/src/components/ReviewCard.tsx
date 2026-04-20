import type { Review } from "../types";
import { formatRelativeTime, getStarString, getRatingLabel } from "../utils";
import "./ReviewCard.css";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__stars" title={`${review.rating}/5`}>
          {getStarString(review.rating)}
        </div>
        <span className="review-card__label">{getRatingLabel(review.rating)}</span>
        <span className="review-card__date">{formatRelativeTime(review.date)}</span>
        {review.employeeReviewed && (
          <span className="review-card__badge">Staff Pick</span>
        )}
      </div>

      <p className="review-card__body">{review.description}</p>

      <div className="review-card__footer">
        <button className="review-card__vote">
          <span>👍</span> {review.likeCount}
        </button>
        <button className="review-card__vote">
          <span>👎</span> {review.dislikeCount}
        </button>
      </div>
    </div>
  );
}