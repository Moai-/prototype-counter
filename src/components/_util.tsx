import { useState, useEffect } from 'react';

export const haltEvt = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

export const checkEscEnt =
  (
    onEnter: () => any,
    onEscape: () => any,
    onChange: (val: string) => any = () => {}
  ) =>
  (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEnter();
    } else if (e.key === 'Escape') {
      onEscape();
    } else {
      onChange(e.key);
    }
  };

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = global;
  return {
    width,
    height,
  };
}

export function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    addEventListener('resize', handleResize);
    return () => removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

type TickFormatOptions = {
  rawTick?: boolean;
  day?: boolean;
  time?: boolean;
  is24h?: boolean;
  separator?: string;
};

const DEFAULT_FORMAT_OPTIONS: TickFormatOptions = {
  rawTick: true,
  day: true,
  time: true,
  is24h: false,
  separator: '-',
};

export const formatTick = (tick: number, options: TickFormatOptions = {}) => {
  const fullOpts = {
    ...DEFAULT_FORMAT_OPTIONS,
    ...options,
  };
  const days = Math.floor(tick / 24);
  const currentDayTick = tick % 24;
  const isPm = currentDayTick / 12 >= 1;
  const amPmTime = currentDayTick % 12;
  const formattedTime = amPmTime === 0 ? 12 : amPmTime;

  const combined: Array<string> = [];
  if (fullOpts.rawTick) {
    combined.push(`T${tick}`);
  }
  if (fullOpts.day) {
    combined.push(`D${days}`);
  }
  if (fullOpts.time) {
    combined.push(
      fullOpts.is24h
        ? `${currentDayTick}:00`
        : `${formattedTime}:00 ${isPm ? 'PM' : 'AM'}`
    );
  }

  return combined.join(fullOpts.separator);
};
