import { motion } from "framer-motion";

const doodles = [
  { emoji: "📚", top: "10%", left: "5%" },
  { emoji: "✏️", top: "30%", left: "90%" },
  { emoji: "📄", top: "70%", left: "10%" },
  { emoji: "📏", top: "80%", left: "80%" },
  { emoji: "🧠", top: "50%", left: "50%" },
];

export default function SchoolDoodles() {
return (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

    {doodles.map((d, i) => (
      <motion.div
        key={i}
        initial={{ y: 0 }}
        animate={{ y: [0, -30, 0] }}
        transition={{
          duration: 4 + i,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute text-6xl opacity-40"
        style={{ top: d.top, left: d.left }}
      >
        {d.emoji}
      </motion.div>
    ))}

  </div>
);
}