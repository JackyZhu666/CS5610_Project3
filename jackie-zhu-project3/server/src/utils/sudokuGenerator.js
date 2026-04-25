function shuffle(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function deepCopy(board) {
  return board.map((row) => [...row]);
}

function makePatternBoard(size, boxRows, boxCols) {
  const nums = shuffle(Array.from({ length: size }, (_, index) => index + 1));

  const rows = [];
  for (let group = 0; group < size / boxRows; group += 1) {
    rows.push(...shuffle(Array.from({ length: boxRows }, (_, i) => group * boxRows + i)));
  }

  const cols = [];
  for (let group = 0; group < size / boxCols; group += 1) {
    cols.push(...shuffle(Array.from({ length: boxCols }, (_, i) => group * boxCols + i)));
  }

  return rows.map((rowIndex) =>
      cols.map((colIndex) => {
        const patternIndex =
            (boxCols * (rowIndex % boxRows) + Math.floor(rowIndex / boxRows) + colIndex) % size;
        return nums[patternIndex];
      })
  );
}

function removeCells(solution, clues) {
  const size = solution.length;
  const puzzle = deepCopy(solution);
  const positions = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      positions.push([row, col]);
    }
  }

  const shuffledPositions = shuffle(positions);
  const cellsToRemove = size * size - clues;

  for (let i = 0; i < cellsToRemove; i += 1) {
    const [row, col] = shuffledPositions[i];
    puzzle[row][col] = null;
  }

  return puzzle;
}

function hasAllNumbersOnce(values, size) {
  const seen = new Set();

  for (const value of values) {
    const number = Number(value);

    if (!Number.isInteger(number) || number < 1 || number > size) {
      return false;
    }

    if (seen.has(number)) {
      return false;
    }

    seen.add(number);
  }

  return seen.size === size;
}

export function isBoardSolvedValid(board, puzzle, size, boxRows, boxCols) {
  if (!Array.isArray(board) || board.length !== size) {
    return false;
  }

  for (let row = 0; row < size; row += 1) {
    if (!Array.isArray(board[row]) || board[row].length !== size) {
      return false;
    }

    for (let col = 0; col < size; col += 1) {
      if (puzzle[row][col] !== null && Number(board[row][col]) !== Number(puzzle[row][col])) {
        return false;
      }
    }
  }

  for (let row = 0; row < size; row += 1) {
    if (!hasAllNumbersOnce(board[row], size)) {
      return false;
    }
  }

  for (let col = 0; col < size; col += 1) {
    const columnValues = [];

    for (let row = 0; row < size; row += 1) {
      columnValues.push(board[row][col]);
    }

    if (!hasAllNumbersOnce(columnValues, size)) {
      return false;
    }
  }

  for (let boxRowStart = 0; boxRowStart < size; boxRowStart += boxRows) {
    for (let boxColStart = 0; boxColStart < size; boxColStart += boxCols) {
      const boxValues = [];

      for (let row = boxRowStart; row < boxRowStart + boxRows; row += 1) {
        for (let col = boxColStart; col < boxColStart + boxCols; col += 1) {
          boxValues.push(board[row][col]);
        }
      }

      if (!hasAllNumbersOnce(boxValues, size)) {
        return false;
      }
    }
  }

  return true;
}

export function generatePuzzle(difficulty) {
  if (difficulty === 'EASY') {
    const size = 6;
    const boxRows = 2;
    const boxCols = 3;
    const clues = 18;

    const solution = makePatternBoard(size, boxRows, boxCols);
    const puzzle = removeCells(solution, clues);

    return {
      difficulty,
      size,
      boxRows,
      boxCols,
      puzzle,
      solution
    };
  }

  const size = 9;
  const boxRows = 3;
  const boxCols = 3;
  const clues = 28 + Math.floor(Math.random() * 3);

  const solution = makePatternBoard(size, boxRows, boxCols);
  const puzzle = removeCells(solution, clues);

  return {
    difficulty: 'NORMAL',
    size,
    boxRows,
    boxCols,
    puzzle,
    solution
  };
}