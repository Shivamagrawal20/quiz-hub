
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Settings</CardTitle>
        <CardDescription>Manage your application settings and notifications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...preferencesForm}>
          <form onSubmit={preferencesForm.handleSubmit(onSubmitPreferences)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Appearance</h3>
              
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
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notifications</h3>
              
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
            
            <Button type="submit" className="w-full" disabled={isSavingPreferences}>
              {isSavingPreferences ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
