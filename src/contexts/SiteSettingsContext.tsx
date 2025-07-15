import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSiteSettings } from "@/lib/quizFirestore";

interface SiteSettings {
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  announcement: string;
}

interface SiteSettingsContextType extends SiteSettings {
  loading: boolean;
  refetch: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({
    maintenanceMode: false,
    allowRegistrations: true,
    announcement: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      setSettings({
        maintenanceMode: !!data.maintenanceMode,
        allowRegistrations: data.allowRegistrations !== false,
        announcement: data.announcement || "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ ...settings, loading, refetch: fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within SiteSettingsProvider");
  return ctx;
} 