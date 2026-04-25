import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageHero from '../components/PageHero';
import { apiClient } from '../api/apiClient';
import { formatDisplayDate } from '../utils/dateUtils';
import { useAuth } from '../context/AuthContext';

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  async function loadGames() {
    try {
      setLoading(true);
      const data = await apiClient('/api/sudoku');
      setGames(data.games);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  async function createGame(difficulty) {
    try {
      setCreating(true);
      const data = await apiClient('/api/sudoku', {
        method: 'POST',
        body: JSON.stringify({ difficulty })
      });

      navigate(`/game/${data.gameId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  return (
      <div className="container">
        <PageHero
            title="Game Selection"
            subtitle="Create a new Sudoku game or continue an existing one."
        />

        {!isLoggedIn && (
            <div className="notice">
              You can view existing games, but you must log in to create or play them.
            </div>
        )}

        <section className="content-card">
          <div className="button-row">
            <button
                className="primary-btn"
                disabled={!isLoggedIn || creating}
                onClick={() => createGame('NORMAL')}
            >
              Create Normal Game
            </button>

            <button
                className="secondary-btn"
                disabled={!isLoggedIn || creating}
                onClick={() => createGame('EASY')}
            >
              Create Easy Game
            </button>
          </div>
        </section>

        {error && <div className="error-box">{error}</div>}

        <section className="content-card">
          <h2>Available Games</h2>

          {loading ? (
              <p>Loading games...</p>
          ) : games.length === 0 ? (
              <p>No games have been created yet.</p>
          ) : (
              <div className="game-list">
                {games.map((game) => (
                    <Link key={game.id} className="game-card" to={`/game/${game.id}`}>
                      <div>
                        <h3>{game.name}</h3>
                        <p>
                          Created by <strong>{game.createdByUsername}</strong> on{' '}
                          {formatDisplayDate(game.createdAt)}
                        </p>
                      </div>

                      <span className={`difficulty-pill ${game.difficulty.toLowerCase()}`}>
                  {game.difficulty}
                </span>
                    </Link>
                ))}
              </div>
          )}
        </section>
      </div>
  );
}