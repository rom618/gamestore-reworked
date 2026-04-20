import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { gamesApi } from "../api/games";
import { promotionCodeApi } from "../api/promotionCode";
import { formatPrice } from "../utils";
import type { Game, PromotionCode, CreateGameRequest } from "../types";
import { Category, GameConsole } from "../types";
import "./StaffPortal.css";

type Tab = "inventory" | "promos";

const EMPTY_GAME: CreateGameRequest = {
  name: "", price: 0, description: "",
  category: Category.Action,
  gameConsole: GameConsole.PC,
};

export default function StaffPortal() {
  const [activeTab, setActiveTab] = useState<Tab>("inventory");

  // Inventory state
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [showNewGame, setShowNewGame] = useState(false);
  const [newGame, setNewGame] = useState<CreateGameRequest>(EMPTY_GAME);
  const [savingGame, setSavingGame] = useState(false);
  const [gameSearch, setGameSearch] = useState("");

  // Promo state
  const [promos, setPromos] = useState<PromotionCode[]>([]);
  const [newPromoCode, setNewPromoCode] = useState("");
  const [newPromoPct, setNewPromoPct] = useState("");
  const [savingPromo, setSavingPromo] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    gamesApi.getAll()
      .then(setGames)
      .catch(() => {})
      .finally(() => setGamesLoading(false));
  }, []);

  const filteredGames = games.filter((g) =>
    g.name.toLowerCase().includes(gameSearch.toLowerCase())
  );

  const handleCreateGame = async () => {
    if (!newGame.name.trim()) return;
    setSavingGame(true);
    try {
      const created = await gamesApi.create(newGame);
      setGames((prev) => [...prev, created]);
      setNewGame(EMPTY_GAME);
      setShowNewGame(false);
    } catch {} finally { setSavingGame(false); }
  };

  const handleUpdateGame = async () => {
    if (!editingGame) return;
    setSavingGame(true);
    try {
      const updated = await gamesApi.update(editingGame.id, editingGame);
      setGames((prev) => prev.map((g) => g.id === updated.id ? updated : g));
      setEditingGame(null);
    } catch {} finally { setSavingGame(false); }
  };

  const handleDeleteGame = async (id: number) => {
    if (!window.confirm("Delete this game? This cannot be undone.")) return;
    await gamesApi.delete(id);
    setGames((prev) => prev.filter((g) => g.id !== id));
  };

  const handleCreatePromo = async () => {
    const pct = parseInt(newPromoPct, 10);
    if (!newPromoCode.trim() || isNaN(pct) || pct < 1 || pct > 100) {
      setPromoMsg({ type: "err", text: "Enter a valid code and percentage (1–100)." });
      return;
    }
    setSavingPromo(true);
    setPromoMsg(null);
    try {
      const created = await promotionCodeApi.create({ code: newPromoCode, percentageValue: pct });
      setPromos((prev) => [...prev, created]);
      setNewPromoCode(""); setNewPromoPct("");
      setPromoMsg({ type: "ok", text: `Promo "${created.code}" created.` });
    } catch (e: any) {
      setPromoMsg({ type: "err", text: e.message });
    } finally { setSavingPromo(false); }
  };

  const handleDeletePromo = async (id: number) => {
    await promotionCodeApi.delete(id);
    setPromos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="staff">
      <Navbar />

      <div className="staff__inner">
        <header className="staff__header">
          <div>
            <p className="staff__eyebrow">▶ Staff Portal</p>
            <h1 className="staff__title">Admin Panel</h1>
          </div>
          <div className="staff__tabs">
            <button
              className={`staff__tab ${activeTab === "inventory" ? "staff__tab--active" : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              Inventory
            </button>
            <button
              className={`staff__tab ${activeTab === "promos" ? "staff__tab--active" : ""}`}
              onClick={() => setActiveTab("promos")}
            >
              Promo Codes
            </button>
          </div>
        </header>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="staff__pane">
            <div className="staff__pane-header">
              <Input
                placeholder="Search games…"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
                className="staff__search"
              />
              <Button variant="primary" size="sm" onClick={() => setShowNewGame((v) => !v)}>
                {showNewGame ? "Cancel" : "+ New Game"}
              </Button>
            </div>

            {showNewGame && (
              <div className="staff__form-card">
                <h2 className="staff__form-title">Create New Game</h2>
                <div className="staff__form-grid">
                  <Input label="Name" value={newGame.name} onChange={(e) => setNewGame((f) => ({ ...f, name: e.target.value }))} />
                  <Input label="Price ($)" type="number" value={newGame.price} onChange={(e) => setNewGame((f) => ({ ...f, price: Number(e.target.value) }))} />
                  <div className="staff__form-full">
                    <Input label="Description" value={newGame.description} onChange={(e) => setNewGame((f) => ({ ...f, description: e.target.value }))} />
                  </div>
                  <div className="staff__select-wrap">
                    <label className="staff__select-label">Category</label>
                    <select className="staff__select" value={newGame.category} onChange={(e) => setNewGame((f) => ({ ...f, category: e.target.value as Category }))}>
                      {Object.values(Category).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="staff__select-wrap">
                    <label className="staff__select-label">Platform</label>
                    <select className="staff__select" value={newGame.gameConsole} onChange={(e) => setNewGame((f) => ({ ...f, gameConsole: e.target.value as GameConsole }))}>
                      {Object.values(GameConsole).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <Button variant="primary" onClick={handleCreateGame} loading={savingGame}>Create Game</Button>
              </div>
            )}

            {editingGame && (
              <div className="staff__form-card staff__form-card--edit">
                <h2 className="staff__form-title">Edit: {editingGame.name}</h2>
                <div className="staff__form-grid">
                  <Input label="Name" value={editingGame.name} onChange={(e) => setEditingGame((g) => g && ({ ...g, name: e.target.value }))} />
                  <Input label="Price ($)" type="number" value={editingGame.price} onChange={(e) => setEditingGame((g) => g && ({ ...g, price: Number(e.target.value) }))} />
                  <div className="staff__form-full">
                    <Input label="Description" value={editingGame.description} onChange={(e) => setEditingGame((g) => g && ({ ...g, description: e.target.value }))} />
                  </div>
                  <div className="staff__select-wrap">
                    <label className="staff__select-label">Category</label>
                    <select className="staff__select" value={editingGame.category} onChange={(e) => setEditingGame((g) => g && ({ ...g, category: e.target.value as Category }))}>
                      {Object.values(Category).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="staff__select-wrap">
                    <label className="staff__select-label">Platform</label>
                    <select className="staff__select" value={editingGame.gameConsole} onChange={(e) => setEditingGame((g) => g && ({ ...g, gameConsole: e.target.value as GameConsole }))}>
                      {Object.values(GameConsole).map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="staff__form-actions">
                  <Button variant="primary" onClick={handleUpdateGame} loading={savingGame}>Save Changes</Button>
                  <Button variant="ghost" onClick={() => setEditingGame(null)}>Cancel</Button>
                </div>
              </div>
            )}

            {gamesLoading
              ? <Spinner label="Loading inventory…" />
              : <div className="staff__table-wrap">
                  <table className="staff__table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Platform</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGames.length === 0
                        ? <tr><td colSpan={6} className="staff__table-empty">No games found.</td></tr>
                        : filteredGames.map((game) => (
                          <tr key={game.id}>
                            <td className="staff__td-id">{game.id}</td>
                            <td className="staff__td-name">{game.name}</td>
                            <td><span className="staff__badge">{game.category}</span></td>
                            <td className="staff__td-muted">{game.gameConsole}</td>
                            <td className="staff__td-price">{formatPrice(game.price)}</td>
                            <td>
                              <div className="staff__row-actions">
                                <button className="staff__action-btn" onClick={() => { setEditingGame(game); setShowNewGame(false); }}>Edit</button>
                                <button className="staff__action-btn staff__action-btn--danger" onClick={() => handleDeleteGame(game.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
            }
          </div>
        )}

        {/* Promos Tab */}
        {activeTab === "promos" && (
          <div className="staff__pane">
            <div className="staff__form-card">
              <h2 className="staff__form-title">Create Promotion Code</h2>
              {promoMsg && (
                <div className={`staff__msg ${promoMsg.type === "ok" ? "staff__msg--ok" : "staff__msg--err"}`}>
                  {promoMsg.text}
                </div>
              )}
              <div className="staff__promo-row">
                <Input label="Code" value={newPromoCode} onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())} placeholder="SUMMER25" />
                <Input label="Discount %" type="number" value={newPromoPct} onChange={(e) => setNewPromoPct(e.target.value)} placeholder="25" />
                <div className="staff__promo-btn-wrap">
                  <Button variant="primary" onClick={handleCreatePromo} loading={savingPromo}>Create</Button>
                </div>
              </div>
            </div>

            {promos.length === 0
              ? <p className="staff__empty">No promotion codes yet.</p>
              : <div className="staff__promo-list">
                  {promos.map((p) => (
                    <div key={p.id} className="staff__promo-card">
                      <div>
                        <p className="staff__promo-code">{p.code}</p>
                        <p className="staff__promo-pct">{p.percentageValue}% off</p>
                      </div>
                      <button className="staff__action-btn staff__action-btn--danger" onClick={() => handleDeletePromo(p.id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  );
}