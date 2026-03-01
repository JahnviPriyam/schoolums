import { ClipboardCheck, FileText, CalendarDays, BookOpen } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PageWrapper } from "@/components/PageWrapper";

const StudentOverview = () => {
  // API integration: fetch student overview data
  return (
    <PageWrapper title="My Dashboard" subtitle="Welcome back, Student">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard icon={ClipboardCheck} label="Attendance %" accent="lavender" />
        <StatCard icon={FileText} label="Upcoming Exams" accent="peach" />
        <StatCard icon={CalendarDays} label="Today's Classes" accent="mint" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-heading font-semibold text-foreground mb-4">Recent Results</h3>
          <p className="text-sm text-muted-foreground">No results to display yet.</p>
        </div>

        <div className="stat-card">
          <h3 className="font-heading font-semibold text-foreground mb-4">Today's Schedule</h3>
          <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default StudentOverview;
