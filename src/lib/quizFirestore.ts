import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";

export async function getQuiz(quizId: string) {
  const ref = doc(db, "quizzes", quizId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function createQuiz(quizId: string, meta: any) {
  const ref = doc(db, "quizzes", quizId);
  await setDoc(ref, meta);
}

export async function updateQuiz(quizId: string, meta: any) {
  const ref = doc(db, "quizzes", quizId);
  await updateDoc(ref, meta);
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