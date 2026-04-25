import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageHero from '../components/PageHero';
import SudokuBoard from '../components/SudokuBoard';
import Timer from '../components/Timer';

import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { copyBoard, getInvalidCells, isBoardFilled } from '../utils/sudokuClient';

export default function GamePage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [game, setGame] = useState(null);
  const [board, setBoard] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function loadGame() {
    try {
      const data = await apiClient(`/api/sudoku/${gameId}`);
      setGame(data.game);
      setBoard(data.game.board);
      setElapsedSeconds(data.game.elapsedSeconds || 0);
      setCompleted(data.game.completed);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadGame();
  }, [gameId]);

  useEffect(() => {
    if (!game || completed || !isLoggedIn) return undefined;

    const timer = setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [game, completed, isLoggedIn]);

  const invalidCells = useMemo(() => {
    if (!game || !board) return new Set();
    return getInvalidCells(board, game.size, game.boxRows, game.boxCols);
  }, [game, board]);

  const boardDisabled = !game?.canInteract || completed || !isLoggedIn;

  async function saveProgress(nextBoard, nextSeconds = elapsedSeconds) {
    await apiClient(`/api/sudoku/${gameId}`, {
      method: 'PUT',
      body: JSON.stringify({
        board: nextBoard,
        elapsedSeconds: nextSeconds
      })
    });
  }

  async function handleCellChange(row, col, value) {
    if (!game || boardDisabled) return;

    const nextBoard = copyBoard(board);
    nextBoard[row][col] = value;

    setBoard(nextBoard);

    try {
      await saveProgress(nextBoard);

      const nextInvalidCells = getInvalidCells(
          nextBoard,
          game.size,
          game.boxRows,
          game.boxCols
      );

      if (isBoardFilled(nextBoard) && nextInvalidCells.size === 0) {
        await apiClient('/api/highscore', {
          method: 'POST',
          body: JSON.stringify({
            gameId,
            board: nextBoard,
            elapsedSeconds
          })
        });

        setCompleted(true);
        setSuccess('Congratulations! You completed this game.');
        await loadGame();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReset() {
    if (!game || !isLoggedIn || completed) return;

    const resetBoard = copyBoard(game.puzzle);

    setBoard(resetBoard);
    setElapsedSeconds(0);
    setSuccess('');

    try {
      await saveProgress(resetBoard, 0);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!game?.isCreator) return;

    const confirmed = window.confirm('Delete this game? This cannot be undone.');

    if (!confirmed) return;

    try {
      await apiClient(`/api/sudoku/${gameId}`, {
        method: 'DELETE'
      });

      navigate('/games');
    } catch (err) {
      setError(err.message);
    }
  }

  if (error && !game) {
    return (
        <div className="container">
          <div className="error-box">{error}</div>
        </div>
    );
  }

  if (!game || !board) {
    return (
        <div className="container">
          <p>Loading game...</p>
        </div>
    );
  }

  return (
      <div className="container">
        <PageHero
            title={game.name}
            subtitle={`${game.difficulty} Sudoku created by ${game.createdByUsername}`}
        />

        {!isLoggedIn && (
            <div className="notice">
              You are viewing this game while logged out. Please log in to play.
            </div>
        )}

        {completed && (
            <div className="success-box">
              Congratulations! You already completed this game. The completed board is shown below.
            </div>
        )}

        {success && <div className="success-box">{success}</div>}
        {error && <div className="error-box">{error}</div>}

        <section className="game-layout">
          <div className="game-panel">
            <div className="game-topbar">
              <Timer seconds={elapsedSeconds} />
            </div>

            <SudokuBoard
                board={board}
                puzzle={game.puzzle}
                size={game.size}
                boxRows={game.boxRows}
                boxCols={game.boxCols}
                selectedCell={selectedCell}
                invalidCells={invalidCells}
                disabled={boardDisabled}
                onSelect={(row, col) => setSelectedCell({ row, col })}
                onChange={handleCellChange}
            />

            <div className="button-row center">
              <button
                  className="secondary-btn"
                  disabled={!isLoggedIn || completed}
                  onClick={handleReset}
              >
                Reset Game
              </button>

              {game.isCreator && (
                  <button className="danger-btn" onClick={handleDelete}>
                    DELETE
                  </button>
              )}
            </div>
          </div>

          <aside className="info-panel">
            <h3>Game Info</h3>
            <p>Difficulty: {game.difficulty}</p>
            <p>Board size: {game.size}×{game.size}</p>
            <p>Status: {completed ? 'Completed' : 'In Progress'}</p>
            <p>Invalid cells: {invalidCells.size}</p>
          </aside>
        </section>
      </div>
  );
}