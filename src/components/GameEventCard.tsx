// src/components/Event.tsx
import React from 'react';
import { GameEvent, useAppContext } from '../context/AppContext';
import { FaTimes, FaCopy } from 'react-icons/fa'; // Importing icons
import clsx from 'clsx';
import { formatTick } from './_util';

type GameEventCardProps = {
  event: GameEvent;
  onCancel: (id: string) => void;
  onCopy: (id: string) => void;
};

const GameEventCard: React.FC<GameEventCardProps> = ({
  event,
  onCancel,
  onCopy,
}) => {
  const {
    id,
    name,
    ticksToComplete,
    ticksTotal,
    outcomes,
    addedOn,
    endedOn,
    status,
  } = event;

  const { ticks } = useAppContext();

  const isDone = status === 'completed';
  const isFresh = ticks === endedOn;

  const didJustFinish = isDone && isFresh;
  const didJustFail = status === 'failed' && isFresh;

  const statusText =
    status === 'completed'
      ? { text: 'Done', color: 'text-green-700' }
      : status === 'cancelled'
      ? { text: 'Cancelled', color: 'text-gray-700' }
      : status === 'failed'
      ? { text: 'Failed', color: 'text-red-700' }
      : null;

  const tickLabel = statusText ? (
    <span className={`font-semibold ${statusText.color}`}>
      {statusText.text}
    </span>
  ) : (
    <span className="font-semibold text-gray-700">
      {ticksToComplete}/{ticksTotal} ticks
    </span>
  );

  return (
    <li
      key={event.id}
      id={event.id}
      className={clsx(
        'relative p-4 border-2 rounded mb-4',
        status === 'completed' && 'bg-green-200',
        status === 'pending' && 'bg-yellow-200',
        status === 'cancelled' && 'bg-gray-200',
        status === 'failed' && 'bg-red-300',
        didJustFinish && 'border-dashed border-green-800',
        didJustFail && 'border-dashed border-red-800'
      )}
    >
      {/* Buttons in the top-right corner */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          className="text-gray-700 hover:text-gray-900"
          onClick={() => onCopy(id)}
          title="Copy Event"
        >
          <FaCopy />
        </button>
        {status === 'pending' && (
          <button
            className="text-gray-700 hover:text-gray-900"
            onClick={() => onCancel(id)}
            title="Cancel Event"
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Event Date */}
      <div className="mt-2 font-thin text-gray-700">
        Added on {formatTick(addedOn, { day: false, time: false })}
      </div>

      {/* Event Name */}
      <div className="mb-2">
        <strong>{name}</strong> - {tickLabel}{' '}
        {isDone &&
          endedOn &&
          `on ${formatTick(endedOn, { day: false, time: false })}`}
      </div>

      {/* Outcomes */}
      <ul className="mt-2">
        {outcomes.map((outcome, index) => (
          <li key={index} className="text-gray-600 font-semibold">
            {outcome.operation === 'increment' ? '+' : '-'}
            {outcome.amount} {outcome.resourceName}
          </li>
        ))}
      </ul>
    </li>
  );
};

export default GameEventCard;
