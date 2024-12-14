import React from 'react';
import { useAppContext } from '../context/AppContext';
import GameEventCard from './GameEventCard';
import ScrollableFeed from 'react-scrollable-feed';
import { useWindowDimensions } from './_util';

const EventLog: React.FC = () => {
  const { events, cancelGameEvent, copyGameEvent } = useAppContext();
  const { height } = useWindowDimensions();
  const calcHeight = height ? height - 170 : '1074px';
  return (
    <div className="flex flex-col" style={{ height: calcHeight }}>
      <ScrollableFeed className="flex-grow">
        <ul className="mr-4">
          {events.map((event) => (
            <GameEventCard
              key={event.id}
              event={event}
              onCancel={() => cancelGameEvent(event.id)}
              onCopy={() => copyGameEvent(event.id)}
            />
          ))}
        </ul>
      </ScrollableFeed>
    </div>
  );
};

export default EventLog;
