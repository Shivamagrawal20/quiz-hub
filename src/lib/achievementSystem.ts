import { doc, updateDoc, getDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getUserQuizHistory } from "./quizFirestore";
import { 
  Trophy, 
  Star, 
  Award, 
  Medal, 
  Crown, 
  Zap, 
  Target, 
  TrendingUp, 
  Clock, 
  BookOpen, 
  Flame, 
  Brain,
  Calendar,
  Users,
  BookMarked,
  Activity,
  BarChart3,
  Timer,
  Lightbulb,
  Heart,
  Shield,
  Rocket,
  Gem,
  Palette,
  Music,
  Camera,
  Gamepad2,
  Code,
  Globe,
  Leaf,
  Coffee,
  Pizza,
  Sun,
  Moon,
  Cloud,
  Rainbow
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt?: Date;
  requirements: string[];
  rewards?: {
    points?: number;
    title?: string;
    special?: string;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon?: any; // React component for icons
  imagePath?: string; // Path to PNG image
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  category: string;
}

export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: Record<number, number>;
  completedAt: any;
}

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  // Participation Achievements
  {
    id: 'first-quiz',
    title: 'First Steps',
    description: 'Complete your first quiz',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'participation',
    rarity: 'common',
    points: 10,
    requirements: ['Complete 1 quiz'],
    rewards: { points: 10, title: 'Novice' }
  },
  {
    id: 'quiz-enthusiast',
    title: 'Quiz Enthusiast',
    description: 'Complete 5 quizzes',
    icon: '📚',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'participation',
    rarity: 'common',
    points: 25,
    requirements: ['Complete 5 quizzes'],
    rewards: { points: 25, title: 'Enthusiast' }
  },
  {
    id: 'quiz-master',
    title: 'Quiz Master',
    description: 'Complete 25 quizzes',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    category: 'participation',
    rarity: 'rare',
    points: 100,
    requirements: ['Complete 25 quizzes'],
    rewards: { points: 100, title: 'Master' }
  },
  {
    id: 'quiz-legend',
    title: 'Quiz Legend',
    description: 'Complete 100 quizzes',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'participation',
    rarity: 'legendary',
    points: 500,
    requirements: ['Complete 100 quizzes'],
    rewards: { points: 500, title: 'Legend', special: 'Exclusive profile badge' }
  },

  // Performance Achievements
  {
    id: 'high-scorer',
    title: 'High Scorer',
    description: 'Achieve 90% or higher on any quiz',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 90,
    category: 'performance',
    rarity: 'rare',
    points: 50,
    requirements: ['Score 90% or higher on any quiz'],
    rewards: { points: 50, title: 'High Scorer' }
  },
  {
    id: 'perfect-score',
    title: 'Perfect Score',
    description: 'Get 100% on any quiz',
    icon: '💎',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    category: 'performance',
    rarity: 'epic',
    points: 200,
    requirements: ['Score 100% on any quiz'],
    rewards: { points: 200, title: 'Perfect', special: 'Golden profile frame' }
  },
  {
    id: 'consistent',
    title: 'Consistent Performer',
    description: 'Maintain 80% average score',
    icon: '📈',
    unlocked: false,
    progress: 0,
    maxProgress: 80,
    category: 'performance',
    rarity: 'rare',
    points: 75,
    requirements: ['Maintain 80% average score'],
    rewards: { points: 75, title: 'Consistent' }
  },
  {
    id: 'accuracy-expert',
    title: 'Accuracy Expert',
    description: 'Maintain 95% accuracy across all quizzes',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 95,
    category: 'performance',
    rarity: 'epic',
    points: 150,
    requirements: ['Maintain 95% accuracy'],
    rewards: { points: 150, title: 'Accuracy Expert' }
  },

  // Efficiency Achievements
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a quiz in under 5 minutes',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'efficiency',
    rarity: 'rare',
    points: 50,
    requirements: ['Complete a quiz in under 5 minutes'],
    rewards: { points: 50, title: 'Speed Demon' }
  },
  {
    id: 'time-master',
    title: 'Time Master',
    description: 'Complete 10 quizzes with excellent time management',
    icon: '⏱️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    category: 'efficiency',
    rarity: 'epic',
    points: 100,
    requirements: ['Complete 10 quizzes efficiently'],
    rewards: { points: 100, title: 'Time Master' }
  },

  // Consistency Achievements
  {
    id: 'streak-master',
    title: 'Streak Master',
    description: 'Maintain a 7-day quiz streak',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    category: 'consistency',
    rarity: 'rare',
    points: 75,
    requirements: ['Maintain 7-day quiz streak'],
    rewards: { points: 75, title: 'Streak Master' }
  },
  {
    id: 'daily-learner',
    title: 'Daily Learner',
    description: 'Complete quizzes for 30 consecutive days',
    icon: '📅',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    category: 'consistency',
    rarity: 'legendary',
    points: 300,
    requirements: ['Maintain 30-day quiz streak'],
    rewards: { points: 300, title: 'Daily Learner', special: 'Exclusive learning path' }
  },

  // Special Achievements
  {
    id: 'brain-booster',
    title: 'Brain Booster',
    description: 'Complete quizzes in 5 different subjects',
    icon: '🧠',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    category: 'special',
    rarity: 'epic',
    points: 125,
    requirements: ['Complete quizzes in 5 different subjects'],
    rewards: { points: 125, title: 'Brain Booster' }
  },
  {
    id: 'community-contributor',
    title: 'Community Contributor',
    description: 'Upload notes and help other learners',
    icon: '🤝',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    category: 'special',
    rarity: 'rare',
    points: 75,
    requirements: ['Upload study notes'],
    rewards: { points: 75, title: 'Contributor' }
  }
];

// Badge definitions - All available badges
export const BADGE_DEFINITIONS: Badge[] = [
  // Core Badges
  {
    id: 'novice',
    name: 'Novice',
    description: 'Begin your learning journey',
    icon: Target,
    imagePath: '/badges/Novice.svg',
    color: 'bg-blue-500',
    rarity: 'common',
    unlocked: false,
    category: 'participation'
  },
  {
    id: 'enthusiast',
    name: 'Enthusiast',
    description: 'Completed 5 quizzes',
    icon: Heart,
    imagePath: '/badges/quiz-enthusiast.svg',
    color: 'bg-green-500',
    rarity: 'common',
    unlocked: false,
    category: 'participation'
  },
  {
    id: 'quiz-enthusiast',
    name: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    icon: Heart,
    imagePath: '/badges/quiz-enthusiast.svg',
    color: 'bg-pink-500',
    rarity: 'rare',
    unlocked: false,
    category: 'participation'
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: Crown,
    imagePath: '/badges/quiz-master.svg',
    color: 'bg-purple-800',
    rarity: 'legendary',
    unlocked: false,
    category: 'participation'
  },
  {
    id: 'quiz-legend',
    name: 'Quiz Legend',
    description: 'Complete 100 quizzes',
    icon: Star,
    imagePath: '/badges/quiz-legend.svg',
    color: 'bg-yellow-500',
    rarity: 'legendary',
    unlocked: false,
    category: 'participation'
  },
  
  // Master Series Badges
  {
    id: 'quiz-master-1',
    name: 'Quiz Master I',
    description: 'Advanced quiz completion',
    icon: Trophy,
    imagePath: '/badges/quiz-master-1.svg',
    color: 'bg-purple-500',
    rarity: 'rare',
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'quiz-master-2',
    name: 'Quiz Master II',
    description: 'Expert quiz completion',
    icon: Crown,
    imagePath: '/badges/quiz-master-2.svg',
    color: 'bg-yellow-500',
    rarity: 'epic',
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'quiz-master-3',
    name: 'Quiz Master III',
    description: 'Legendary quiz completion',
    icon: Crown,
    imagePath: '/badges/quiz-master-3.svg',
    color: 'bg-red-500',
    rarity: 'legendary',
    unlocked: false,
    category: 'mastery'
  },
  
  // Performance Badges
  {
    id: 'accuracy-expert',
    name: 'Accuracy Expert',
    description: '95%+ accuracy on quizzes',
    icon: Target,
    imagePath: '/badges/accuracy-expert.svg',
    color: 'bg-emerald-500',
    rarity: 'epic',
    unlocked: false,
    category: 'performance'
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: '80%+ average score',
    icon: TrendingUp,
    imagePath: '/badges/consistent.svg',
    color: 'bg-indigo-500',
    rarity: 'rare',
    unlocked: false,
    category: 'performance'
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Achieve high scores consistently',
    icon: Star,
    imagePath: '/badges/high-scorer.svg',
    color: 'bg-yellow-500',
    rarity: 'rare',
    unlocked: false,
    category: 'performance'
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Achieve 100% on a quiz',
    icon: Trophy,
    imagePath: '/badges/perfect-score.svg',
    color: 'bg-purple-500',
    rarity: 'epic',
    unlocked: false,
    category: 'performance'
  },
  
  // Efficiency Badges
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Fast quiz completion',
    icon: Zap,
    imagePath: '/badges/speed-demon.svg',
    color: 'bg-orange-500',
    rarity: 'rare',
    unlocked: false,
    category: 'efficiency'
  },
  {
    id: 'time-master',
    name: 'Time Master',
    description: 'Excellent time management',
    icon: Clock,
    imagePath: '/badges/time-master.svg',
    color: 'bg-blue-500',
    rarity: 'rare',
    unlocked: false,
    category: 'efficiency'
  },
  
  // Consistency Badges
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain learning streaks',
    icon: Flame,
    imagePath: '/badges/streak-master.svg',
    color: 'bg-red-500',
    rarity: 'epic',
    unlocked: false,
    category: 'consistency'
  },
  {
    id: 'daily-learner',
    name: 'Daily Learner',
    description: 'Learn every day',
    icon: Calendar,
    imagePath: '/badges/daily-learner.svg',
    color: 'bg-green-500',
    rarity: 'rare',
    unlocked: false,
    category: 'consistency'
  },
  
  // Special Badges
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: Award,
    imagePath: '/badges/first-steps.svg',
    color: 'bg-blue-500',
    rarity: 'common',
    unlocked: false,
    category: 'special'
  }
];

// Utility function to clean data before saving to Firestore
function cleanForFirestore(obj: any): any {
  if (obj === null || obj === undefined) {
    return null;
  }
  
  // Handle Date objects
  if (obj instanceof Date) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirestore(item));
  }
  
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanForFirestore(value);
      }
    }
    return cleaned;
  }
  
  return obj;
}

// Get user's current achievements from Firestore
export async function getUserAchievements(userId: string): Promise<Achievement[]> {
  try {
    const userDoc = doc(db, "users", userId);
    const userData = await getDoc(userDoc);
    
    if (userData.exists() && userData.data().achievements) {
      return userData.data().achievements;
    }
    
    // Initialize with default achievements
    const defaultAchievements = ACHIEVEMENT_DEFINITIONS.map(achievement => ({
      ...achievement,
      unlocked: false,
      progress: 0
    }));
    
    // Save default achievements to user document
    await updateDoc(userDoc, {
      achievements: cleanForFirestore(defaultAchievements),
      totalPoints: 0,
      lastAchievementCheck: serverTimestamp()
    });
    
    return defaultAchievements;
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return ACHIEVEMENT_DEFINITIONS.map(achievement => ({
      ...achievement,
      unlocked: false,
      progress: 0
    }));
  }
}

// Get user's current badges from Firestore
export async function getUserBadges(userId: string): Promise<Badge[]> {
  try {
    const userDoc = doc(db, "users", userId);
    const userData = await getDoc(userDoc);
    
    if (userData.exists() && userData.data().badges) {
      return userData.data().badges;
    }
    
    // Initialize with default badges
    const defaultBadges = BADGE_DEFINITIONS.map(badge => ({
      ...badge,
      unlocked: false
    }));
    
    // Save default badges to user document
    await updateDoc(userDoc, {
      badges: cleanForFirestore(defaultBadges)
    });
    
    return defaultBadges;
  } catch (error) {
    console.error('Error getting user badges:', error);
    return BADGE_DEFINITIONS.map(badge => ({
      ...badge,
      unlocked: false
    }));
  }
}

// Check and update achievements based on user's quiz history
export async function checkAndUpdateAchievements(userId: string, newQuizResult?: QuizResult): Promise<{
  newlyUnlocked: Achievement[];
  updatedAchievements: Achievement[];
  totalPoints: number;
}> {
  try {
    // Get current achievements and quiz history
    const [currentAchievements, quizHistory] = await Promise.all([
      getUserAchievements(userId),
      getUserQuizHistory(userId)
    ]);

    // Calculate stats
    const totalQuizzes = quizHistory.length;
    const totalScore = quizHistory.reduce((sum, result: any) => sum + (result.score || 0), 0);
    const averageScore = totalQuizzes > 0 ? totalScore / totalQuizzes : 0;
    const highestScore = quizHistory.length > 0 ? Math.max(...quizHistory.map((result: any) => result.score || 0)) : 0;
    const totalTime = quizHistory.reduce((sum, result: any) => sum + (result.timeTaken || 0), 0);
    const averageTime = totalQuizzes > 0 ? totalTime / totalQuizzes : 0;
    const totalQuestions = quizHistory.reduce((sum, result: any) => sum + (result.totalQuestions || 0), 0);
    const correctAnswers = quizHistory.reduce((sum, result: any) => sum + (result.correctAnswers || 0), 0);
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Get user profile for streak information
    const userDoc = doc(db, "users", userId);
    const userData = await getDoc(userDoc);
    const userProfile = userData.exists() ? userData.data() : {};
    const currentStreak = userProfile.streak || 0;

    // Update achievements based on current stats
    const updatedAchievements = currentAchievements.map(achievement => {
      let newProgress = 0;
      let shouldUnlock = false;

      switch (achievement.id) {
        case 'first-quiz':
          newProgress = Math.min(totalQuizzes, 1);
          shouldUnlock = totalQuizzes >= 1;
          break;
        case 'quiz-enthusiast':
          newProgress = Math.min(totalQuizzes, 5);
          shouldUnlock = totalQuizzes >= 5;
          break;
        case 'quiz-master':
          newProgress = Math.min(totalQuizzes, 25);
          shouldUnlock = totalQuizzes >= 25;
          break;
        case 'quiz-legend':
          newProgress = Math.min(totalQuizzes, 100);
          shouldUnlock = totalQuizzes >= 100;
          break;
        case 'high-scorer':
          newProgress = Math.min(highestScore, 90);
          shouldUnlock = highestScore >= 90;
          break;
        case 'perfect-score':
          newProgress = Math.min(highestScore, 100);
          shouldUnlock = highestScore >= 100;
          break;
        case 'consistent':
          newProgress = Math.min(averageScore, 80);
          shouldUnlock = averageScore >= 80;
          break;
        case 'accuracy-expert':
          newProgress = Math.min(accuracy, 95);
          shouldUnlock = accuracy >= 95;
          break;
        case 'speed-demon':
          newProgress = quizHistory.some((result: any) => (result.timeTaken || 0) < 300) ? 1 : 0;
          shouldUnlock = quizHistory.some((result: any) => (result.timeTaken || 0) < 300);
          break;
        case 'time-master':
          const efficientQuizzes = quizHistory.filter((result: any) => (result.timeTaken || 0) < averageTime * 0.8).length;
          newProgress = Math.min(efficientQuizzes, 10);
          shouldUnlock = efficientQuizzes >= 10;
          break;
        case 'streak-master':
          newProgress = Math.min(currentStreak, 7);
          shouldUnlock = currentStreak >= 7;
          break;
        case 'daily-learner':
          newProgress = Math.min(currentStreak, 30);
          shouldUnlock = currentStreak >= 30;
          break;
        case 'brain-booster':
          const subjects = new Set(quizHistory.map((result: any) => (result.quizTitle || '')?.split(' ')[0] || ''));
          newProgress = Math.min(subjects.size, 5);
          shouldUnlock = subjects.size >= 5;
          break;
        case 'community-contributor':
          // This would need to be connected to notes upload system
          newProgress = 0;
          shouldUnlock = false;
          break;
        default:
          newProgress = achievement.progress;
          shouldUnlock = achievement.unlocked;
      }

      const wasUnlocked = achievement.unlocked;
      const isNowUnlocked = shouldUnlock;

      return {
        ...achievement,
        progress: newProgress,
        unlocked: isNowUnlocked,
        unlockedAt: isNowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt
      };
    });

    // Find newly unlocked achievements
    const newlyUnlocked = updatedAchievements.filter(
      achievement => achievement.unlocked && 
      (!currentAchievements.find(ca => ca.id === achievement.id)?.unlocked || 
       !currentAchievements.find(ca => ca.id === achievement.id))
    );

    // Calculate total points
    const totalPoints = updatedAchievements
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.points, 0);

    // Save updated achievements to Firestore
    await updateDoc(userDoc, {
      achievements: cleanForFirestore(updatedAchievements),
      totalPoints,
      lastAchievementCheck: serverTimestamp()
    });

    // Create notifications for newly unlocked achievements
    if (newlyUnlocked.length > 0) {
      await createAchievementNotifications(userId, newlyUnlocked);
    }

    return {
      newlyUnlocked,
      updatedAchievements,
      totalPoints
    };

  } catch (error) {
    console.error('Error checking achievements:', error);
    throw error;
  }
}

// Check and update badges based on user's achievements
export async function checkAndUpdateBadges(userId: string): Promise<{
  newlyUnlocked: Badge[];
  updatedBadges: Badge[];
}> {
  try {
    const [currentBadges, achievements] = await Promise.all([
      getUserBadges(userId),
      getUserAchievements(userId)
    ]);

    const updatedBadges = currentBadges.map(badge => {
      let shouldUnlock = false;

      switch (badge.id) {
        case 'novice':
          // Novice badge is unlocked when user completes their first quiz
          shouldUnlock = achievements.find(a => a.id === 'first-quiz')?.unlocked || false;
          break;
        case 'enthusiast':
          // Enthusiast badge is unlocked when user completes 5 quizzes
          shouldUnlock = achievements.find(a => a.id === 'quiz-enthusiast')?.unlocked || false;
          break;
        case 'quiz-enthusiast':
          // Quiz Enthusiast badge is unlocked when user shows consistent engagement
          shouldUnlock = achievements.find(a => a.id === 'quiz-enthusiast')?.unlocked || false;
          break;
        case 'quiz-legend':
          // Quiz Legend badge is unlocked when user reaches legendary status
          shouldUnlock = achievements.find(a => a.id === 'quiz-legend')?.unlocked || false;
          break;
        case 'quiz-master-1':
          // Quiz Master I badge is unlocked when user completes 10 quizzes
          shouldUnlock = achievements.find(a => a.id === 'quiz-enthusiast')?.unlocked || false;
          break;
        case 'quiz-master-2':
          // Quiz Master II badge is unlocked when user completes 25 quizzes
          shouldUnlock = achievements.find(a => a.id === 'quiz-master')?.unlocked || false;
          break;
        case 'quiz-master-3':
          // Quiz Master III badge is unlocked when user completes 50 quizzes
          shouldUnlock = achievements.find(a => a.id === 'quiz-master')?.unlocked && 
                         achievements.find(a => a.id === 'quiz-legend')?.progress >= 50 || false;
          break;
        case 'quiz-master':
          // Quiz Master badge is unlocked when user completes 100 quizzes
          shouldUnlock = achievements.find(a => a.id === 'quiz-legend')?.unlocked || false;
          break;
        default:
          shouldUnlock = badge.unlocked;
      }

      const wasUnlocked = badge.unlocked;
      const isNowUnlocked = shouldUnlock;

      return {
        ...badge,
        unlocked: isNowUnlocked,
        unlockedAt: isNowUnlocked && !wasUnlocked ? new Date() : badge.unlockedAt
      };
    });

    // Find newly unlocked badges
    const newlyUnlocked = updatedBadges.filter(
      badge => badge.unlocked && 
      (!currentBadges.find(cb => cb.id === badge.id)?.unlocked || 
       !currentBadges.find(cb => cb.id === badge.id))
    );

    // Save updated badges to Firestore
    const userDoc = doc(db, "users", userId);
    await updateDoc(userDoc, {
      badges: cleanForFirestore(updatedBadges)
    });

    // Create notifications for newly unlocked badges
    if (newlyUnlocked.length > 0) {
      await createBadgeNotifications(userId, newlyUnlocked);
    }

    return {
      newlyUnlocked,
      updatedBadges
    };

  } catch (error) {
    console.error('Error checking badges:', error);
    throw error;
  }
}

// Create notifications for newly unlocked achievements
async function createAchievementNotifications(userId: string, achievements: Achievement[]) {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    
    for (const achievement of achievements) {
      await addDoc(notificationsRef, {
        type: 'achievement',
        title: `Achievement Unlocked: ${achievement.title}`,
        message: `Congratulations! You've unlocked the "${achievement.title}" achievement. ${achievement.rewards?.points ? `+${achievement.rewards.points} points` : ''}`,
        icon: achievement.icon,
        rarity: achievement.rarity,
        points: achievement.points,
        createdAt: serverTimestamp(),
        read: false
      });
    }
  } catch (error) {
    console.error('Error creating achievement notifications:', error);
  }
}

// Create notifications for newly unlocked badges
async function createBadgeNotifications(userId: string, badges: Badge[]) {
  try {
    const notificationsRef = collection(db, "users", userId, "notifications");
    
    for (const badge of badges) {
      await addDoc(notificationsRef, {
        type: 'badge',
        title: `Badge Unlocked: ${badge.name}`,
        message: `You've earned the "${badge.name}" badge! ${badge.description}`,
        rarity: badge.rarity,
        color: badge.color,
        createdAt: serverTimestamp(),
        read: false
      });
    }
  } catch (error) {
    console.error('Error creating badge notifications:', error);
  }
}

// Main function to check achievements and badges after quiz completion
export async function processQuizCompletion(userId: string, quizResult: QuizResult) {
  try {
    // Check and update achievements
    const achievementResult = await checkAndUpdateAchievements(userId, quizResult);
    
    // Check and update badges based on new achievements
    const badgeResult = await checkAndUpdateBadges(userId);
    
    return {
      achievements: achievementResult,
      badges: badgeResult,
      totalPoints: achievementResult.totalPoints
    };
  } catch (error) {
    console.error('Error processing quiz completion:', error);
    throw error;
  }
}

// Get achievement progress for a specific achievement
export function getAchievementProgress(achievementId: string, userStats: any): number {
  switch (achievementId) {
    case 'first-quiz':
      return Math.min(userStats.totalQuizzes || 0, 1);
    case 'enthusiast':
      return Math.min(userStats.totalQuizzes || 0, 5);
    case 'quiz-enthusiast':
      return Math.min(userStats.totalQuizzes || 0, 5);
    case 'quiz-master':
      return Math.min(userStats.totalQuizzes || 0, 25);
    case 'quiz-legend':
      return Math.min(userStats.totalQuizzes || 0, 100);
    case 'high-scorer':
      return Math.min(userStats.highestScore || 0, 90);
    case 'perfect-score':
      return Math.min(userStats.highestScore || 0, 100);
    case 'consistent':
      return Math.min(userStats.averageScore || 0, 80);
    case 'accuracy-expert':
      return Math.min(userStats.accuracy || 0, 95);
    case 'speed-demon':
      return userStats.hasFastQuiz ? 1 : 0;
    case 'time-master':
      return Math.min(userStats.efficientQuizzes || 0, 10);
    case 'streak-master':
      return Math.min(userStats.streak || 0, 7);
    case 'daily-learner':
      return Math.min(userStats.streak || 0, 30);
    case 'brain-booster':
      return Math.min(userStats.subjects || 0, 5);
    default:
      return 0;
  }
} 