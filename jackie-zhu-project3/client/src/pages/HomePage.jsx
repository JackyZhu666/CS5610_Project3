import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';

export default function HomePage() {
  return (
      <div className="container">
        <section className="home-center">
          <PageHero
              title="Neon Sudoku"
              subtitle="A full-stack Sudoku app with user accounts, saved games, and high scores."
          />

          <div className="button-row center">
            <Link className="primary-btn" to="/games">
              Play the Game
            </Link>
            <Link className="secondary-btn" to="/rules">
              View Rules
            </Link>
          </div>
        </section>
      </div>
  );
}