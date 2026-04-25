import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero';
import { apiClient } from '../api/apiClient';

export default function ScoresPage() {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadScores() {
      try {
        const data = await apiClient('/api/highscore');
        setScores(data.scores);
      } catch (err) {
        setError(err.message);
      }
    }

    loadScores();
  }, []);

  return (
      <div className="container">
        <PageHero
            title="High Scores"
            subtitle="Users are ranked by completed Sudoku games."
        />

        {error && <div className="error-box">{error}</div>}

        <section className="content-card">
          {scores.length === 0 ? (
              <p>No completed games yet.</p>
          ) : (
              <table className="scores-table">
                <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Wins</th>
                </tr>
                </thead>
                <tbody>
                {scores.map((score, index) => (
                    <tr key={score._id}>
                      <td>{index + 1}</td>
                      <td>{score.username}</td>
                      <td>{score.wins}</td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </section>
      </div>
  );
}