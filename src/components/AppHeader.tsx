import { useAppContext } from '@/context/AppContext';

const AppHeader: React.FC = () => {
  const { clearState } = useAppContext();
  return (
    <header className="text-center p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl font-bold">Prototype Counter</h1>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        onClick={clearState}
      >
        Clear saved data
      </button>
    </header>
  );
};

export default AppHeader;
