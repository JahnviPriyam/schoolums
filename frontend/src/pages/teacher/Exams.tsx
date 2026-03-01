import { useState } from "react";
import { Plus, FileText } from "lucide-react";
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

interface Exam {
  id: string;
  subject: string;
  date: string;
  maxMarks: number;
}

const TeacherExams = () => {
  const [exams] = useState<Exam[]>([]); // API: fetch exams
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", date: "", maxMarks: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // API integration: POST new exam
    setForm({ subject: "", date: "", maxMarks: "" });
    setOpen(false);
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
                <Label>Date</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Max Marks</Label>
                <Input
                  type="number"
                  value={form.maxMarks}
                  onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
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
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{exam.date}</TableCell>
                  <TableCell>{exam.maxMarks}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="font-heading text-xs">
                      Enter Marks
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

export default TeacherExams;
