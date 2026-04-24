import SchoolDoodles from "@/components/SchoolDoodles";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";

import TeacherLayout from "./layouts/TeacherLayout";
import StudentLayout from "./layouts/StudentLayout";

import TeacherOverview from "./pages/teacher/Overview";
import TeacherStudents from "./pages/teacher/Students";
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherExams from "./pages/teacher/Exams";
import TeacherTimetable from "./pages/teacher/Timetable";
import TeacherSettings from "./pages/teacher/Settings";

import StudentOverview from "./pages/student/Overview";
import StudentTimetable from "./pages/student/Timetable";
import StudentExams from "./pages/student/Exams";
import StudentAttendance from "./pages/student/Attendance";
import StudentNotes from "./pages/student/Notes";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

<BrowserRouter>

  {/* 👇 ADD THIS */}
  <SchoolDoodles />

  {/* 👇 Wrap everything */}
  <div className="relative z-10">
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* ================= TEACHER ================= */}
      <Route path="/teacher" element={<TeacherLayout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<TeacherOverview />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="exams" element={<TeacherExams />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="settings" element={<TeacherSettings />} />
      </Route>

      {/* ================= STUDENT ================= */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="overview" />} />
        <Route path="overview" element={<StudentOverview />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="notes" element={<StudentNotes />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>

</BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;