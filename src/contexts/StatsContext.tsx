import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserStats, MusicDNAProfile } from '../types';
import { getLocalStats, updateStats, saveMusicDNA, resetAllStats } from '../services/storage';

interface StatsContextType {
  stats: UserStats;
  recordGameResult: (modeId: string, won: boolean, score: number, streak: number, responseTime?: number) => void;
  saveDNA: (profile: MusicDNAProfile) => void;
  resetStats: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(getLocalStats());

  useEffect(() => {
    setStats(getLocalStats());
  }, []);

  const recordGameResult = (
    modeId: string,
    won: boolean,
    score: number,
    streak: number,
    responseTime?: number
  ) => {
    const updated = updateStats(modeId, won, score, streak, responseTime);
    setStats(updated);
  };

  const saveDNA = (profile: MusicDNAProfile) => {
    const updated = saveMusicDNA(profile);
    setStats(updated);
  };

  const resetStats = () => {
    const reset = resetAllStats();
    setStats(reset);
  };

  return (
    <StatsContext.Provider value={{ stats, recordGameResult, saveDNA, resetStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
