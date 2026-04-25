export function getInvalidCells(board, size, boxRows, boxCols) {
  const invalid = new Set();

  function markDuplicates(entries) {
    const seen = new Map();

    for (const entry of entries) {
      const value = entry.value;

      if (!value) continue;

      if (!seen.has(value)) {
        seen.set(value, []);
      }

      seen.get(value).push(entry);
    }

    for (const duplicates of seen.values()) {
      if (duplicates.length > 1) {
        duplicates.forEach((entry) => invalid.add(`${entry.row}-${entry.col}`));
      }
    }
  }

  for (let row = 0; row < size; row += 1) {
    const entries = [];

    for (let col = 0; col < size; col += 1) {
      entries.push({ row, col, value: board[row][col] });
    }

    markDuplicates(entries);
  }

  for (let col = 0; col < size; col += 1) {
    const entries = [];

    for (let row = 0; row < size; row += 1) {
      entries.push({ row, col, value: board[row][col] });
    }

    markDuplicates(entries);
  }

  for (let boxRowStart = 0; boxRowStart < size; boxRowStart += boxRows) {
    for (let boxColStart = 0; boxColStart < size; boxColStart += boxCols) {
      const entries = [];

      for (let row = boxRowStart; row < boxRowStart + boxRows; row += 1) {
        for (let col = boxColStart; col < boxColStart + boxCols; col += 1) {
          entries.push({ row, col, value: board[row][col] });
        }
      }

      markDuplicates(entries);
    }
  }

  return invalid;
}

export function isBoardFilled(board) {
  return board.every((row) => row.every((cell) => cell !== null && cell !== ''));
}

export function copyBoard(board) {
  return board.map((row) => [...row]);
}