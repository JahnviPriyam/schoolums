import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { getAuthHeaders } from "@/api";

const API_GateWay = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:9000"}`;
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimetableEntry {
  id: string;
  class_name: string;
  day: string;
  subject: string;
  start_time: string;
  end_time: string;
}

const StudentTimetable = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Get student profile to know the class_name
      const profileRes = await fetch(`${API_GateWay}/students`, { headers: getAuthHeaders() });
      if (!profileRes.ok) return;
      const profiles = await profileRes.json();
      if (profiles.length === 0) return;
      
      const className = profiles[0].class_name;

      // 2. Fetch timetable for that class
      const ttRes = await fetch(`${API_GateWay}/timetable?class=${encodeURIComponent(className)}`, { 
        headers: getAuthHeaders() 
      });
      if (ttRes.ok) {
        setEntries(await ttRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <PageWrapper title="Timetable" subtitle="Your weekly class schedule">
      {entries.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No schedule available"
          description="Your timetable will appear here once it's been set up by your teacher."
        />
      ) : (
        <div className="space-y-6">
          {days.map(day => {
            const dayEntries = entries.filter(e => e.day === day).sort((a,b) => a.start_time.localeCompare(b.start_time));
            if (dayEntries.length === 0) return null;
            return (
              <div key={day} className="stat-card p-4">
                <h3 className="font-heading font-semibold text-lg mb-4">{day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dayEntries.map(entry => (
                    <div key={entry.id} className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{entry.subject}</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{entry.class_name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.start_time} - {entry.end_time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageWrapper>
  );
};

export default StudentTimetable;
