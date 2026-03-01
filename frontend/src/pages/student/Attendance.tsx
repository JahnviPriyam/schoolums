import { ClipboardCheck } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface AttendanceData {
  totalClasses: number;
  attended: number;
  percentage: number;
}

const StudentAttendance = () => {
  const [data] = useState<AttendanceData | null>(null); // API: fetch attendance

  return (
    <PageWrapper title="Attendance" subtitle="Your attendance record">
      {!data ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No attendance data"
          description="Your attendance information will be displayed here once available."
        />
      ) : (
        <div className="max-w-lg">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-semibold text-foreground">Overall Attendance</h3>
              <span className="text-2xl font-heading font-bold text-primary">
                {data.percentage}%
              </span>
            </div>
            <Progress value={data.percentage} className="h-3 rounded-full" />
            <div className="flex justify-between mt-3 text-sm text-muted-foreground">
              <span>Attended: {data.attended}</span>
              <span>Total: {data.totalClasses}</span>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default StudentAttendance;
