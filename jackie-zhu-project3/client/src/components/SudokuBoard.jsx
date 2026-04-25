import SudokuCell from './SudokuCell';

export default function SudokuBoard({
  board,
  puzzle,
  size,
  boxRows,
  boxCols,
  selectedCell,
  invalidCells,
  disabled,
  onSelect,
  onChange
}) {
  return (
      <div
          className={`sudoku-board ${size === 9 ? 'board-9' : 'board-6'}`}
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const key = `${rowIndex}-${colIndex}`;
              const readOnly = puzzle[rowIndex][colIndex] !== null;
              const selected =
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const invalid = invalidCells.has(key);

              const borderStyle = {
                borderRight:
                    (colIndex + 1) % boxCols === 0 && colIndex !== size - 1
                        ? '3px solid rgba(255,255,255,.28)'
                        : undefined,
                borderBottom:
                    (rowIndex + 1) % boxRows === 0 && rowIndex !== size - 1
                        ? '3px solid rgba(255,255,255,.28)'
                        : undefined
              };

              return (
                  <div key={key} style={borderStyle}>
                    <SudokuCell
                        value={cell}
                        row={rowIndex}
                        col={colIndex}
                        readOnly={readOnly}
                        disabled={disabled}
                        selected={selected}
                        invalid={invalid}
                        maxValue={size}
                        onSelect={onSelect}
                        onChange={onChange}
                    />
                  </div>
              );
            })
        )}
      </div>
  );
}