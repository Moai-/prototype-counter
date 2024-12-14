import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type Resource = {
  name: string;
  amount: number;
};

export type Outcome = {
  resourceName: string;
  operation: 'increment' | 'decrement';
  amount: number;
  timing: 'before' | 'after';
};

export type RawGameEvent = {
  name: string;
  ticksToComplete: number;
  outcomes: Outcome[];
  isRepeating: boolean;
};

type GameEventStatus = 'pending' | 'completed' | 'cancelled' | 'failed';

export type GameEvent = RawGameEvent & {
  id: string;
  ticksTotal: number;
  addedOn: number;
  endedOn: number | null;
  status: GameEventStatus;
};

type AppData = {
  resources: Resource[];
  events: GameEvent[];
  ticks: number;
};

type AppState = AppData & {
  addResource: (name: string) => void;
  updateResource: (name: string, amount: number) => void;
  addGameEvent: (event: RawGameEvent) => void;
  incrementTick: () => void;
  cancelGameEvent: (id: string) => void;
  copyGameEvent: (id: string) => void;
  clearState: () => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

const DEFAULT_STATE: AppData = {
  resources: [],
  events: [],
  ticks: 0,
};

const LOCAL_STORAGE_KEY = 'prototype-counter-state';

const signedOutcomeAmount = (outcome: Outcome) =>
  outcome.operation === 'increment' ? outcome.amount : -outcome.amount;

const isEventFinished = (event: GameEvent) =>
  ['completed', 'failed'].includes(event.status);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [appState, setAppState] = useState<AppData>(DEFAULT_STATE);

  // Load state in useEffect to avoid SSR issues
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    setAppState(
      savedState ? (JSON.parse(savedState) as AppData) : DEFAULT_STATE
    );
  }, []);

  // Save state to localStorage (non-blocking with queued updates)
  useEffect(() => {
    let isSaving = false;
    let queued = false;

    const saveState = async () => {
      if (isSaving) {
        queued = true;
        return;
      }
      isSaving = true;
      try {
        await new Promise((resolve) =>
          setTimeout(() => {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appState));
            resolve(true);
          }, 0)
        );
      } finally {
        isSaving = false;
        if (queued) {
          queued = false;
          saveState();
        }
      }
    };

    saveState();
  }, [appState]);

  const addResource = (name: string) => {
    setAppState((prev) => ({
      ...prev,
      resources: prev.resources.find((res) => res.name === name)
        ? prev.resources
        : [...prev.resources, { name, amount: 0 }],
    }));
  };

  const willExhaustResource = (name: string, amount: number) => {
    const targetResource = appState.resources.find((res) => res.name === name);
    if (targetResource) {
      return targetResource.amount + amount < 0;
    }
    return true;
  };

  const updateResource = (name: string, amount: number) => {
    setAppState((prev) => ({
      ...prev,
      resources: prev.resources.map((res) =>
        res.name === name ? { ...res, amount: res.amount + amount } : res
      ),
    }));
  };

  const addGameEvent = (event: RawGameEvent) => {
    let willExhaustAnyResource = false;
    event.outcomes.forEach((outcome) => {
      if (outcome.timing === 'before') {
        const signedAmount = signedOutcomeAmount(outcome);
        if (!willExhaustResource(outcome.resourceName, signedAmount)) {
          updateResource(outcome.resourceName, signedAmount);
        } else {
          willExhaustAnyResource = true;
        }
      }
    });
    if (!willExhaustAnyResource) {
      setAppState((prev) => ({
        ...prev,
        events: [
          ...prev.events,
          {
            ...event,
            addedOn: prev.ticks,
            endedOn: null,
            id: `evt-${prev.events.length}`,
            status: 'pending',
            ticksTotal: event.ticksToComplete,
          },
        ],
      }));
    } else {
      setAppState((prev) => ({
        ...prev,
        events: [
          ...prev.events,
          {
            ...event,
            addedOn: prev.ticks,
            endedOn: prev.ticks,
            id: `evt-${prev.events.length}`,
            status: 'failed',
            ticksTotal: event.ticksToComplete,
          },
        ],
      }));
    }
  };

  const incrementTick = () => {
    setAppState((prev) => {
      const thisTick = prev.ticks + 1;
      const updatedEvents = prev.events
        .map((event) => {
          const countedDownEventTick = event.ticksToComplete - 1;
          if (event.status === 'pending' && countedDownEventTick === 0) {
            // Event ready to complete, check if we can expend its resources
            const willExhaustAnyResource = event.outcomes.some(
              (outcome) =>
                outcome.timing === 'after' &&
                willExhaustResource(
                  outcome.resourceName,
                  signedOutcomeAmount(outcome)
                )
            );

            // Complete the event if possible and update resources
            const finishedEvent = {
              ...event,
              ticksToComplete: 0,
              endedOn: thisTick,
            };
            if (!willExhaustAnyResource) {
              // Event can be completed. Update resources and create a new event if repeating
              event.outcomes.forEach(
                (outcome) =>
                  outcome.timing === 'after' &&
                  updateResource(
                    outcome.resourceName,
                    signedOutcomeAmount(outcome)
                  )
              );
              if (event.isRepeating) {
                addGameEvent({ ...event, ticksToComplete: event.ticksTotal });
              }
              return {
                ...finishedEvent,
                status: 'completed',
              } as GameEvent;
            } else {
              // Cannot complete event as one or more resources would go below 0. Fail event and do not repeat
              return {
                ...finishedEvent,
                status: 'failed',
              } as GameEvent;
            }
          } else if (event.status === 'pending') {
            return { ...event, ticksToComplete: countedDownEventTick };
          }
          return event;
        })
        .sort((a, b) => {
          // Sort so that events that finished this tick appear on the bottom
          if (isEventFinished(a) && a.endedOn === thisTick) {
            return 1;
          } else if (isEventFinished(b) && b.endedOn === thisTick) {
            return -1;
          }
          return 0;
        });

      return {
        ...prev,
        ticks: thisTick,
        events: updatedEvents,
      };
    });
  };

  const cancelGameEvent = (id: string) => {
    setAppState((prev) => ({
      ...prev,
      events: prev.events.map((event) =>
        event.id === id && event.status === 'pending'
          ? { ...event, status: 'cancelled', endedOn: prev.ticks }
          : event
      ),
    }));
  };

  const copyGameEvent = (id: string) => {
    const eventToCopy = appState.events.find((event) => event.id === id);
    if (eventToCopy) {
      addGameEvent({ ...eventToCopy, ticksToComplete: eventToCopy.ticksTotal });
    }
  };

  const clearState = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAppState(DEFAULT_STATE);
  };

  return (
    <AppContext.Provider
      value={{
        resources: appState.resources,
        events: appState.events,
        ticks: appState.ticks,
        addResource,
        updateResource,
        addGameEvent,
        incrementTick,
        cancelGameEvent,
        copyGameEvent,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
