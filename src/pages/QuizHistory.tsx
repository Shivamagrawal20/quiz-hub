
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoon from "@/components/ComingSoon";
import { useAuth } from "@/contexts/AuthContext";
import { getAllQuizHistories } from "@/lib/quizFirestore";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";

const QuizHistory = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { isLoggedIn, role } = useAuth();
  const isAdmin = isLoggedIn && (role === "admin" || role === "administrator");
  const [quizHistoryList, setQuizHistoryList] = useState<any[]>([]);
  const [loadingQuizHistory, setLoadingQuizHistory] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    setLoadingQuizHistory(true);
    getAllQuizHistories()
      .then((histories) => setQuizHistoryList(histories))
      .catch(() => setQuizHistoryList([]))
      .finally(() => setLoadingQuizHistory(false));
  }, [isAdmin]);

  const features = [
    "Complete history of all quizzes you've taken",
    "Detailed analysis of your performance over time",
    "Visual charts showing progress by subject",
    "Review incorrect answers with explanations",
    "Compare your results with class averages"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard />
      <main className="flex-grow pt-20">
        <div className="container px-4 py-6">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <History className="h-7 w-7 text-primary" /> Quiz History
          </h1>
          {isAdmin ? (
            <Card className="rounded-xl shadow-md p-0 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">User</th>
                    <th className="px-4 py-2 text-left font-semibold">Email</th>
                    <th className="px-4 py-2 text-left font-semibold">Quiz</th>
                    <th className="px-4 py-2 text-left font-semibold">Score</th>
                    <th className="px-4 py-2 text-left font-semibold">Total</th>
                    <th className="px-4 py-2 text-left font-semibold">%</th>
                    <th className="px-4 py-2 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingQuizHistory ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">Loading quiz history...</td>
                    </tr>
                  ) : quizHistoryList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 text-center text-muted-foreground">No quiz attempts found.</td>
                    </tr>
                  ) : (
                    quizHistoryList.map((attempt, idx) => (
                      <tr key={attempt.id + attempt.userId} className={
                        `border-b last:border-0 hover:bg-primary/5 transition-colors ${idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/40' : 'bg-white dark:bg-gray-900'}`
                      }>
                        <td className="px-4 py-2 font-medium max-w-xs truncate">{attempt.userName}</td>
                        <td className="px-4 py-2 text-xs text-gray-500 font-mono max-w-xs truncate">{attempt.userEmail}</td>
                        <td className="px-4 py-2 font-medium">{attempt.title || "—"}</td>
                        <td className="px-4 py-2">{attempt.score}</td>
                        <td className="px-4 py-2">{attempt.totalQuestions}</td>
                        <td className="px-4 py-2">{attempt.percentage ? Math.round(attempt.percentage) : "—"}</td>
                        <td className="px-4 py-2">{attempt.date && attempt.date.toDate ? attempt.date.toDate().toLocaleDateString() : "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Card>
          ) : (
            <ComingSoon 
              title="Quiz History"
              subtitle="Track your performance and progress"
              features={features}
              buttonText="Coming Soon"
              bgColor="from-amber-500 to-amber-600"
              textColor="text-amber-500"
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default QuizHistory;
