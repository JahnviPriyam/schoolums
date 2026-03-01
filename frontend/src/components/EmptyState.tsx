import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <motion.div
    className="empty-state"
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="mb-4 rounded-2xl bg-muted p-5">
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </motion.div>
);
