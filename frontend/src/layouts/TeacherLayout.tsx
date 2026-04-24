import SchoolDoodles from "@/components/SchoolDoodles";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FileText,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import TeacherChatbot from "@/components/TeacherChatbot";

const navKeys = [
  { key: "overview", path: "/teacher/overview", icon: LayoutDashboard },
  { key: "students", path: "/teacher/students", icon: Users },
  { key: "attendance", path: "/teacher/attendance", icon: ClipboardCheck },
  { key: "exams", path: "/teacher/exams", icon: FileText },
  { key: "timetable", path: "/teacher/timetable", icon: CalendarDays },
  { key: "settings", path: "/teacher/settings", icon: Settings },
];

const DOODLE_AVATARS = [
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Annie&backgroundColor=c0aede",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Scooter&backgroundColor=ffd5dc",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Max&backgroundColor=ffdfbf",
  "https://api.dicebear.com/9.x/avataaars/svg?seed=Ginger&backgroundColor=d1d4f9",
];

const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const payload = JSON.parse(atob(token.split(".")[1]));
  const userEmail = payload.email;
  const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/auth/users/by-email?email=${userEmail}`);
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
};

const TeacherLayout = () => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const avatarUrl = profile?.avatar_id 
    ? DOODLE_AVATARS[profile.avatar_id - 1] 
    : DOODLE_AVATARS[0];

  return (
    <>
      {/* 🌈 DOODLES BACKGROUND */}
      <SchoolDoodles />

      <div className="relative z-10 flex min-h-screen w-full bg-transparent">

        {/* ================= SIDEBAR ================= */}
        <motion.aside
          className="flex flex-col bg-sidebar/90 backdrop-blur-xl text-sidebar-foreground border-r border-sidebar-border shadow-xl z-20"
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-sidebar-border">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center shadow">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="font-bold text-lg whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  SchoolDesk
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* NAV */}
          <nav className="flex-1 py-4 px-3 space-y-2">
            {navKeys.map((item) => {
              const active = location.pathname.includes(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-purple-400 to-blue-400 text-white shadow-lg"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-purple-400 to-blue-400 transition" />

                  <item.icon className="h-5 w-5 flex-shrink-0 z-10" />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="whitespace-nowrap z-10"
                      >
                        {t(`nav.${item.key}`)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="p-3 border-t border-sidebar-border space-y-2">
            {!collapsed && (
              <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-sidebar-accent/30 rounded-xl border border-sidebar-border/50">
                <img src={avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full border bg-white shadow-sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.email || "Teacher"}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-sidebar-foreground/70 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>{t("nav.sign_out")}</span>}
            </button>
          </div>

          {/* TOGGLE BUTTON */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-24 w-7 h-7 rounded-full bg-white shadow-md border flex items-center justify-center hover:scale-110 transition"
          >
            {collapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </button>
        </motion.aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        
        {/* ================= CHATBOT ================= */}
        <TeacherChatbot />

      </div>
    </>
  );
};

export default TeacherLayout;