import { useState, useMemo } from "react";
import Navbar from "../components/Navbar";
import GameCard from "../components/GameCard";
import Spinner from "../components/ui/Spinner";
import Input from "../components/ui/Input";
import { useGames } from "../hooks/useGames";
import { Category, GameConsole } from "../types";
import "./DiscoveryPage.css";

export default function DiscoveryPage() {
  const { games, isLoading, error } = useGames();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [console_, setConsole] = useState<GameConsole | "">("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  const filtered = useMemo(() => {
    let result = [...games];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
      );
    }
    if (category) result = result.filter((g) => g.category === category);
    if (console_) result = result.filter((g) => g.gameConsole === console_);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    return result;
  }, [games, search, category, console_, sortBy]);

  return (
    <div className="discovery">
      <Navbar />

      <header className="discovery__hero">
        <p className="discovery__hero-eyebrow">▶ New &amp; Trending</p>
        <h1 className="discovery__hero-title">Find Your Next Game</h1>
        <p className="discovery__hero-sub">
          Browse {games.length} titles across all platforms
        </p>
      </header>

      <div className="discovery__content">
        <aside className="discovery__filters">
          <h2 className="discovery__filter-heading">Filters</h2>

          <Input
            label="Search"
            placeholder="Game name or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="discovery__filter-group">
            <label className="discovery__filter-label">Category</label>
            <select
              className="discovery__select"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | "")}
            >
              <option value="">All Categories</option>
              {Object.values(Category).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="discovery__filter-group">
            <label className="discovery__filter-label">Platform</label>
            <select
              className="discovery__select"
              value={console_}
              onChange={(e) => setConsole(e.target.value as GameConsole | "")}
            >
              <option value="">All Platforms</option>
              {Object.values(GameConsole).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="discovery__filter-group">
            <label className="discovery__filter-label">Sort By</label>
            <select
              className="discovery__select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="name">Name A–Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>

          {(search || category || console_) && (
            <button
              className="discovery__clear"
              onClick={() => { setSearch(""); setCategory(""); setConsole(""); }}
            >
              Clear Filters
            </button>
          )}
        </aside>

        <main className="discovery__main">
          <div className="discovery__results-bar">
            <span className="discovery__count">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {isLoading && <Spinner label="Loading games…" />}
          {error && <p className="discovery__error">{error}</p>}

          {!isLoading && !error && filtered.length === 0 && (
            <div className="discovery__empty">
              <p>No games match your filters.</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="discovery__grid">
              {filtered.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}