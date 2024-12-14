import '../styles/globals.css';
// src/pages/index.tsx
import { useState } from 'react';
import { AppProvider } from '../context/AppContext';
import ResourceList from '../components/ResourceList';
import TickManager from '../components/TickManager';
import GameEventLog from '../components/GameEventLog';
import AddResourceModal from '../components/AddResourceModal';
import AddGameEventModal from '../components/AddGameEventModal';
import HeaderWithButton from '@/components/HeaderWithButton';
import AppHeader from '@/components/AppHeader';

const Home = () => {
  const [isResourceModalOpen, setResourceModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);

  const addResource = () => setResourceModalOpen(true);
  const addEvent = () => setEventModalOpen(true);

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex flex-1">
          {/* Left Column */}
          <div className="flex flex-col w-1/4 border-r border-gray-300 p-4">
            <HeaderWithButton
              title="Resources"
              buttonText="Add Resource"
              onButtonClick={addResource}
            />
            <ResourceList />
          </div>

          {/* Middle Column */}
          <div className="flex flex-col w-1/2 border-r border-gray-300 p-4">
            <HeaderWithButton
              title="Event Log"
              buttonText="Add Event"
              onButtonClick={addEvent}
            />
            <GameEventLog />
          </div>

          {/* Right Column */}
          <div className="flex flex-col w-1/4 p-4">
            <TickManager />
          </div>
        </main>
      </div>

      {/* Modals */}
      {isResourceModalOpen && (
        <AddResourceModal onClose={() => setResourceModalOpen(false)} />
      )}
      {isEventModalOpen && (
        <AddGameEventModal onClose={() => setEventModalOpen(false)} />
      )}
    </AppProvider>
  );
};

export default Home;
