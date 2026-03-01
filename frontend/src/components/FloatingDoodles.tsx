import { Pen, Send, BookOpen, PenTool, Ruler, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const doodles = [
  { Icon: Pen, x: "10%", y: "15%", size: 20, delay: 0, className: "animate-float text-lavender/30" },
  { Icon: Send, x: "85%", y: "20%", size: 18, delay: 1, className: "animate-float-slow text-peach/30" },
  { Icon: BookOpen, x: "75%", y: "75%", size: 22, delay: 0.5, className: "animate-float-delayed text-mint/40" },
  { Icon: PenTool, x: "15%", y: "80%", size: 16, delay: 2, className: "animate-float text-lavender/25" },
  { Icon: Ruler, x: "90%", y: "50%", size: 20, delay: 1.5, className: "animate-float-slow text-peach/25" },
  { Icon: Lightbulb, x: "5%", y: "50%", size: 18, delay: 0.8, className: "animate-float-delayed text-mint/30" },
];

export const FloatingDoodles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {doodles.map((d, i) => (
      <motion.div
        key={i}
        className={`absolute ${d.className}`}
        style={{ left: d.x, top: d.y }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d.delay, duration: 1 }}
      >
        <d.Icon size={d.size} />
      </motion.div>
    ))}
  </div>
);
