import { useState } from "react";
import { FileText } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExamResult {
  id: string;
  subject: string;
  date: string;
  maxMarks: number;
  obtained?: number;
}

const StudentExams = () => {
  const [results] = useState<ExamResult[]>([]); // API: fetch exam results

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
                  <TableCell>{r.maxMarks}</TableCell>
                  <TableCell>
                    {r.obtained !== undefined ? (
                      <span className="font-heading font-semibold">{r.obtained}</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Pending</span>
                    )}
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
