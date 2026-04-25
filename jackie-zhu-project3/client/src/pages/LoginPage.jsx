import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageHero from '../components/PageHero';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const submitDisabled = !form.username.trim() || !form.password.trim();

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitDisabled) return;

    try {
      await login(form);
      navigate('/games');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
      <div className="container narrow">
        <PageHero
            title="Login"
            subtitle="Log in to create and play Sudoku games."
        />

        <section className="content-card">
          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="form-label" htmlFor="username">Username</label>
            <input
                id="username"
                className="form-input"
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
            />

            <label className="form-label" htmlFor="password">Password</label>
            <input
                id="password"
                className="form-input"
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
            />

            <button className="primary-btn full-width" disabled={submitDisabled}>
              Submit
            </button>
          </form>

          <p className="form-help">
            Need an account? <Link to="/register">Register here</Link>
          </p>
        </section>
      </div>
  );
}