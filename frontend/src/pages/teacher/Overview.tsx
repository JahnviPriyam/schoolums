import { useEffect, useState } from "react";
import { Users, ClipboardCheck, FileText, CalendarDays } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageWrapper } from "@/components/PageWrapper";
import AttendanceChart from "@/components/AttendanceChart";

interface DashboardData {
  total_students: number;
  present_today: number;
  absent_today: number;
  attendance_percentage: number;
}

interface Student {
  id: number;
  name: string;
  present: boolean;
}

const TeacherOverview = () => {
  const [dashboard, setDashboard] = useState<DashboardData>({
    total_students: 0,
    present_today: 0,
    absent_today: 0,
    attendance_percentage: 0,
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"present" | "absent" | null>(null);

  // ===== Load Dashboard =====
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          "http://127.0.0.1:9000/attendance/today/stats",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setDashboard(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ===== Load Students =====
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [studentsRes, attendanceRes] = await Promise.all([
          fetch("http://127.0.0.1:9000/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:9000/attendance", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const studentsData = await studentsRes.json();
        const attendanceData = await attendanceRes.json();

        const today = new Date().toISOString().split("T")[0];

        const mapped = studentsData.map((s: any) => {
          const record = attendanceData.find(
            (a: any) =>
              a.student_id === s.id &&
              a.date.startsWith(today)
          );

          return {
            id: s.id,
            name: s.name,
            present: record ? record.status === "present" : false,
          };
        });

        setStudents(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    loadStudents();
  }, []);

  // ===== Risk Logic =====
  const highRisk = students.filter((s) => !s.present);
  const safeStudents = students.filter((s) => s.present);

  // ===== Modal Filter =====
  const filteredStudents =
    type === "present"
      ? students.filter((s) => s.present)
      : students.filter((s) => !s.present);

  return (
    <PageWrapper title="Dashboard" subtitle="Welcome back, Teacher">

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <StatCard
          icon={Users}
          label="Total Students"
          value={loading ? "..." : dashboard.total_students}
          accent="primary"
        />

        <div
          onClick={() => { setType("present"); setOpen(true); }}
          className="cursor-pointer hover:scale-105 transition"
        >
          <StatCard
            icon={ClipboardCheck}
            label="Present Today"
            value={loading ? "..." : dashboard.present_today}
            accent="lavender"
          />
        </div>

        <div
          onClick={() => { setType("absent"); setOpen(true); }}
          className="cursor-pointer hover:scale-105 transition"
        >
          <StatCard
            icon={FileText}
            label="Absent Today"
            value={loading ? "..." : dashboard.absent_today}
            accent="peach"
          />
        </div>

        <StatCard
          icon={CalendarDays}
          label="Attendance %"
          value={loading ? "..." : `${dashboard.attendance_percentage}%`}
          accent="mint"
        />

      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="hover:scale-105 transition">
          <AttendanceChart
            present={dashboard.present_today}
            absent={dashboard.absent_today}
          />
        </div>

        {/* AI Risk */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold mb-4">AI Student Risk</h3>

          {/* High Risk */}
          <div className="mb-4">
            <p className="text-xs text-red-500 font-medium mb-2">High Risk</p>

            {highRisk.length === 0 ? (
              <p className="text-xs text-gray-400">No high risk students 🎉</p>
            ) : (
              highRisk.slice(0, 3).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-semibold">
                    {s.name[0]}
                  </div>
                  <span>{s.name}</span>
                  <span className="ml-auto text-red-500 text-xs">High</span>
                </div>
              ))
            )}
          </div>

          {/* Safe */}
          <div>
            <p className="text-xs text-green-500 font-medium mb-2">Safe</p>

            {safeStudents.slice(0, 3).map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-semibold">
                  {s.name[0]}
                </div>
                <span>{s.name}</span>
                <span className="ml-auto text-green-500 text-xs">OK</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold mb-4">Student Insights</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Present Students</span>
              <span className="text-green-600 font-medium">
                {dashboard.present_today}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Absent Students</span>
              <span className="text-red-600 font-medium">
                {dashboard.absent_today}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Students</span>
              <span className="font-medium">
                {dashboard.total_students}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Attendance %</span>
              <span className="font-medium">
                {dashboard.attendance_percentage}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl p-6 w-[380px] shadow-xl">

            <h2 className="text-lg font-semibold mb-4">
              {type === "present" ? "Present Students" : "Absent Students"}
            </h2>

            {filteredStudents.length === 0 ? (
              <p className="text-gray-400 text-sm">No students found</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredStudents.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                      {s.name[0]}
                    </div>
                    <span>{s.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </PageWrapper>
  );
};

export default TeacherOverview;