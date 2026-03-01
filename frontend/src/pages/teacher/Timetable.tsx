import { CalendarDays } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"];

interface TimetableEntry {
  id: string;
  day: string;
  period: string;
  subject: string;
  room: string;
}

const TeacherTimetable = () => {
  const [entries] = useState<TimetableEntry[]>([]); // API: fetch timetable
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ day: "", period: "", subject: "", room: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // API integration: POST timetable entry
    setForm({ day: "", period: "", subject: "", room: "" });
    setOpen(false);
  };

  const getEntry = (day: string, period: string) =>
    entries.find((e) => e.day === day && e.period === period);

  return (
    <PageWrapper
      title="Timetable"
      subtitle="Manage weekly class schedule"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-lift font-heading font-semibold gap-2">
              <Plus className="h-4 w-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">Add Timetable Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Day</Label>
                <select
                  value={form.day}
                  onChange={(e) => setForm({ ...form, day: e.target.value })}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="">Select day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Period</Label>
                <select
                  value={form.period}
                  onChange={(e) => setForm({ ...form, period: e.target.value })}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm"
                  required
                >
                  <option value="">Select period</option>
                  {periods.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
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
                <Label>Room</Label>
                <Input
                  value={form.room}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                  placeholder="e.g. Room 204"
                />
              </div>
              <Button type="submit" className="w-full btn-lift font-heading font-semibold">
                Add Entry
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {entries.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Timetable is empty"
          description="Add class entries to build your weekly schedule."
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
                          <div className="rounded-lg bg-primary/5 p-2">
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

export default TeacherTimetable;
