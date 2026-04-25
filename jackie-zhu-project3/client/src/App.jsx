import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';

import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import GamePage from './pages/GamePage';
import RulesPage from './pages/RulesPage';
import ScoresPage from './pages/ScoresPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="games" element={<GamesPage />} />
            <Route path="game/:gameId" element={<GamePage />} />
            <Route path="rules" element={<RulesPage />} />
            <Route path="scores" element={<ScoresPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}