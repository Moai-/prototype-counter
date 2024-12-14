import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { checkEscEnt } from './_util';

const ResourceList: React.FC = () => {
  const { resources, updateResource } = useAppContext();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number | null>(null);

  const handleEditStart = (index: number, currentAmount: number) => {
    setEditingIndex(index);
    setEditValue(currentAmount);
  };

  const handleEditSubmit = (resourceName: string) => {
    if (editValue !== null) {
      updateResource(resourceName, editValue - resources[editingIndex!].amount);
      setEditingIndex(null);
      setEditValue(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue(null);
  };

  return (
    <div>
      <ul>
        {resources.map((resource, index) => (
          <li
            key={resource.name}
            className="flex justify-between items-center py-1"
          >
            {/* Resource Name */}
            <span className="font-mono">{resource.name}</span>

            {/* Resource Amount (or Input) */}
            {editingIndex === index ? (
              <input
                type="number"
                value={editValue ?? ''}
                onChange={(e) => setEditValue(Number(e.target.value))}
                onBlur={() => handleEditSubmit(resource.name)}
                onKeyDown={checkEscEnt(
                  () => handleEditSubmit(resource.name),
                  handleCancelEdit
                )}
                className="w-16 p-1 border border-gray-300 rounded text-right"
                autoFocus
              />
            ) : (
              <span
                className="font-semibold text-gray-600 cursor-pointer"
                onClick={() => handleEditStart(index, resource.amount)}
              >
                {resource.amount}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResourceList;
