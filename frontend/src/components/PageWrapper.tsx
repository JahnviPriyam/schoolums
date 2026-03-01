import { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageWrapperProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const PageWrapper = ({ title, subtitle, children, actions }: PageWrapperProps) => (
  <motion.div
    className="page-enter p-6 md:p-8 flex-1 overflow-auto notebook-bg"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
    {children}
  </motion.div>
);
