import React, { useState, useEffect } from "react";
import "./App.css";

// Color constants according to requirements
const COLORS = {
  accent: "#fbc02d",
  primary: "#1976d2",
  secondary: "#424242",
};

// Square component
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      style={{
        color: value
          ? value === "X"
            ? COLORS.primary
            : COLORS.secondary
          : COLORS.secondary,
        background: highlight ? COLORS.accent : "transparent",
        borderColor: COLORS.secondary,
      }}
      onClick={onClick}
      aria-label={value ? `Cell marked ${value}` : "Empty cell"}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// Function to calculate winner and winning line
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  if (squares.filter(Boolean).length === 9) {
    return { winner: null, line: null, draw: true }; // Draw
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // State: board, current turn, X and O scores, game over, winning line, notification
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [gameStatus, setGameStatus] = useState({
    over: false,
    winner: null,
    draw: false,
    line: null,
    message: "",
  });

  // Handle click on square
  const handleClick = (idx) => {
    if (board[idx] || gameStatus.over) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? "X" : "O";
    const result = calculateWinner(newBoard);

    if (result && result.winner) {
      // Win
      setBoard(newBoard);
      setGameStatus({
        over: true,
        winner: result.winner,
        line: result.line,
        draw: false,
        message: `Player ${result.winner} wins!`,
      });
      setScore((prev) => ({
        ...prev,
        [result.winner]: prev[result.winner] + 1,
      }));
    } else if (result && result.draw) {
      // Draw
      setBoard(newBoard);
      setGameStatus({
        over: true,
        winner: null,
        draw: true,
        line: null,
        message: "It's a draw!",
      });
    } else {
      setBoard(newBoard);
      setXIsNext((prev) => !prev);
      setGameStatus({
        over: false,
        winner: null,
        draw: false,
        line: null,
        message: "",
      });
    }
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameStatus({
      over: false,
      winner: null,
      draw: false,
      line: null,
      message: "",
    });
  };

  // Responsive: Focus new game after reset
  useEffect(() => {
    if (!gameStatus.over) {
      // Focus center square for accessibility after reset
      const centerButton = document.querySelector('.ttt-square[aria-label="Empty cell"]:nth-child(5)');
      if (centerButton) centerButton.focus();
    }
  }, [board, gameStatus.over]);

  // PUBLIC_INTERFACE
  return (
    <div className="tic-tac-toe-app-bg">
      <main className="ttt-centered-layout">
        {/* Scoreboard */}
        <section className="ttt-scoreboard">
          <div className="ttt-score ttt-player-x" style={{ color: COLORS.primary }}>
            X <span>{score.X}</span>
          </div>
          <div className="ttt-score ttt-player-o" style={{ color: COLORS.secondary }}>
            O <span>{score.O}</span>
          </div>
        </section>

        {/* Turn Indicator */}
        {!gameStatus.over && (
          <div className="ttt-turn-indicator" style={{ color: COLORS.accent }}>
            Player {xIsNext ? "X" : "O"}'s turn
          </div>
        )}

        {/* Game Board */}
        <section className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
          {Array(3)
            .fill(0)
            .map((_, row) => (
              <div className="ttt-board-row" role="row" key={row}>
                {Array(3)
                  .fill(0)
                  .map((_, col) => {
                    const idx = 3 * row + col;
                    const highlight =
                      gameStatus.line && gameStatus.line.includes(idx);
                    return (
                      <Square
                        key={col}
                        value={board[idx]}
                        onClick={() => handleClick(idx)}
                        highlight={highlight}
                      />
                    );
                  })}
              </div>
            ))}
        </section>

        {/* Winner/Draw notification */}
        {gameStatus.message && (
          <div
            className="ttt-notification"
            style={{
              color: gameStatus.draw
                ? COLORS.accent
                : gameStatus.winner === "X"
                ? COLORS.primary
                : COLORS.secondary,
              background: "#fff9e1",
            }}
            role="status"
            aria-live="assertive"
          >
            {gameStatus.message}
          </div>
        )}

        {/* Reset Button */}
        <button
          className="ttt-reset-btn"
          style={{
            background: COLORS.accent,
            color: "#fff",
            borderColor: COLORS.secondary,
          }}
          onClick={handleReset}
        >
          Reset Game
        </button>
      </main>
    </div>
  );
}

export default App;
