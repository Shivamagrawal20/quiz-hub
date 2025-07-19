import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export async function getQuiz(quizId: string) {
  try {
    const ref = doc(db, "quizzes", quizId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return normalizeQuizData(data);
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching quiz ${quizId}:`, error);
    throw error;
  }
}

export async function getCompleteQuiz(quizId: string) {
  try {
    const ref = doc(db, "quizzes", quizId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const normalizedData = normalizeQuizData(data);
      
      // Add additional computed fields
      return {
        ...normalizedData,
        id: quizId,
        totalQuestions: normalizedData?.questions?.length || 0,
        estimatedTime: calculateEstimatedTime(normalizedData?.questions?.length || 0, normalizedData?.duration),
        difficulty: normalizedData?.difficulty || 'medium',
        category: normalizedData?.category || normalizedData?.tags?.[0] || 'General',
        creator: normalizedData?.creator || 'Admin',
        visibility: normalizedData?.visibility || 'public',
        createdAt: normalizedData?.createdAt || new Date().toISOString(),
        updatedAt: normalizedData?.updatedAt || new Date().toISOString(),
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error fetching complete quiz ${quizId}:`, error);
    throw error;
  }
}

// Helper function to calculate estimated time
function calculateEstimatedTime(questionCount: number, duration?: any) {
  if (duration && (duration.hours > 0 || duration.minutes > 0 || duration.seconds > 0)) {
    // If duration is set, use it
    const totalSeconds = (duration.hours || 0) * 3600 + (duration.minutes || 0) * 60 + (duration.seconds || 0);
    return {
      total: totalSeconds,
      formatted: formatTime(totalSeconds),
      type: 'fixed'
    };
  } else {
    // Calculate estimated time based on question count (2 minutes per question)
    const estimatedSeconds = questionCount * 120;
    return {
      total: estimatedSeconds,
      formatted: formatTime(estimatedSeconds),
      type: 'estimated'
    };
  }
}

// Helper function to format time
function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export async function createQuiz(quizId: string, meta: any) {
  const ref = doc(db, "quizzes", quizId);
  await setDoc(ref, meta);
}

export async function updateQuiz(quizId: string, meta: any) {
  const ref = doc(db, "quizzes", quizId);
  await updateDoc(ref, meta);
}

export async function updateQuizVisibility(quizId: string, visibility: string) {
  const ref = doc(db, "quizzes", quizId);
  await updateDoc(ref, { visibility });
}

export async function saveQuestions(quizId: string, questions: any[]) {
  const ref = doc(db, "quizzes", quizId);
  await updateDoc(ref, { questions });
}

export async function getAllQuizzes() {
  const ref = collection(db, "quizzes");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getQuizzesForUsers(userRole?: string) {
  const ref = collection(db, "quizzes");
  const snap = await getDocs(ref);
  const allQuizzes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  // Filter quizzes based on visibility and user role
  return allQuizzes.filter(quiz => {
    const visibility = quiz.visibility || 'public';
    
    // If user is admin, show all quizzes
    if (userRole === 'admin' || userRole === 'administrator') {
      return true;
    }
    
    // For regular users, only show public quizzes
    return visibility === 'public';
  });
}

export async function getAllUsers() {
  const ref = collection(db, "users");
  const snap = await getDocs(ref);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getAllQuizHistories() {
  // Fetch all users
  const usersSnap = await getDocs(collection(db, "users"));
  const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  let allHistories = [];
  for (const user of users) {
    const quizHistorySnap = await getDocs(collection(db, "users", user.id, "quizHistory"));
    const histories = quizHistorySnap.docs.map(doc => ({
      id: doc.id,
      userId: user.id,
      userName: user.name || user.email || user.id,
      userEmail: user.email || "",
      ...doc.data()
    }));
    allHistories = allHistories.concat(histories);
  }
  return allHistories;
}

export async function getSiteSettings() {
  const ref = doc(db, "siteSettings", "global");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : { maintenanceMode: false, allowRegistrations: true, announcement: "" };
}

export async function setSiteSettings(settings: { maintenanceMode: boolean; allowRegistrations: boolean; announcement: string }) {
  const ref = doc(db, "siteSettings", "global");
  await setDoc(ref, settings, { merge: true });
}

export async function addGlobalNotification({ title, message, type }: { title: string; message: string; type: string }) {
  const ref = collection(db, "notifications");
  await addDoc(ref, {
    title,
    message,
    type,
    date: serverTimestamp(),
  });
}

export async function getGlobalNotifications() {
  const ref = collection(db, "notifications");
  const q = query(ref, orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function saveQuizResult(userId: string, quizResult: {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  answers: Record<number, number>;
  completedAt: Date;
}) {
  try {
    const ref = collection(db, "users", userId, "quizHistory");
    await addDoc(ref, {
      ...quizResult,
      completedAt: serverTimestamp(),
      // Store only essential data to save space
      answers: quizResult.answers, // Only store answer indices, not full questions
      score: Math.round(quizResult.score * 100) / 100, // Round to 2 decimal places
    });
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
}

export async function getUserQuizHistory(userId: string) {
  try {
    const ref = collection(db, "users", userId, "quizHistory");
    const q = query(ref, orderBy("completedAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user quiz history:', error);
    throw error;
  }
}

export async function getQuizResult(userId: string, resultId: string) {
  try {
    const ref = doc(db, "users", userId, "quizHistory", resultId);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    throw error;
  }
}

// Space-efficient function to get quiz statistics
export async function getUserQuizStats(userId: string) {
  try {
    const history = await getUserQuizHistory(userId);
    const stats = {
      totalQuizzes: history.length,
      averageScore: 0,
      totalTime: 0,
      quizzesCompleted: 0,
      bestScore: 0,
      recentQuizzes: history.slice(0, 5) // Only keep last 5 for stats
    };
    
    if (history.length > 0) {
      const scores = history.map(h => h.score || 0);
      const times = history.map(h => h.timeTaken || 0);
      
      stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      stats.totalTime = times.reduce((a, b) => a + b, 0);
      stats.quizzesCompleted = history.length;
      stats.bestScore = Math.max(...scores);
    }
    
    return stats;
  } catch (error) {
    console.error('Error calculating user stats:', error);
    throw error;
  }
}

// Utility function to normalize quiz data structure
export function normalizeQuizData(data: any) {
  if (!data) return null;
  
  // Ensure questions array exists and is properly structured
  const normalizedQuestions = Array.isArray(data.questions) 
    ? data.questions.map((q: any, index: number) => {
        // Handle different answer formats (string vs number)
        let answerIndex = 0;
        if (typeof q?.answer === "number") {
          answerIndex = q.answer;
        } else if (typeof q?.answer === "string") {
          // Convert string answers like "A", "B", "C", "D" to indices
          const answerStr = q.answer.toUpperCase();
          if (answerStr === "A") answerIndex = 0;
          else if (answerStr === "B") answerIndex = 1;
          else if (answerStr === "C") answerIndex = 2;
          else if (answerStr === "D") answerIndex = 3;
          else answerIndex = 0; // fallback
        }
        
        return {
          question: q?.question || q?.text || `Question ${index + 1}`,
          options: Array.isArray(q?.options) ? q.options : ["", "", "", ""],
          answer: answerIndex,
        };
      })
    : [];

  return {
    ...data,
    questions: normalizedQuestions,
    title: data.title || "Untitled Quiz",
    description: data.description || "",
    features: data.features || "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    duration: data.duration || { hours: 0, minutes: 0, seconds: 0 },
  };
} 