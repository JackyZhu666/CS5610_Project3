import { formatTimer } from '../utils/dateUtils';

export default function Timer({ seconds }) {
  return (
      <div className="timer-card">
        <span className="timer-label">Time</span>
        <span className="timer-value">{formatTimer(seconds)}</span>
      </div>
  );
}