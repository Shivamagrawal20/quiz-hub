import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { getSiteSettings, setSiteSettings } from "@/lib/quizFirestore";
import { toast } from "sonner";

const SiteSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const settings = await getSiteSettings();
        setMaintenanceMode(!!settings.maintenanceMode);
        setAllowRegistrations(settings.allowRegistrations !== false);
        setAnnouncement(settings.announcement || "");
      } catch (err) {
        toast.error("Failed to load site settings");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setSiteSettings({ maintenanceMode, allowRegistrations, announcement });
      toast.success("Settings saved");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary/10 to-secondary/5 dark:from-gray-900 dark:to-gray-950">
      <Navbar showInDashboard />
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-2 sm:px-4 mt-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Site Settings</h1>
          </div>
          <Card className="p-6 shadow-lg rounded-xl bg-white dark:bg-gray-900 max-w-xl mx-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading settings...</div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Maintenance Mode</span>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Allow New Registrations</span>
                  <Switch checked={allowRegistrations} onCheckedChange={setAllowRegistrations} />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Site Announcement</span>
                  <Input
                    value={announcement}
                    onChange={e => setAnnouncement(e.target.value)}
                    placeholder="Enter announcement text..."
                    className="w-full"
                  />
                </div>
                <Button onClick={handleSave} disabled={saving} className="mt-4 w-full">
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SiteSettings; 