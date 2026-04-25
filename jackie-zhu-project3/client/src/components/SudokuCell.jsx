export default function SudokuCell({
  value,
  row,
  col,
  readOnly,
  disabled,
  selected,
  invalid,
  maxValue,
  onSelect,
  onChange
}) {
  const className = [
    'sudoku-cell',
    readOnly ? 'prefilled' : '',
    selected ? 'selected' : '',
    invalid ? 'invalid' : '',
    disabled ? 'disabled' : ''
  ]
  .filter(Boolean)
  .join(' ');

  function handleChange(event) {
    const raw = event.target.value;

    if (disabled || readOnly) {
      return;
    }

    if (raw === '') {
      onChange(row, col, null);
      return;
    }

    const numeric = Number(raw);

    if (!Number.isInteger(numeric) || numeric < 1 || numeric > maxValue) {
      return;
    }

    onChange(row, col, numeric);
  }

  return (
      <input
          className={className}
          value={value ?? ''}
          readOnly={readOnly || disabled}
          maxLength="1"
          inputMode="numeric"
          onFocus={() => onSelect(row, col)}
          onClick={() => onSelect(row, col)}
          onChange={handleChange}
          aria-label={`Row ${row + 1}, Column ${col + 1}`}
      />
  );
}