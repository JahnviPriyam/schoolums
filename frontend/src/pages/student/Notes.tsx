import { useState } from "react";
import { Plus, Trash2, StickyNote } from "lucide-react";
import { PageWrapper } from "@/components/PageWrapper";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

const StudentNotes = () => {
  const [notes] = useState<Note[]>([]); // API: fetch notes
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    // API integration: POST new note
    setForm({ title: "", content: "" });
    setOpen(false);
  };

  const handleDelete = async (id: string) => {
    // API integration: DELETE note
  };

  return (
    <PageWrapper
      title="Notes"
      subtitle="Your personal study notes"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="btn-lift font-heading font-semibold gap-2">
              <Plus className="h-4 w-4" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="glass sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-heading">New Note</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Note title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your note here..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full btn-lift font-heading font-semibold">
                Save Note
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      {notes.length === 0 ? (
        <EmptyState
          icon={StickyNote}
          title="No notes yet"
          description="Create your first note to start organizing your study materials."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              className="stat-card group"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-heading font-semibold text-foreground">{note.title}</h4>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive h-7 w-7"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
              <p className="text-xs text-muted-foreground/60 mt-3">{note.createdAt}</p>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default StudentNotes;
