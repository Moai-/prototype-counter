import React, { useState } from 'react';
import { Outcome, useAppContext } from '../context/AppContext';
import { checkEscEnt, haltEvt } from './_util';

const AddGameEventModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { resources, addGameEvent } = useAppContext();
  const [eventName, setEventName] = useState('');
  const [ticksToComplete, setTicksToComplete] = useState(1);
  const [isRepeating, setIsRepeating] = useState(false);
  const [outcomes, setOutcomes] = useState<Array<Outcome>>([]);

  const handleAddOutcome = () => {
    setOutcomes([
      ...outcomes,
      {
        resourceName: resources[0]?.name || '',
        operation: 'increment',
        amount: 1,
        timing: 'after',
      },
    ]);
  };

  const handleOutcomeChange = (
    index: number,
    field: keyof (typeof outcomes)[0],
    value: any
  ) => {
    setOutcomes((prev) =>
      prev.map((outcome, i) =>
        i === index ? { ...outcome, [field]: value } : outcome
      )
    );
  };

  const handleRemoveOutcome = (index: number) => {
    setOutcomes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddEvent = () => {
    if (eventName.trim()) {
      addGameEvent({ name: eventName, ticksToComplete, outcomes, isRepeating });
      setEventName('');
      setTicksToComplete(1);
      setOutcomes([]);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div onClick={haltEvt} className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add Event</h2>
        <div className="flex items-center justify-between mb-4">
          {/* Event Name Input */}
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            onKeyDown={checkEscEnt(() => {}, onClose)}
            placeholder="Event Name"
            autoFocus
            className="flex-grow p-2 border border-gray-300 rounded mr-4"
          />

          {/* Ticks to Complete Input */}
          <input
            type="number"
            value={ticksToComplete}
            onChange={(e) => setTicksToComplete(Number(e.target.value))}
            placeholder="Ticks"
            className="w-16 p-2 border border-gray-300 rounded text-center"
          />
        </div>

        {/* Outcomes */}
        <h3 className="text-md font-semibold mb-2">Outcomes</h3>
        {outcomes.map((outcome, index) => (
          <div key={index} className="flex items-center mb-2">
            <select
              value={outcome.resourceName}
              onChange={(e) =>
                handleOutcomeChange(index, 'resourceName', e.target.value)
              }
              className="mr-2 p-2 border border-gray-300 rounded"
            >
              {resources.map((res) => (
                <option key={res.name} value={res.name}>
                  {res.name}
                </option>
              ))}
            </select>
            <select
              value={outcome.operation}
              onChange={(e) =>
                handleOutcomeChange(index, 'operation', e.target.value)
              }
              className="mr-2 p-2 border border-gray-300 rounded"
            >
              <option value="increment">Increment</option>
              <option value="decrement">Decrement</option>
            </select>
            <input
              type="number"
              autoFocus
              value={outcome.amount}
              onChange={(e) =>
                handleOutcomeChange(index, 'amount', Number(e.target.value))
              }
              className="mr-2 p-2 border border-gray-300 rounded"
            />
            <select
              value={outcome.timing}
              onChange={(e) =>
                handleOutcomeChange(index, 'timing', e.target.value)
              }
              className="mr-2 p-2 border border-gray-300 rounded"
            >
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleRemoveOutcome(index)}
              title="Remove Outcome"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleAddOutcome}
        >
          Add Outcome
        </button>

        {/* Repeating Checkbox */}
        <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="repeating"
            className="mr-2"
            checked={isRepeating}
            onChange={(e) => setIsRepeating(e.target.checked)}
          />
          <label htmlFor="repeating" className="text-gray-700">
            Repeating
          </label>
        </div>

        {/* Control flow buttons */}

        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddEvent}
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGameEventModal;
