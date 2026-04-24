import { useEffect, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentAttendance {
  id: number;
  name: string;
  present: boolean;
}

export default function TeacherAttendance() {
  const { toast } = useToast();

  const [date, setDate] = useState("");
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Fetch students only
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch students");

        const data = await res.json();

        setStudents(
          data.map((s: any) => ({
            id: s.id,
            name: s.name,
            present: false,
          }))
        );
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load students",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const toggleStatus = (id: number, value: boolean) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, present: value } : s
      )
    );
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token || !date) {
      toast({
        title: "Select Date",
        description: "Please select a date first.",
      });
      return;
    }

    setSaving(true);

    try {
      await Promise.all(
        students.map((s) =>
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:9000"}/attendance`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              student_id: s.id,
              date, // ✅ already correct format YYYY-MM-DD
              status: s.present ? "present" : "absent",
            }),
          })
        )
      );

      toast({
        title: "Success",
        description: "Attendance saved",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save attendance",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper
      title="Attendance"
      subtitle="Mark daily attendance"
      actions={
        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-6 font-semibold shadow-md"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </Button>
      }
    >
      {/* Date Picker */}
      <div className="mb-6 max-w-xs">
        <Label>Select Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2"
        />
      </div>

      {/* Content */}
      {loading ? (
        <p>Loading...</p>
      ) : students.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No students"
          description="Add students first"
        />
      ) : (
        <div className="stat-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Student</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="flex items-center gap-3 pl-6">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {s.name.charAt(0)}
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex rounded-full border overflow-hidden">
                        <button
                          onClick={() => toggleStatus(s.id, true)}
                          className={`px-4 py-1 text-sm font-medium ${
                            s.present
                              ? "bg-green-500 text-white"
                              : "bg-white text-muted-foreground"
                          }`}
                        >
                          Present
                        </button>

                        <button
                          onClick={() => toggleStatus(s.id, false)}
                          className={`px-4 py-1 text-sm font-medium ${
                            !s.present
                              ? "bg-red-500 text-white"
                              : "bg-white text-muted-foreground"
                          }`}
                        >
                          Absent
                        </button>
                      </div>

                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          s.present
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.present ? "Present" : "Absent"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageWrapper>
  );
}