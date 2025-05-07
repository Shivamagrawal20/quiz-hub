
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Bell, Check, MessageSquare, Trophy, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Notifications = () => {
  const { toast } = useToast();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  
  // Sample notifications
  const notifications = [
    {
      id: "1",
      title: "Quiz Results Available",
      message: "Your results for 'Environmental Engineering Basics' are now available.",
      time: "2 hours ago",
      read: false,
      type: "quiz"
    },
    {
      id: "2",
      title: "New Quiz Added",
      message: "A new quiz 'Advanced Data Structures' has been added to Computer Science.",
      time: "1 day ago",
      read: true,
      type: "update"
    },
    {
      id: "3",
      title: "Comment on Your Note",
      message: "John Smith commented on your 'Biology 101' notes.",
      time: "2 days ago",
      read: true,
      type: "comment"
    },
    {
      id: "4",
      title: "Achievement Unlocked",
      message: "Congratulations! You've earned the 'Science Expert' badge.",
      time: "3 days ago",
      read: true,
      type: "achievement"
    },
    {
      id: "5",
      title: "Weekly Quiz Challenge",
      message: "New weekly challenge available: 'Physics Masters'. Complete to earn bonus points!",
      time: "4 days ago",
      read: true,
      type: "challenge"
    }
  ];
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showInDashboard={true} />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <Link to="/userhub" className="inline-flex items-center text-primary hover:underline mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hub
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                <p className="text-muted-foreground">Stay updated with your quiz results and platform updates</p>
              </div>
              
              <Button variant="outline" onClick={markAllAsRead}>
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All
                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/20">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge className="ml-2 bg-primary/20 text-primary hover:bg-primary/20">
                  {notifications.filter(n => !n.read).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {notifications.map(notification => (
                <Card 
                  key={notification.id}
                  className={`transition-colors ${!notification.read ? 'border-l-4 border-primary' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-base ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <Badge className="bg-primary/20 text-primary hover:bg-primary/20">New</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="unread" className="space-y-4">
              {notifications.filter(n => !n.read).length > 0 ? (
                notifications
                  .filter(n => !n.read)
                  .map(notification => (
                    <Card 
                      key={notification.id}
                      className="border-l-4 border-primary"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-base font-semibold">{notification.title}</h3>
                            <p className="text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                          <Badge className="bg-primary/20 text-primary hover:bg-primary/20">New</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-1">No unread notifications</h3>
                    <p className="text-muted-foreground">You're all caught up!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive quiz results and important updates via email
                        </p>
                      </div>
                      <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium">Push Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive instant notifications on your device
                        </p>
                      </div>
                      <Switch checked={pushEnabled} onCheckedChange={setPushEnabled} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Notification Types</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="quiz-results" defaultChecked />
                        <Label htmlFor="quiz-results">Quiz Results</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="new-quizzes" defaultChecked />
                        <Label htmlFor="new-quizzes">New Quizzes</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="comments" defaultChecked />
                        <Label htmlFor="comments">Comments on Notes</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="achievements" defaultChecked />
                        <Label htmlFor="achievements">Achievements</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="challenges" defaultChecked />
                        <Label htmlFor="challenges">Weekly Challenges</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={saveNotificationSettings}>Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Notifications;
