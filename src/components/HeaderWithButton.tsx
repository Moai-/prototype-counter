import React from 'react';

type HeaderWithButtonProps = {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
};

const HeaderWithButton: React.FC<HeaderWithButtonProps> = ({
  title,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded text-lg"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default HeaderWithButton;
