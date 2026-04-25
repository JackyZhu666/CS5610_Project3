import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
      <header className="site-nav">
        <div className="container nav-inner">
          <NavLink to="/" className="brand">
            <img src="/logo.svg" alt="Neon Sudoku logo" />
            <span>Neon Sudoku</span>
          </NavLink>

          <nav className="nav-links">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/games">Games</NavLink>
            <NavLink to="/rules">Rules</NavLink>
            <NavLink to="/scores">Scores</NavLink>

            {!isLoggedIn ? (
                <>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/register">Register</NavLink>
                </>
            ) : (
                <>
                  <span className="username-pill">@{user.username}</span>
                  <button className="nav-button" onClick={handleLogout}>
                    Logout
                  </button>
                </>
            )}
          </nav>
        </div>
      </header>
  );
}