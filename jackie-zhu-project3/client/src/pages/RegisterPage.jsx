import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PageHero from '../components/PageHero';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    verifyPassword: ''
  });
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const submitDisabled =
      !form.username.trim() ||
      !form.password.trim() ||
      !form.verifyPassword.trim();

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitDisabled) return;

    if (form.password !== form.verifyPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({
        username: form.username,
        password: form.password
      });

      navigate('/games');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
      <div className="container narrow">
        <PageHero
            title="Register"
            subtitle="Create an account to save games and earn high scores."
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

            <label className="form-label" htmlFor="verifyPassword">Verify Password</label>
            <input
                id="verifyPassword"
                className="form-input"
                type="password"
                value={form.verifyPassword}
                onChange={(event) => updateField('verifyPassword', event.target.value)}
            />

            <button className="primary-btn full-width" disabled={submitDisabled}>
              Submit
            </button>
          </form>

          <p className="form-help">
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </section>
      </div>
  );
}