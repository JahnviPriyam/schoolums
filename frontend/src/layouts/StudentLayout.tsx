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
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar - lighter tone for students */}
      <motion.aside
        className="flex flex-col border-r border-border z-20 relative"
        style={{ background: "hsl(235 30% 16%)" }}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-border/10">
          <div className="flex-shrink-0 w-9 h-9 rounded-2xl bg-peach/20 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-peach" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className="font-heading font-bold text-lg text-white whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
              >
                SchoolDesk
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200",
                  active
                    ? "sidebar-active text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-30"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
