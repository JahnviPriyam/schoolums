import { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { getAuthHeaders } from "@/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const API_GateWay = "http://localhost:9000";

interface ExamResult {
  id: string;      // mark id
  exam_id: string; // exam id
  subject: string;
  class_name: string;
  date: string;
  total_marks: number;
  marks_obtained: number;
  teacher_id: string;
}

const StudentExams = () => {
  const [results, setResults] = useState<ExamResult[]>([]);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await fetch(`${API_GateWay}/marks/student`, { headers: getAuthHeaders() });
      if (res.ok) {
        setResults(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper title="Exams & Results" subtitle="Your exam marks and upcoming assessments">
      {results.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No exams yet"
          description="Your exam schedule and results will appear here."
        />
      ) : (
        <div className="stat-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Obtained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell>{r.total_marks}</TableCell>
                  <TableCell>
                    <span className="font-heading font-semibold text-primary">{r.marks_obtained}</span>
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

export default StudentExams;
