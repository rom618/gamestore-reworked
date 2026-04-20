import { useNavigate } from "react-router-dom";
import type { Game } from "../types";
import { formatPrice } from "../utils";
import { useCart } from "../hooks/useCart";
import Button from "./ui/Button";
import "./GameCard.css";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  return (
    <div className="game-card" onClick={() => navigate(`/game/${game.id}`)}>
      <div className="game-card__img-wrap">
        <div className="game-card__img-placeholder">
          <span className="game-card__console">{game.gameConsole}</span>
        </div>
        <span className="game-card__category">{game.category}</span>
      </div>

      <div className="game-card__body">
        <h3 className="game-card__name">{game.name}</h3>
        <p className="game-card__desc">{game.description}</p>

        <div className="game-card__footer">
          <span className="game-card__price">{formatPrice(game.price)}</span>
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              addItem(game);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}