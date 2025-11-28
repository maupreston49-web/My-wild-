
export enum Page {
  HOME = 'HOME',
  RHYTHM = 'RHYTHM',
  PACK = 'PACK',
  DASHBOARD = 'DASHBOARD',
  COMMUNITY = 'COMMUNITY'
}

export interface RhythmSegment {
  title: string;
  duration: string;
  activity: string;
  vibe: string; // e.g., "High Octane" or "Chill"
}

export interface DailyRhythm {
  theme: string; // e.g., "The Rainy Day Protocol"
  motto: string;
  ritual: RhythmSegment; // Morning/Coffee
  work: RhythmSegment;   // Main physical outlet
  peace: RhythmSegment;  // Evening decompression
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DogProfile {
  name: string;
  age: string;
  breed: string;
  energy: 'Low' | 'Moderate' | 'High' | 'Infinite';
  environment: 'City' | 'Suburbs' | 'Rural/Wild';
  timeAvailable: '15 mins' | '30-60 mins' | 'Unlimited';
}

export interface UserStats {
  totalMiles: number;
  totalSessions: number;
  streakDays: number;
  lastCheckInDate: number;
  rank: string;
  nextRank: string;
  milesToNext: number;
  progressPercent: number;
}

export interface CheckInInput {
  notes: string;
  miles: number;
  sessions: number;
}

export interface CheckInSession {
  id: string;
  date: string;
  userNotes: string;
  statsSnapshot: { label: string; value: string }[];
  coachFeedback: string | null;
  status: 'pending' | 'reviewed';
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  type: 'INTEL' | 'ANNOUNCEMENT';
}

export interface CommunityEvent {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string;
  difficulty: 'Greenhorn' | 'Ranger' | 'Apex';
  attendees: number;
}
