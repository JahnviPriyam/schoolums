import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, LogOut } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingDoodles } from "@/components/FloatingDoodles";
import { useToast } from "@/components/ui/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({ title: "Error", description: "All fields are required" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "New passwords do not match" });
      return;
    }

    const email = localStorage.getItem("temp_email");
    if (!email) {
      toast({ title: "Error", description: "Session expired. Please log in again." });
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:9000/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ variant: "destructive", title: "Failed", description: data.detail || "Incorrect old password" });
        setLoading(false);
        return;
      }

      toast({
        title: "Success",
        description: "Password changed successfully! Please log in again.",
      });

      // Clear the temporary enforced session state
      localStorage.removeItem("temp_email");
      localStorage.removeItem("token");
      navigate("/");

    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Server Error", description: "Backend not reachable" });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{ background: "var(--gradient-primary)", opacity: 0.07 }}
      />
      <div className="absolute inset-0 notebook-bg z-0" />

      <FloatingDoodles />

      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="glass rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-100 mb-4">
              <Lock className="h-7 w-7 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold">Action Required</h1>
            <p className="text-muted-foreground text-sm mt-2">
              To keep your account secure, you must change your temporary or expired password to continue.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">
            <div>
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
            
            <Button type="button" variant="outline" className="w-full h-11 mt-2 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
