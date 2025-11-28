
import { DailyRhythm, DogProfile, ChatMessage, CheckInSession, UserStats } from '../types';

const KEYS = {
  PROFILE: 'wildcord_profile',
  RHYTHM: 'wildcord_rhythm',
  CHAT: 'wildcord_chat',
  CHECKINS: 'wildcord_checkins',
  STATS: 'wildcord_stats',
  RSVPS: 'wildcord_rsvps'
};

const DEFAULT_STATS: UserStats = {
  totalMiles: 0,
  totalSessions: 0,
  streakDays: 0,
  lastCheckInDate: 0,
  rank: 'Greenhorn',
  nextRank: 'Scout',
  milesToNext: 10,
  progressPercent: 0
};

export const db = {
  getProfile: (): DogProfile | null => {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  },
  saveProfile: (profile: DogProfile) => {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  },

  getRhythm: (): DailyRhythm | null => {
    const data = localStorage.getItem(KEYS.RHYTHM);
    return data ? JSON.parse(data) : null;
  },
  saveRhythm: (rhythm: DailyRhythm) => {
    localStorage.setItem(KEYS.RHYTHM, JSON.stringify(rhythm));
  },

  getChatHistory: (): ChatMessage[] => {
    const data = localStorage.getItem(KEYS.CHAT);
    return data ? JSON.parse(data) : [];
  },
  saveChatHistory: (history: ChatMessage[]) => {
    localStorage.setItem(KEYS.CHAT, JSON.stringify(history));
  },

  getCheckIns: (): CheckInSession[] => {
    const data = localStorage.getItem(KEYS.CHECKINS);
    return data ? JSON.parse(data) : [];
  },
  saveCheckIn: (session: CheckInSession) => {
    const current = db.getCheckIns();
    const updated = [session, ...current];
    localStorage.setItem(KEYS.CHECKINS, JSON.stringify(updated));
    return updated;
  },

  getStats: (): UserStats => {
    const data = localStorage.getItem(KEYS.STATS);
    return data ? JSON.parse(data) : DEFAULT_STATS;
  },
  saveStats: (stats: UserStats) => {
    localStorage.setItem(KEYS.STATS, JSON.stringify(stats));
  },

  getRSVPs: (): string[] => {
    const data = localStorage.getItem(KEYS.RSVPS);
    return data ? JSON.parse(data) : [];
  },
  toggleRSVP: (eventId: string) => {
    const current = db.getRSVPs();
    let updated;
    if (current.includes(eventId)) {
      updated = current.filter(id => id !== eventId);
    } else {
      updated = [...current, eventId];
    }
    localStorage.setItem(KEYS.RSVPS, JSON.stringify(updated));
    return updated;
  }
};
