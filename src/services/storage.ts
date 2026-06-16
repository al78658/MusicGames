import type { UserStats, MusicDNAProfile } from '../types';

const STATS_KEY = 'music_game_user_stats';

const DEFAULT_STATS: UserStats = {
  overall: {
    played: 0,
    won: 0,
    bestScore: 0,
    maxStreak: 0,
    totalResponseTime: 0,
    totalAnswers: 0,
  },
  modes: {}
};

export const getLocalStats = (): UserStats => {
  const data = localStorage.getItem(STATS_KEY);
  if (!data) return DEFAULT_STATS;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load local stats", e);
    return DEFAULT_STATS;
  }
};

export const saveLocalStats = (stats: UserStats): void => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const updateStats = (
  modeId: string,
  won: boolean,
  score: number,
  streak: number,
  responseTime?: number
): UserStats => {
  const stats = getLocalStats();

  // Initialize mode if not exists
  if (!stats.modes[modeId]) {
    stats.modes[modeId] = {
      played: 0,
      won: 0,
      bestScore: 0,
      maxStreak: 0,
      totalResponseTime: 0,
      totalAnswers: 0,
      modeId
    };
  }

  const mode = stats.modes[modeId];

  // Update mode stats
  mode.played += 1;
  if (won) mode.won += 1;
  mode.bestScore = Math.max(mode.bestScore, score);
  mode.maxStreak = Math.max(mode.maxStreak, streak);
  if (responseTime !== undefined) {
    mode.totalResponseTime += responseTime;
    mode.totalAnswers += 1;
  }

  // Update overall stats
  stats.overall.played += 1;
  if (won) stats.overall.won += 1;
  stats.overall.bestScore = Math.max(stats.overall.bestScore, score);
  stats.overall.maxStreak = Math.max(stats.overall.maxStreak, streak);
  if (responseTime !== undefined) {
    stats.overall.totalResponseTime += responseTime;
    stats.overall.totalAnswers += 1;
  }

  saveLocalStats(stats);
  return stats;
};

export const saveMusicDNA = (profile: MusicDNAProfile): UserStats => {
  const stats = getLocalStats();
  stats.dnaProfile = profile;
  saveLocalStats(stats);
  return stats;
};

export const resetAllStats = (): UserStats => {
  saveLocalStats(DEFAULT_STATS);
  return DEFAULT_STATS;
};
