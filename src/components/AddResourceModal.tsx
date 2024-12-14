import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { checkEscEnt, haltEvt } from './_util';

const AddResourceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addResource } = useAppContext();
  const [resourceName, setResourceName] = useState('');

  const handleAddResource = () => {
    if (resourceName.trim()) {
      addResource(resourceName.trim());
      setResourceName('');
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div onClick={haltEvt} className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Add Resource</h2>
        <input
          type="text"
          value={resourceName}
          onChange={(e) => setResourceName(e.target.value)}
          onKeyDown={checkEscEnt(handleAddResource, onClose)}
          placeholder="Resource Name"
          autoFocus
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <div className="flex justify-end">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleAddResource}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddResourceModal;
