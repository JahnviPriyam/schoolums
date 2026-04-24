import SchoolDoodles from "@/components/SchoolDoodles";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  ClipboardCheck,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", path: "/student", icon: LayoutDashboard },
  { label: "Timetable", path: "/student/timetable", icon: CalendarDays },
  { label: "Exams", path: "/student/exams", icon: FileText },
  { label: "Attendance", path: "/student/attendance", icon: ClipboardCheck },
  { label: "Notes", path: "/student/notes", icon: StickyNote },
];

const StudentLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* 🌈 DOODLES BACKGROUND */}
      <SchoolDoodles />

      <div className="relative z-10 flex min-h-screen w-full bg-transparent">

        {/* ================= SIDEBAR ================= */}
        <motion.aside
          className="flex flex-col bg-[#1f2235]/90 backdrop-blur-xl text-white border-r border-white/10 shadow-xl z-20"
          animate={{ width: collapsed ? 72 : 260 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {/* LOGO */}
          <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center shadow">
              <BookOpen className="h-5 w-5 text-white" />
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="font-bold text-lg whitespace-nowrap"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  StudentDesk
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* NAV */}
          <nav className="flex-1 py-4 px-3 space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                    active
                      ? "bg-gradient-to-r from-pink-400 to-orange-400 text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {/* Glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-r from-pink-400 to-orange-400 transition" />

                  <item.icon className="h-5 w-5 z-10" />

                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="whitespace-nowrap z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </nav>

          {/* FOOTER */}
          <div className="px-3 py-4 border-t border-white/10">
            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:bg-red-100 hover:text-red-500 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* TOGGLE */}
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

      </div>
    </>
  );
};

export default StudentLayout;