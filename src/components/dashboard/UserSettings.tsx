
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell } from "lucide-react";

const preferencesFormSchema = z.object({
  darkMode: z.boolean().default(false),
  emailNotifications: z.boolean().default(true),
  quizReminders: z.boolean().default(true),
  soundEffects: z.boolean().default(true),
  autoSaveProgress: z.boolean().default(true),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

export function UserSettings() {
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Default values for the preferences form
  const preferencesDefaultValues: PreferencesFormValues = {
    darkMode: false,
    emailNotifications: true,
    quizReminders: true,
    soundEffects: true,
    autoSaveProgress: true,
  };

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: preferencesDefaultValues,
  });

  function onSubmitPreferences(data: PreferencesFormValues) {
    setIsSavingPreferences(true);
    // Simulate API call
    setTimeout(() => {
      setIsSavingPreferences(false);
      toast.success("Your preferences have been saved!");
    }, 1000);
    console.log("Preferences data:", data);
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setIsDeleting(true);
    try {
      // Delete Firestore user doc
      await deleteDoc(doc(db, "users", user.uid));
      // Delete Auth user
      await deleteUser(user);
      toast.success("Your account has been deleted.");
      await signOut();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  return (
    <Card className="shadow-xl border-2 border-primary/10 bg-white/90 dark:bg-gray-900/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary text-2xl">
          <Settings className="h-6 w-6" /> App Settings
        </CardTitle>
        <CardDescription className="text-base">Manage your application settings and notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-10">
          {/* Appearance Section */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Sun className="h-5 w-5 text-yellow-500" /> Appearance
            </h3>
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
                <div className="space-y-4">
                  
                  <FormField
                    control={preferencesForm.control}
                    name="darkMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Dark Mode
                          </FormLabel>
                          <FormDescription>
                            Enable dark mode for the application.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Sun className="h-5 w-5 text-muted-foreground" />
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Moon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
              </form>
            </Form>
          </div>
          <Separator />
          {/* Notifications Section */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Bell className="h-5 w-5 text-blue-500" /> Notifications
            </h3>
            <Form {...preferencesForm}>
              <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
                <div className="space-y-4">
                  
                  <FormField
                    control={preferencesForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive updates and newsletters via email.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={preferencesForm.control}
                    name="quizReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Quiz Reminders
                          </FormLabel>
                          <FormDescription>
                            Get reminders for upcoming quizzes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={preferencesForm.control}
                    name="soundEffects"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Sound Effects
                          </FormLabel>
                          <FormDescription>
                            Enable sound effects during quizzes.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={preferencesForm.control}
                    name="autoSaveProgress"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Auto-save Progress
                          </FormLabel>
                          <FormDescription>
                            Automatically save quiz progress.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
              </form>
            </Form>
          </div>
          <Separator />
          {/* Account Section */}
          <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-6 mt-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Account
            </h3>
            <p className="text-sm text-muted-foreground mb-4">Permanently delete your Examify account and all associated data. This action cannot be undone.</p>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </Button>
          </div>
        </div>
        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h4 className="text-lg font-bold mb-2 text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" /> Confirm Account Deletion
              </h4>
              <p className="mb-4 text-sm">Are you sure you want to permanently delete your account? This cannot be undone.</p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
