import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { getQuiz, createQuiz, updateQuiz, saveQuestions } from "@/lib/quizFirestore";
import { useToast } from "@/hooks/use-toast";

const TAG_OPTIONS = ["Science", "Maths", "Ethics", "NPTEL", "Technology", "General", "Other"];

const AdminQuizEditPage = () => {
  const { quizId: quizIdParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const quizMetaFromLocation = location.state || {};
  const quizId = quizMetaFromLocation.quizId || quizIdParam || "";
  const [quizTitle, setQuizTitle] = useState(quizMetaFromLocation.quizTitle || "");
  const [quizDescription, setQuizDescription] = useState(quizMetaFromLocation.quizDescription || "");
  const [quizFeatures, setQuizFeatures] = useState(quizMetaFromLocation.quizFeatures || "");
  const [quizTags, setQuizTags] = useState<string[]>(quizMetaFromLocation.quizTags || []);

  // Quiz meta state
  const [quizMeta, setQuizMeta] = useState({
    id: quizId,
    title: quizMetaFromLocation.title || "",
    description: quizMetaFromLocation.description || "",
    features: quizMetaFromLocation.features || "",
    tags: quizMetaFromLocation.tags || [],
    duration: quizMetaFromLocation.duration || { hours: 0, minutes: 0, seconds: 0 },
  });
  const [editMetaOpen, setEditMetaOpen] = useState(false);
  const [editMeta, setEditMeta] = useState(quizMeta);

  // Questions state
  const [questions, setQuestions] = useState<any[]>([]);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load quiz meta and questions from Firestore on mount
  useEffect(() => {
    async function fetchQuiz() {
      if (!quizId) return;
      setLoading(true);
      try {
        const data = await getQuiz(quizId);
        if (data) {
          setQuizMeta({
            id: quizId,
            title: data.title || "",
            description: data.description || "",
            features: data.features || "",
            tags: data.tags || [],
            duration: data.duration || { hours: 0, minutes: 0, seconds: 0 },
          });
          // Defensive normalization for questions array
          setQuestions(
            Array.isArray(data.questions)
              ? data.questions.map(q => ({
                  question: q?.question || "",
                  options: Array.isArray(q?.options) ? q.options : ["", "", "", ""],
                  answer: typeof q?.answer === "number" ? q.answer : 0,
                }))
              : []
          );
        }
      } catch (err) {
        toast({ title: "Error loading quiz", description: String(err), variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
    // eslint-disable-next-line
  }, [quizId]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: 0 }]);
  };
  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };
  const handleQuestionChange = (idx: number, value: string) => {
    setQuestions(questions.map((q, i) => i === idx ? { ...q, question: value } : q));
  };
  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    setQuestions(questions.map((q, i) =>
      i === qIdx ? { ...q, options: q.options.map((opt, j) => j === oIdx ? value : opt) } : q
    ));
  };
  const handleAnswerChange = (qIdx: number, value: number) => {
    setQuestions(questions.map((q, i) => i === qIdx ? { ...q, answer: value } : q));
  };

  // Save meta to Firestore
  const handleSaveMeta = async () => {
    setLoading(true);
    try {
      if (quizId) {
        await updateQuiz(quizId, {
          title: editMeta.title,
          description: editMeta.description,
          features: editMeta.features,
          tags: editMeta.tags,
          duration: editMeta.duration, // <-- save duration as object
        });
        setQuizMeta(editMeta);
        setEditMetaOpen(false);
        toast({ title: "Quiz details updated!" });
        // Redirect to admin dashboard after saving meta
        navigate("/admin-dashboard");
      }
    } catch (err) {
      toast({ title: "Error updating quiz", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Save questions to Firestore
  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (quizId) {
        await saveQuestions(quizId, questions);
        toast({ title: "Quiz questions saved!" });
      }
    } catch (err) {
      toast({ title: "Error saving questions", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSave = async () => {
    setLoading(true);
    try {
      if (quizId) {
        await updateQuiz(quizId, {
          title: editMeta.title,
          description: editMeta.description,
          features: editMeta.features,
          tags: editMeta.tags,
          duration: editMeta.duration,
        });
        setQuizMeta(editMeta);
        setEditMetaOpen(false);
        setShowConfirmDialog(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/admin-dashboard");
        }, 3000);
      }
    } catch (err) {
      toast({ title: "Error updating quiz", description: String(err), variant: "destructive" });
      setShowConfirmDialog(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
      <Navbar showInDashboard />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-2 sm:px-4 mt-8 mb-8">
          {/* Quiz Meta Section */}
          <Card className="mb-8 p-8 flex flex-col gap-4 relative shadow-lg border-2 border-primary/30 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold mb-2 text-primary tracking-tight">{quizMeta.title || "Untitled Quiz"}</h1>
                <div className="text-lg text-gray-700 dark:text-gray-200 mb-2 font-medium">{quizMeta.description}</div>
                <div className="text-base text-gray-500 dark:text-gray-400 mb-2">Features: <span className="font-semibold">{quizMeta.features}</span></div>
                <div className="text-base text-gray-500 dark:text-gray-400 mb-2">Duration: <span className="font-semibold">{quizMeta.duration && (quizMeta.duration.hours || quizMeta.duration.minutes || quizMeta.duration.seconds) ? `${quizMeta.duration.hours}h ${quizMeta.duration.minutes}m ${quizMeta.duration.seconds}s` : "Unlimited"}</span></div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {quizMeta.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold uppercase tracking-wide shadow-sm">{tag}</span>
                  ))}
                </div>
                <div className="text-xs text-gray-400">Quiz ID: <span className="font-mono">{quizMeta.id}</span></div>
              </div>
              <Button size="sm" variant="outline" onClick={() => { setEditMeta(quizMeta); setEditMetaOpen(true); }}>
                Edit
              </Button>
            </div>
          </Card>

          {/* Edit Meta Modal */}
          <Dialog open={editMetaOpen} onOpenChange={setEditMetaOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Quiz Details</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <Input
                  label="Quiz Title"
                  placeholder="Enter quiz title"
                  value={editMeta.title}
                  onChange={e => setEditMeta({ ...editMeta, title: e.target.value })}
                />
                <Textarea
                  label="Description"
                  placeholder="Enter quiz description"
                  value={editMeta.description}
                  onChange={e => setEditMeta({ ...editMeta, description: e.target.value })}
                />
                <Textarea
                  label="Features"
                  placeholder="Enter quiz features"
                  value={editMeta.features}
                  onChange={e => setEditMeta({ ...editMeta, features: e.target.value })}
                />
                <Input
                  label="Quiz ID"
                  value={editMeta.id}
                  onChange={e => setEditMeta({ ...editMeta, id: e.target.value })}
                  disabled
                />
                {/* Timer input: hours, minutes, seconds */}
                <div className="flex gap-2 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Hours</label>
                    <Input
                      type="number"
                      min={0}
                      value={editMeta.duration?.hours ?? 0}
                      onChange={e => setEditMeta({
                        ...editMeta,
                        duration: {
                          ...editMeta.duration,
                          hours: Math.max(0, Number(e.target.value)),
                          minutes: editMeta.duration?.minutes ?? 0,
                          seconds: editMeta.duration?.seconds ?? 0,
                        },
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Minutes</label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={editMeta.duration?.minutes ?? 0}
                      onChange={e => setEditMeta({
                        ...editMeta,
                        duration: {
                          ...editMeta.duration,
                          hours: editMeta.duration?.hours ?? 0,
                          minutes: Math.max(0, Math.min(59, Number(e.target.value))),
                          seconds: editMeta.duration?.seconds ?? 0,
                        },
                      })}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-medium mb-1">Seconds</label>
                    <Input
                      type="number"
                      min={0}
                      max={59}
                      value={editMeta.duration?.seconds ?? 0}
                      onChange={e => setEditMeta({
                        ...editMeta,
                        duration: {
                          ...editMeta.duration,
                          hours: editMeta.duration?.hours ?? 0,
                          minutes: editMeta.duration?.minutes ?? 0,
                          seconds: Math.max(0, Math.min(59, Number(e.target.value))),
                        },
                      })}
                    />
                  </div>
                  <span className="text-xs text-gray-500 ml-2 mb-1">(Leave all zero for untimed)</span>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map(tag => (
                      <Button
                        key={tag}
                        size="sm"
                        variant={editMeta.tags.includes(tag) ? "default" : "outline"}
                        onClick={() => {
                          setEditMeta({
                            ...editMeta,
                            tags: editMeta.tags.includes(tag)
                              ? editMeta.tags.filter((t: string) => t !== tag)
                              : [...editMeta.tags, tag],
                          });
                        }}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleSaveMeta}
                  disabled={loading}
                >
                  Save Quiz
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Questions Section */}
          <Card className="mb-8 p-8 flex flex-col gap-4 relative shadow-lg border-2 border-primary/30 bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-primary">Questions</h2>
              <Button size="sm" variant="outline" onClick={handleAddQuestion}>
                Add Question
              </Button>
            </div>
            {Array.isArray(questions) && questions.length > 0 ? (
              questions.map((q, idx) => (
                <div key={idx} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Q{idx + 1}</span>
                    <Button size="xs" variant="destructive" onClick={() => handleRemoveQuestion(idx)}>
                      Remove
                    </Button>
                  </div>
                  <Input
                    label="Question"
                    placeholder="Enter question text"
                    value={q.question || ""}
                    onChange={e => handleQuestionChange(idx, e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Array.isArray(q.options) ? q.options.map((opt, oIdx) => (
                      <Input
                        key={oIdx}
                        label={`Option ${oIdx + 1}`}
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt || ""}
                        onChange={e => handleOptionChange(idx, oIdx, e.target.value)}
                      />
                    )) : null}
                  </div>
                  <div className="mt-2">
                    <label className="text-xs font-medium mb-1 block">Correct Answer</label>
                    <select
                      className="w-full border rounded p-2"
                      value={q.answer}
                      onChange={e => handleAnswerChange(idx, Number(e.target.value))}
                    >
                      {Array.isArray(q.options) && q.options.map((_, oIdx) => (
                        <option key={oIdx} value={oIdx}>{`Option ${oIdx + 1}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 dark:text-gray-400">No questions found for this quiz.</div>
            )}
          </Card>

          <form onSubmit={handleSaveQuiz} className="space-y-8">
            <div className="flex gap-4 mt-8">
              <Button type="submit" disabled={loading}>Save Questions</Button>
              {/* Optionally, add a note for the admin */}
              <span className="text-xs text-gray-500 self-center">(Save questions frequently to avoid losing progress)</span>
            </div>
          </form>
          {/* Centered Save Quiz Button in green box */}
          <div className="flex justify-center mt-8">
            <div className="bg-green-100 border border-green-400 rounded-lg px-8 py-6 flex flex-col items-center shadow-md animate-fade-in">
              <Button
                onClick={() => setShowConfirmDialog(true)}
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 text-lg rounded-lg shadow-lg transition-all duration-300"
                style={{ minWidth: 180 }}
              >
                Save Quiz
              </Button>
              <span className="text-green-700 mt-2 text-sm">Click to save all quiz details and return to dashboard</span>
            </div>
          </div>

          {/* Confirmation Dialog */}
          <ConfirmDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <ConfirmDialogContent className="sm:max-w-[400px]">
              <ConfirmDialogHeader>
                <ConfirmDialogTitle>Confirm Save</ConfirmDialogTitle>
              </ConfirmDialogHeader>
              <div className="py-4 text-center text-lg">Are you sure you want to save this quiz and return to the Admin Dashboard?</div>
              <ConfirmDialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={loading}>Cancel</Button>
                <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleFinalSave} disabled={loading}>Save &amp; Go</Button>
              </ConfirmDialogFooter>
            </ConfirmDialogContent>
          </ConfirmDialog>

          {/* Success Animation/Dialog */}
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in">
              <div className="bg-white rounded-lg shadow-2xl px-12 py-10 flex flex-col items-center animate-bounce-in">
                <CheckCircle className="text-green-500 w-16 h-16 mb-4 animate-pulse" />
                <div className="text-2xl font-bold text-green-700 mb-2">Quiz Saved!</div>
                <div className="text-green-600 text-lg">Redirecting to Admin Dashboard...</div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminQuizEditPage; 