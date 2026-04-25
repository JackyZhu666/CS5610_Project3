import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
      <div className="container">
        <section className="content-card">
          <h1>404</h1>
          <p>This page does not exist.</p>
          <Link className="primary-btn" to="/">
            Back Home
          </Link>
        </section>
      </div>
  );
}