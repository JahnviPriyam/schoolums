import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value?: string | number | null;
  accent?: "lavender" | "peach" | "mint" | "primary";
}

const accentMap = {
  lavender: "bg-lavender/15 text-accent",
  peach: "bg-peach/20 text-foreground",
  mint: "bg-mint/20 text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
};

export const StatCard = ({ icon: Icon, label, value, accent = "primary" }: StatCardProps) => (
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
        <p className="font-heading text-2xl font-bold text-foreground">
          {value !== undefined && value !== null ? value : "—"}
        </p>
      </div>
      <div className={`rounded-xl p-2.5 ${accentMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);
