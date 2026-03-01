import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"];

interface TimetableEntry {
  id: string;
  day: string;
  period: string;
  subject: string;
  room: string;
}

const StudentTimetable = () => {
  const [entries] = useState<TimetableEntry[]>([]); // API: fetch timetable

  const getEntry = (day: string, period: string) =>
    entries.find((e) => e.day === day && e.period === period);

  return (
    <PageWrapper title="Timetable" subtitle="Your weekly class schedule">
      {entries.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No schedule available"
          description="Your timetable will appear here once it's been set up."
        />
      ) : (
        <div className="stat-card p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left font-heading font-semibold text-muted-foreground">
                  Day / Period
                </th>
                {periods.map((p) => (
                  <th key={p} className="p-3 text-center font-heading font-semibold text-muted-foreground text-xs">
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day} className="border-b border-border/50">
                  <td className="p-3 font-medium text-foreground">{day}</td>
                  {periods.map((period) => {
                    const entry = getEntry(day, period);
                    return (
                      <td key={period} className="p-2 text-center">
                        {entry ? (
                          <div className="rounded-xl bg-lavender/10 p-2">
                            <p className="font-medium text-xs text-foreground">{entry.subject}</p>
                            {entry.room && (
                              <p className="text-xs text-muted-foreground">{entry.room}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/40">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
};

export default StudentTimetable;
