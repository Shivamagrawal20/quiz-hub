
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Bell, Check, MessageSquare, Trophy, Calendar, BookOpen, Info, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { addGlobalNotification, getGlobalNotifications } from "@/lib/quizFirestore";

const Notifications = () => {
  const { toast } = useToast();
  const { isLoggedIn, role } = useAuth();
  const isAdmin = isLoggedIn && (role === "admin" || role === "administrator");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Admin notification form state
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newType, setNewType] = useState("update");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setLoading(true);
    getGlobalNotifications()
      .then(setNotifications)
      .catch(() => setError("Failed to load notifications."))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await addGlobalNotification({ title: newTitle, message: newMessage, type: newType });
      toast({ title: "Notification sent!", description: "All users will see this notification." });
      setNewTitle("");
      setNewMessage("");
      setNewType("update");
      // Refresh notifications
      setLoading(true);
      const updated = await getGlobalNotifications();
      setNotifications(updated);
    } catch {
      toast({ title: "Failed to send notification", variant: "destructive" });
    } finally {
      setCreating(false);
      setLoading(false);
    }
  };
  
  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quiz":
        return <Bell className="h-5 w-5 text-blue-500" />;
      case "comment":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "achievement":
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case "challenge":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "update":
        return <BookOpen className="h-5 w-5 text-primary" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const markAllAsRead = () => {
    toast({
      title: "All notifications marked as read",
    });
  };
  
  const saveNotificationSettings = () => {
    toast({
      title: "Notification settings saved",
      description: "Your preferences have been updated.",
    });
  };

  // Timeline color by type
  const getTimelineColor = (type: string) => {
    switch (type) {
      case "quiz": return "bg-blue-500";
      case "comment": return "bg-green-500";
      case "achievement": return "bg-yellow-500";
      case "challenge": return "bg-purple-500";
      case "update": return "bg-primary";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar showInDashboard={true} />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-2 sm:px-4 max-w-3xl">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2 sm:px-0">
              <div>
                <h1 className="text-2xl xs:text-3xl font-bold mb-2 flex items-center gap-2">
                  <Bell className="h-7 w-7 text-primary" /> Notifications
                </h1>
                <p className="text-muted-foreground">Stay updated with your quiz results and platform updates</p>
              </div>
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </div>

          {/* Admin notification creation form */}
          {isAdmin && (
            <Card className="mb-10 border-2 border-primary/30 bg-primary/5 shadow-lg">
              <form onSubmit={handleCreateNotification} className="flex flex-col gap-4 p-4 sm:p-6">
                <h2 className="text-lg xs:text-xl font-bold mb-2 flex items-center gap-2 text-primary">
                  <Megaphone className="h-5 w-5" /> Send Notification to All Users
                </h2>
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Title</label>
                  <input className="input input-bordered rounded-md border border-primary/30 px-3 py-2" value={newTitle} onChange={e => setNewTitle(e.target.value)} required maxLength={100} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Message</label>
                  <textarea className="input input-bordered rounded-md border border-primary/30 px-3 py-2" value={newMessage} onChange={e => setNewMessage(e.target.value)} required maxLength={500} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-medium">Type</label>
                  <select className="input input-bordered rounded-md border border-primary/30 px-3 py-2" value={newType} onChange={e => setNewType(e.target.value)}>
                    <option value="update">Update</option>
                    <option value="quiz">Quiz</option>
                    <option value="achievement">Achievement</option>
                    <option value="challenge">Challenge</option>
                    <option value="comment">Comment</option>
                  </select>
                </div>
                <Button type="submit" disabled={creating || !newTitle || !newMessage} variant="primary" className="w-fit px-6">
                  {creating ? "Sending..." : "Send Notification"}
                </Button>
              </form>
            </Card>
          )}

          {/* Notifications timeline */}
          <Card className="mb-8 p-0 shadow-xl">
            <CardHeader className="px-4 sm:px-6 pt-6 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" /> All Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-6">
              {loading ? (
                <div className="py-16 flex flex-col items-center text-muted-foreground">
                  <Bell className="h-12 w-12 mb-2 animate-bounce text-primary/40" />
                  <span className="text-lg font-medium">Loading notifications...</span>
                </div>
              ) : error ? (
                <div className="py-16 flex flex-col items-center text-destructive">
                  <Info className="h-10 w-10 mb-2" />
                  <span className="text-lg font-medium">{error}</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-16 flex flex-col items-center text-muted-foreground">
                  <Bell className="h-12 w-12 mb-2 text-primary/30" />
                  <span className="text-lg font-medium">No notifications yet.</span>
                </div>
              ) : (
                <div className="relative pl-6">
                  {/* Vertical timeline line */}
                  <div className="absolute left-2 top-0 bottom-0 w-1 bg-primary/10 rounded-full" />
                  <ul className="space-y-6">
                    {notifications.map((notification, idx) => (
                      <li key={notification.id} className="relative group">
                        {/* Timeline dot */}
                        <span className={`absolute -left-3 top-4 w-5 h-5 rounded-full border-4 border-white dark:border-gray-900 shadow ${getTimelineColor(notification.type)}`}></span>
                        <Card className="ml-4 transition-all duration-200 group-hover:shadow-2xl group-hover:-translate-y-1 border-0 bg-white/90 dark:bg-gray-900/90">
                          <CardContent className="p-5 flex items-start gap-4">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold text-primary mb-1">{notification.title}</h3>
                                {/* Optionally, show a badge for new/unread */}
                                {/* <Badge className="bg-green-100 text-green-700">New</Badge> */}
                              </div>
                              <p className="text-muted-foreground mb-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.date && notification.date.toDate ? notification.date.toDate().toLocaleString() : "-"}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
