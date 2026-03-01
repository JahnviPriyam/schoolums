import { useState, useEffect } from "react";
import { Plus, Trash2, Users as UsersIcon } from "lucide-react";
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
  name: string;
  email: string;
  class_name: string;
}

const TeacherStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", grade: "" });

  // 🔹 FETCH STUDENTS
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://127.0.0.1:9000/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://127.0.0.1:9000/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: 0,
          name: form.name,
          email: form.email,
          class_name: form.grade,
        }),
      });

      if (!response.ok) return;

      const newStudent = await response.json();
      setStudents((prev) => [...prev, newStudent]);

      setForm({ name: "", email: "", grade: "" });
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

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
    } catch (error) {
      console.error(error);
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
              <DialogTitle className="font-heading">
                Add New Student
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Enter student name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="student@school.edu"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Grade / Class</Label>
                <Input
                  value={form.grade}
                  onChange={(e) =>
                    setForm({ ...form, grade: e.target.value })
                  }
                  placeholder="e.g. 10-A"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full btn-lift font-heading font-semibold"
              >
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
          description="Add your first student to get started with class management."
        />
      ) : (
        <div className="stat-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.email}
                  </TableCell>
                  <TableCell>{s.class_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(s.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </PageWrapper>
  );
};

export default TeacherStudents;