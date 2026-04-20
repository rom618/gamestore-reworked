import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ReviewCard from "../components/ReviewCard";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import { useGame } from "../hooks/useGame";
import { useReviews } from "../hooks/useReviews";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { formatPrice, getStarString, getRatingLabel } from "../utils";
import { reviewsApi } from "../api/reviews";
import "./ProductPage.css";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const gameId = Number(id);

  const { game, isLoading: gameLoading, error: gameError } = useGame(gameId);
  const { reviews, isLoading: reviewsLoading, refetch } = useReviews(gameId);
  const { addItem } = useCart();
  const { isLoggedIn, currentUser } = useAuth();

  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) { setReviewError("Review cannot be empty."); return; }
    if (!currentUser) return;
    setSubmitting(true);
    setReviewError("");
    try {
      await reviewsApi.create({
        description: reviewText,
        rating: reviewRating,
        gameId,
        customerId: currentUser.id,
      });
      setReviewText("");
      setReviewRating(5);
      refetch();
    } catch (e) {
      setReviewError("Failed to post review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (gameLoading) return <><Navbar /><Spinner label="Loading game…" /></>;
  if (gameError || !game) return (
    <><Navbar />
      <div className="product__error">
        <p>{gameError ?? "Game not found."}</p>
        <Button variant="ghost" onClick={() => navigate("/")}>← Back to Browse</Button>
      </div>
    </>
  );

  return (
    <div className="product">
      <Navbar />

      <div className="product__inner">
        <button className="product__back" onClick={() => navigate("/")}>← Browse</button>

        {/* Hero */}
        <div className="product__hero">
          <div className="product__cover">
            <div className="product__cover-placeholder">
              <span>{game.gameConsole}</span>
            </div>
          </div>

          <div className="product__info">
            <div className="product__tags">
              <span className="product__tag">{game.category}</span>
              <span className="product__tag product__tag--platform">{game.gameConsole}</span>
            </div>
            <h1 className="product__title">{game.name}</h1>

            {reviews.length > 0 && (
              <div className="product__rating">
                <span className="product__stars">{getStarString(avgRating)}</span>
                <span className="product__rating-label">{getRatingLabel(avgRating)}</span>
                <span className="product__rating-count">({reviews.length} reviews)</span>
              </div>
            )}

            <p className="product__desc">{game.description}</p>

            <div className="product__purchase">
              <span className="product__price">{formatPrice(game.price)}</span>
              <Button
                variant="primary"
                size="lg"
                onClick={() => addItem(game)}
              >
                Add to Cart
              </Button>
              <Button variant="ghost" size="lg">♡ Wishlist</Button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="product__reviews">
          <h2 className="product__section-title">
            Reviews
            {reviews.length > 0 && (
              <span className="product__section-count">{reviews.length}</span>
            )}
          </h2>

          {isLoggedIn && (
            <div className="product__review-form">
              <h3 className="product__form-title">Write a Review</h3>
              <div className="product__star-picker">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className={`product__star-btn ${s <= reviewRating ? "product__star-btn--active" : ""}`}
                    onClick={() => setReviewRating(s)}
                  >★</button>
                ))}
                <span className="product__star-label">{reviewRating}/5</span>
              </div>
              <textarea
                className="product__review-textarea"
                placeholder="Share your thoughts on this game…"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
              {reviewError && <p className="product__review-error">{reviewError}</p>}
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                loading={submitting}
              >
                Post Review
              </Button>
            </div>
          )}

          {reviewsLoading && <Spinner size="sm" label="Loading reviews…" />}
          {!reviewsLoading && reviews.length === 0 && (
            <p className="product__no-reviews">No reviews yet. Be the first!</p>
          )}
          <div className="product__reviews-list">
            {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        </section>
      </div>
    </div>
  );
}