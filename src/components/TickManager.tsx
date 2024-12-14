import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatTick } from './_util';

const TickManager: React.FC = () => {
  const { ticks, incrementTick } = useAppContext();

  return (
    <div>
      {/* Title (no button) */}
      <h2 className="text-xl font-bold">Tick Manager</h2>

      {/* Tick Information */}
      <div className="text-lg my-4">
        <p className="whitespace-pre">
          {formatTick(ticks, { separator: '\n' })}
        </p>
      </div>

      {/* Next Tick Button */}
      <div className="flex justify-center">
        <button
          onClick={incrementTick}
          className="w-28 h-28 p-4 bg-blue-500 text-white rounded-full text-2xl font-bold border-4 border-blue-700 shadow-lg hover:bg-blue-600 hover:shadow-xl"
        >
          Next tick
        </button>
      </div>
    </div>
  );
};

export default TickManager;
