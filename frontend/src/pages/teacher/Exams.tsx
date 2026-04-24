import { useState, useEffect } from "react";
import { Plus, FileText, Check, Trash2 } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthHeaders } from "@/api";
import { useToast } from "@/hooks/use-toast";

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

const API_GateWay = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:9000"}`;

interface Exam {
  id: string;
  subject: string;
  class_name: string;
  date: string;
  total_marks: number;
}
interface Student {
  id: number;
  user_id: string;
  name: string;
  class_name: string;
}

const TeacherExams = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", class_name: "", date: "", total_marks: "" });
  
  // Enter marks modal state
  const [marksOpen, setMarksOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [marksMap, setMarksMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchExams();
    fetchStudents();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await fetch(`${API_GateWay}/exams`, { headers: getAuthHeaders() });
      if (res.ok) setExams(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_GateWay}/students`, { headers: getAuthHeaders() });
      if (res.ok) {
        setStudents(await res.json());
      }
    } catch (e) { console.error(e); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, total_marks: parseInt(form.total_marks) };
      const res = await fetch(`${API_GateWay}/exams`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast({ title: "Exam Created" });
        setForm({ subject: "", class_name: "", date: "", total_marks: "" });
        setOpen(false);
        fetchExams();
      } else {
        const d = await res.json();
        toast({ variant: "destructive", title: "Failed", description: d.detail });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteExam = async (id: string) => {
    try {
      const res = await fetch(`${API_GateWay}/exams/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        toast({ title: "Exam deleted" });
        fetchExams();
      } else {
        const d = await res.json();
        toast({ variant: "destructive", title: "Error", description: d.detail });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openMarksDialog = async (exam: Exam) => {
    setSelectedExam(exam);
    setMarksMap({}); // reset
    setMarksOpen(true);
    
    // Fetch existing marks
    try {
      const res = await fetch(`${API_GateWay}/marks/exam/${exam.id}`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        const newMap: Record<string, string> = {};
        data.forEach((mark: any) => {
          newMap[String(mark.student_id)] = String(mark.marks_obtained);
        });
        setMarksMap(newMap);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMarks = async (studentId: string | number) => {
    if (!selectedExam) return;
    const strId = String(studentId);
    const m = marksMap[strId];
    if (m === undefined || m === "") return;
    
    const parsedMark = parseInt(m);
    if (isNaN(parsedMark)) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Please enter a valid number." });
      return;
    }

    try {
      const payload = {
        student_id: strId,
        exam_id: selectedExam.id,
        marks_obtained: parsedMark
      };
      const res = await fetch(`${API_GateWay}/marks`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        toast({ title: "Marks saved for student" });
      } else {
        const d = await res.json();
        toast({ variant: "destructive", title: "Error", description: d.detail });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper
      title="Exams"
      subtitle="Manage exams and enter marks"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-lift font-heading font-semibold gap-2">
              <Plus className="h-4 w-4" />
              Add Exam
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">Create Exam</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Class Name</Label>
                <Input
                  value={form.class_name}
                  onChange={(e) => setForm({ ...form, class_name: e.target.value })}
                  placeholder="e.g. 10-A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Total Marks</Label>
                <Input
                  type="number"
                  value={form.total_marks}
                  onChange={(e) => setForm({ ...form, total_marks: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-lift font-heading font-semibold">
                Create Exam
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {exams.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No exams created"
          description="Create your first exam to start managing assessments."
        />
      ) : (
        <div className="stat-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Marks</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.class_name}</TableCell>
                  <TableCell className="font-medium">{exam.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{exam.date}</TableCell>
                  <TableCell>{exam.total_marks}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="font-heading text-xs" onClick={() => openMarksDialog(exam)}>
                        Enter Marks
                      </Button>
                      <button onClick={() => handleDeleteExam(exam.id)} className="text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors" title="Delete Exam">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
            <DialogTitle className="font-heading">Enter Marks for {selectedExam?.subject} ({selectedExam?.class_name})</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Marks (out of {selectedExam?.total_marks})</TableHead>
                  <TableHead className="w-24">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.filter(s => s.class_name === selectedExam?.class_name).map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        placeholder="Marks" 
                        value={marksMap[s.user_id] || ""}
                        onChange={(e) => setMarksMap({ ...marksMap, [s.user_id]: e.target.value })}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="outline" onClick={() => handleSaveMarks(s.user_id)}>
                        <Check className="w-4 h-4 text-green-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {students.filter(s => s.class_name === selectedExam?.class_name).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                      No students found in this class.
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

export default TeacherExams;
