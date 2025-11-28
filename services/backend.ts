
import { db } from './storage';
import * as ai from './geminiService';
import { DogProfile, ChatMessage, CheckInSession, CheckInInput, UserStats, CommunityEvent, CommunityPost } from '../types';

// Rank Definitions
const RANKS = [
  { name: 'Greenhorn', minMiles: 0 },
  { name: 'Scout', minMiles: 10 },
  { name: 'Ranger', minMiles: 50 },
  { name: 'Apex Predator', minMiles: 150 },
  { name: 'Legend', minMiles: 500 }
];

// Mock Community Data (In a real app, this comes from a database)
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    title: 'Winter Protocol: Paw Protection',
    content: 'Temperatures are dropping. Salt on the roads is the enemy. If you aren\'t using wax or booties, you\'re failing your partner. We just dropped a guide on the best protective wax in the shop.',
    date: '2 days ago',
    author: 'Wildcord HQ',
    type: 'INTEL'
  },
  {
    id: '2',
    title: 'The "Leave It" Challenge',
    content: 'This week, we are focusing on high-value denial. Can your dog hold a "leave it" with a raw steak 3 feet away? Post your videos in the Pack chat. Best execution earns a free harness.',
    date: '5 days ago',
    author: 'Head Trainer',
    type: 'ANNOUNCEMENT'
  }
];

const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'ev1',
    title: 'Sunrise Ruck: Black Ridge',
    location: 'North Trailhead, Parking Lot B',
    date: 'Saturday, Nov 18',
    time: '06:00 AM',
    description: '5 miles. 1500ft elevation. Reactive dogs must wear yellow ribbons. Coffee at the summit.',
    difficulty: 'Ranger',
    attendees: 14
  },
  {
    id: 'ev2',
    title: 'Urban Exposure: City Center',
    location: 'Union Station Plaza',
    date: 'Sunday, Nov 19',
    time: '09:00 AM',
    description: 'Focus on neutrality in high traffic. Not a play date. We work on engagement amidst chaos.',
    difficulty: 'Greenhorn',
    attendees: 22
  }
];

const calculateRank = (miles: number) => {
  let current = RANKS[0];
  let next = RANKS[1];

  for (let i = 0; i < RANKS.length; i++) {
    if (miles >= RANKS[i].minMiles) {
      current = RANKS[i];
      next = RANKS[i + 1] || { name: 'Max Rank', minMiles: miles * 2 };
    }
  }

  const milesInRank = miles - current.minMiles;
  const rankSpan = next.minMiles - current.minMiles;
  const progress = Math.min(100, Math.max(0, (milesInRank / rankSpan) * 100));

  return {
    rank: current.name,
    nextRank: next.name,
    milesToNext: next.minMiles - miles,
    progressPercent: progress
  };
};

export const backend = {
  user: {
    getProfile: async () => {
      return db.getProfile();
    },
    updateProfile: async (profile: DogProfile) => {
      db.saveProfile(profile);
      return profile;
    }
  },

  rhythm: {
    get: async () => {
      return db.getRhythm();
    },
    generate: async (profile: DogProfile) => {
      db.saveProfile(profile);
      const rhythm = await ai.generateDailyRhythm(profile);
      if (rhythm) {
        db.saveRhythm(rhythm);
      }
      return rhythm;
    }
  },

  pack: {
    getHistory: async () => {
      let history = db.getChatHistory();
      if (history.length === 0) {
        history = [{
          id: 'init',
          role: 'model',
          text: 'Welcome to the Pack. I’m the Head Trainer here. Life getting in the way of the training? Let’s figure it out. What’s going on?',
          timestamp: Date.now()
        }];
        db.saveChatHistory(history);
      }
      return history;
    },
    sendMessage: async (text: string) => {
      const currentHistory = db.getChatHistory();
      
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: text,
        timestamp: Date.now()
      };
      
      const historyWithUser = [...currentHistory, userMsg];
      db.saveChatHistory(historyWithUser);

      const aiHistory = currentHistory.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await ai.chatWithWildcord(text, aiHistory);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      const finalHistory = [...historyWithUser, botMsg];
      db.saveChatHistory(finalHistory);
      
      return finalHistory;
    }
  },

  performance: {
    getHistory: async () => {
      return db.getCheckIns();
    },
    getStats: async (): Promise<UserStats> => {
      const stats = db.getStats();
      // Re-calculate rank in case miles changed manually
      const rankData = calculateRank(stats.totalMiles);
      return { ...stats, ...rankData };
    },
    submitCheckIn: async (input: CheckInInput) => {
      // 1. Update Stats Logic
      const currentStats = db.getStats();
      const newTotalMiles = currentStats.totalMiles + Number(input.miles);
      const newTotalSessions = currentStats.totalSessions + Number(input.sessions);
      
      // Streak Logic (Simple: if last checkin was < 7 days ago, increment)
      const now = Date.now();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      let newStreak = currentStats.streakDays;
      
      if (now - currentStats.lastCheckInDate < oneWeek) {
        newStreak += 1;
      } else if (currentStats.lastCheckInDate === 0) {
        newStreak = 1;
      } else {
        newStreak = 1; // Reset if > 1 week gap
      }

      const rankInfo = calculateRank(newTotalMiles);

      const newStats: UserStats = {
        totalMiles: newTotalMiles,
        totalSessions: newTotalSessions,
        streakDays: newStreak,
        lastCheckInDate: now,
        ...rankInfo
      };

      db.saveStats(newStats);

      // 2. Call AI Coach
      const statsForAi = [
        { label: 'Miles Logged This Week', value: input.miles.toString() },
        { label: 'Sessions Logged This Week', value: input.sessions.toString() },
        { label: 'Current Rank', value: newStats.rank },
        { label: 'Total Miles', value: newStats.totalMiles.toString() }
      ];
      
      const feedback = await ai.submitCheckIn(input.notes, statsForAi);
      
      // 3. Create History Record
      const session: CheckInSession = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        userNotes: input.notes,
        statsSnapshot: statsForAi,
        coachFeedback: feedback,
        status: 'reviewed'
      };

      const updatedHistory = db.saveCheckIn(session);
      return { history: updatedHistory, stats: newStats };
    }
  },

  community: {
    getFeed: async () => {
        return { posts: MOCK_POSTS, events: MOCK_EVENTS };
    },
    getRSVPs: async () => {
        return db.getRSVPs();
    },
    toggleRSVP: async (eventId: string) => {
        return db.toggleRSVP(eventId);
    }
  }
};