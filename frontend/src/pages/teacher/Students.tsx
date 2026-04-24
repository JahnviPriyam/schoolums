import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, Users as UsersIcon } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Student {
  id: number;
  user_id: number;
  name: string;
  email: string;
  class_name: string;
}

const TeacherStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    grade: "",
    password: "",
  });

  const [marksOpen, setMarksOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentMarks, setStudentMarks] = useState<any[]>([]);

  const handleViewMarks = async (student: Student) => {
    setSelectedStudent(student);
    setMarksOpen(true);
    setStudentMarks([]); // reset
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:9000/marks/student/${student.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setStudentMarks(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ================= FETCH =================
  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("http://127.0.0.1:9000/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Fetch error:", data);
        return;
      }

      setStudents(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ================= ADD =================
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      console.log("Sending:", form);

      const res = await fetch("http://127.0.0.1:9000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          class_name: form.grade,
          password: form.password,
        }),
      });

      const data = await res.json();
      console.log("ADD RESPONSE:", data);

      if (!res.ok) {
        alert(data.detail || "Failed to add student");
        return;
      }

      setStudents((prev) => [...prev, data]);

      setForm({
        name: "",
        email: "",
        grade: "",
        password: "",
      });

      setOpen(false);
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`http://127.0.0.1:9000/students/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <PageWrapper
      title="Students"
      subtitle="Manage your class roster"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-lift font-heading font-semibold gap-2">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </DialogTrigger>

          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAdd} className="space-y-4 mt-2">

              <div>
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Grade / Class</Label>
                <Input
                  value={form.grade}
                  onChange={(e) =>
                    setForm({ ...form, grade: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label>Temporary Password</Label>
                <Input
                  type="text"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="e.g. 123456"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Add Student
              </Button>

            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {students.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No students yet"
          description="Add your first student"
        />
      ) : (
        <div className="stat-card p-0 overflow-hidden">

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.class_name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewMarks(s)}
                          title="View Marks"
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(s.id)}
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>

        </div>
      )}

      {/* Marks Dialog */}
      <Dialog open={marksOpen} onOpenChange={setMarksOpen}>
        <DialogContent className="glass sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">Marks for {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Marks Obtained</TableHead>
                  <TableHead>Total Marks</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentMarks.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.date}</TableCell>
                    <TableCell>{m.subject}</TableCell>
                    <TableCell className="font-medium text-primary">{m.marks_obtained}</TableCell>
                    <TableCell>{m.total_marks}</TableCell>
                    <TableCell>{Math.round((m.marks_obtained / m.total_marks) * 100)}%</TableCell>
                  </TableRow>
                ))}
                {studentMarks.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No marks recorded yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default TeacherStudents;