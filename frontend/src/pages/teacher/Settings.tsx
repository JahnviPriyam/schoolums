import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Lock, Check } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// 5 hardcoded aesthetic doodle avatars
const DOODLE_AVATARS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Annie&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Scooter&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Ginger&backgroundColor=d1d4f9",
];

const TeacherSettings = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [selectedAvatarId, setSelectedAvatarId] = useState(1);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const queryClient = useQueryClient();

  // Load User Data via React Query
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userEmail = payload.email || "teacher@school.com";
      const userRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/auth/users/by-email?email=${userEmail}`);
      if (!userRes.ok) throw new Error("Failed to fetch profile");
      const userData = await userRes.json();
      
      // Update local state when query fetches successfully
      setEmail(userData.email);
      setSelectedAvatarId(userData.avatar_id || 1);
      if (userData.preferred_language && userData.preferred_language !== selectedLanguage) {
        setSelectedLanguage(userData.preferred_language);
        i18n.changeLanguage(userData.preferred_language);
        localStorage.setItem("language", userData.preferred_language);
      }
      return userData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/auth/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || "teacher@school.com",
          avatar_id: selectedAvatarId,
          preferred_language: selectedLanguage,
        }),
      });

      if (res.ok) {
        i18n.changeLanguage(selectedLanguage);
        localStorage.setItem("language", selectedLanguage);
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast({ title: t("settings.save_changes"), description: "Profile saved successfully." });
      } else {
        toast({ variant: "destructive", title: "Error", description: "Failed to update profile." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Server error." });
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;

    setSavingPassword(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || "teacher@school.com",
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: "Success", description: "Password updated successfully!" });
        setOldPassword("");
        setNewPassword("");
      } else {
        toast({ variant: "destructive", title: "Error", description: data.detail || "Failed to update." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Server error." });
    }
    setSavingPassword(false);
  };

  return (
    <PageWrapper
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        
        {/* Profile Card */}
        <div className="stat-card flex flex-col space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Camera className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              {t("settings.profile_card")}
            </h2>
          </div>

          <div>
            <Label className="mb-3 block text-muted-foreground">{t("settings.avatar")}</Label>
            <div className="flex flex-wrap gap-4">
              {DOODLE_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAvatarId(idx + 1)}
                  className={`relative w-16 h-16 rounded-2xl overflow-hidden transition-all duration-300 border-4 hover:scale-105 ${
                    selectedAvatarId === idx + 1 ? "border-primary shadow-glow" : "border-transparent bg-secondary/50"
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                  {selectedAvatarId === idx + 1 && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-muted-foreground">{t("settings.language")}</Label>
            <p className="text-sm text-foreground/70 mb-3">{t("settings.language_desc")}</p>
            <div className="flex gap-3">
              <Button
                variant={selectedLanguage === "en" ? "default" : "outline"}
                className={selectedLanguage === "en" ? "bg-primary text-primary-foreground" : ""}
                onClick={() => {
                  setSelectedLanguage("en");
                  i18n.changeLanguage("en");
                  localStorage.setItem("language", "en");
                }}
              >
                English
              </Button>
              <Button
                variant={selectedLanguage === "hi" ? "default" : "outline"}
                className={selectedLanguage === "hi" ? "bg-primary text-primary-foreground" : ""}
                onClick={() => {
                  setSelectedLanguage("hi");
                  i18n.changeLanguage("hi");
                  localStorage.setItem("language", "hi");
                }}
              >
                हिन्दी (Hindi)
              </Button>
            </div>
          </div>

          <Button 
            className="w-full mt-4 btn-lift" 
            onClick={handleSaveProfile}
            disabled={savingProfile}
          >
            {savingProfile ? "..." : t("settings.save_changes")}
          </Button>
        </div>

        {/* Security Card */}
        <div className="stat-card flex flex-col space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-foreground">
              {t("settings.security_card")}
            </h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 flex-1">
            <div>
              <Label>{t("settings.current_password")}</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>{t("settings.new_password")}</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full btn-lift" disabled={savingPassword}>
                {savingPassword ? "..." : t("settings.update_password")}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </PageWrapper>
  );
};

export default TeacherSettings;
