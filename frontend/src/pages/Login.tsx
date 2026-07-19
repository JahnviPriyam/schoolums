import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingDoodles } from "@/components/FloatingDoodles";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter email and password",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Login Failed",
          description: data.detail || "Invalid credentials",
        });
        setLoading(false);
        return;
      }

      const token = data.access_token;

      if (!token) {
        toast({
          title: "Error",
          description: "No token received",
        });
        setLoading(false);
        return;
      }

      // Decode JWT safely
      let role = "";
      
      if (data.requires_change) {
        toast({
          title: "Password Change Required",
          description: "Please set a new password to continue.",
        });
        localStorage.setItem("temp_email", email);
        navigate("/change-password");
        setLoading(false);
        return;
      }

      // Save token
      localStorage.setItem("token", token);

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
        localStorage.setItem("role", role);
      } catch (err) {
        toast({
          title: "Error",
          description: "Invalid token format",
        });
        setLoading(false);
        return;
      }

      // Navigate correctly
      if (role === "teacher") {
        navigate("/teacher/overview");
      } else if (role === "student") {
        navigate("/student/overview");
      } else {
        toast({
          title: "Error",
          description: "Unknown user role",
        });
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Backend not reachable",
      });
    }

    setLoading(false);
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
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <LogIn className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* BUTTON */}
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* DEMO ACCESS SECTION */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <h3 className="text-sm font-semibold text-center mb-2">Demo Access</h3>
            <p className="text-xs text-muted-foreground text-center mb-4 leading-relaxed">
              Want to explore the platform? Use one of the demo accounts below. No registration required.
            </p>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-between h-auto py-3 px-4 bg-primary/5 hover:bg-primary/10 border-primary/20"
                onClick={() => {
                  setEmail("student@demo.com");
                  setPassword("student123");
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">Explore as Student</span>
                  <span className="text-xs text-muted-foreground">student@demo.com / student123</span>
                </div>
                <LogIn className="h-4 w-4 opacity-50" />
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-between h-auto py-3 px-4 bg-primary/5 hover:bg-primary/10 border-primary/20"
                onClick={() => {
                  setEmail("teacher@demo.com");
                  setPassword("teacher123");
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm">Explore as Teacher</span>
                  <span className="text-xs text-muted-foreground">teacher@demo.com / teacher123</span>
                </div>
                <LogIn className="h-4 w-4 opacity-50" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;