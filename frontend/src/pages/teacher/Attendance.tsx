import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StudentAttendance {
  id: string;
  name: string;
  present: boolean;
}

const TeacherAttendance = () => {
  const [date, setDate] = useState("");
  const [students] = useState<StudentAttendance[]>([]); // API: fetch students for attendance

  const handleSubmit = async () => {
    // API integration: POST attendance data
  };

  return (
    <PageWrapper
      title="Attendance"
      subtitle="Mark daily attendance"
      actions={
        students.length > 0 ? (
          <Button onClick={handleSubmit} className="btn-lift font-heading font-semibold">
            Save Attendance
          </Button>
        ) : null
      }
    >
      <div className="mb-6 max-w-xs">
        <Label className="text-sm font-medium">Select Date</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1.5"
        />
      </div>

      {students.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No students to mark"
          description="Add students first to start marking attendance."
        />
      ) : (
        <div className="stat-card p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="w-24 text-center">Present</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={s.present} />
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

export default TeacherAttendance;
