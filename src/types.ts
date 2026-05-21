export interface Challenge {
  id: string;
  title: string;
  description: string;
  constraints: string[];
  durationMinutes: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'CHAOTIC';
  points: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  badgeCode: string;
}

export interface LibraryErrorItem {
  id: string;
  title: string;
  creator: string;
  description: string;
  imageUrl: string;
  errorType: 'Glitch Art' | 'Misprint' | 'Compression Artefact' | 'Brutalist Chaos' | 'Destroyed Web';
  year: string;
  likes: number;
}

export interface CommunityPost {
  id: string;
  user: {
    username: string;
    avatarUrl: string;
    level: number;
  };
  title: string;
  imageUrl: string;
  originalUrl?: string;
  likes: number;
  likedByUser?: boolean;
  comments: { id: string; user: string; text: string; time: string }[];
  tags: string[];
  createdAt: string;
}

export interface UserProfile {
  username: string;
  level: number;
  xp: number;
  maxXp: number;
  points: number;
  completedChallengesCount: number;
  achievements: Achievement[];
}

export interface StyleMixQuery {
  styleA: string;
  styleB: string;
}

export interface ConceptQuery {
  blockType: string; // 'poster', 'logo', 'illustration', 'identity', 'general'
  userInputs?: string;
}
