import { useEffect, useState } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
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

const API_GateWay = "http://localhost:9000";
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimetableEntry {
  id: string;
  class_name: string;
  day: string;
  subject: string;
  start_time: string;
  end_time: string;
}

const TeacherTimetable = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ class_name: "", day: "", subject: "", start_time: "", end_time: "" });

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await fetch(`${API_GateWay}/timetable`, { headers: getAuthHeaders() });
      if (res.ok) setEntries(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_GateWay}/timetable/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        toast({ title: "Slot removed!" });
        fetchTimetable();
      } else {
        const d = await res.json();
        toast({ variant: "destructive", title: "Error", description: d.detail });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_GateWay}/timetable`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast({ title: "Class scheduled!" });
        setForm({ class_name: "", day: "", subject: "", start_time: "", end_time: "" });
        setOpen(false);
        fetchTimetable();
      } else {
        const d = await res.json();
        toast({ variant: "destructive", title: "Error", description: d.detail });
      }
    } catch (e) { console.error(e); }
  };

  return (
    <PageWrapper
      title="Timetable"
      subtitle="Manage your class schedule"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-lift font-heading font-semibold gap-2">
              <Plus className="h-4 w-4" />
              Schedule Class
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">Add Timetable Slot</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
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
                <Label>Subject</Label>
                <Input
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                  required
                />
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full btn-lift font-heading font-semibold">
                Add Slot
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
          description="Schedule your first class to build your weekly timetable."
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
                        <div className="flex gap-2 items-center">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{entry.class_name}</span>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }} className="text-destructive hover:bg-destructive/10 p-1 rounded-md transition-colors cursor-pointer relative z-10" title="Delete Slot">
                            <Trash2 className="w-4 h-4 pointer-events-none" />
                          </button>
                        </div>
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

export default TeacherTimetable;
