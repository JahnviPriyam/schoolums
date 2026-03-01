import { useEffect, useState } from "react";
import { Users, ClipboardCheck, FileText, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageWrapper } from "@/components/PageWrapper";

interface DashboardData {
  total_students: number;
  total_classes: number;
  attendance_today: number;
  total_exams: number;
}

const TeacherOverview = () => {
  const [dashboard, setDashboard] = useState<DashboardData>({
    total_students: 0,
    total_classes: 0,
    attendance_today: 0,
    total_exams: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://127.0.0.1:9000/students",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Dashboard fetch failed:", response.status);
          setLoading(false);
          return;
        }

        const students = await response.json();

        setDashboard({
          total_students: Array.isArray(students) ? students.length : 0,
          total_classes: 0,
          attendance_today: 0,
          total_exams: 0,
        });

      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <PageWrapper title="Dashboard" subtitle="Welcome back, Teacher">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={loading ? "..." : dashboard.total_students}
          accent="primary"
        />

        <StatCard
          icon={ClipboardCheck}
          label="Attendance Today"
          value={loading ? "..." : dashboard.attendance_today}
          accent="lavender"
        />

        <StatCard
          icon={FileText}
          label="Total Exams"
          value={loading ? "..." : dashboard.total_exams}
          accent="peach"
        />

        <StatCard
          icon={CalendarDays}
          label="Total Classes"
          value={loading ? "..." : dashboard.total_classes}
          accent="mint"
        />
      </div>
    </PageWrapper>
  );
};

export default TeacherOverview;