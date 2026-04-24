import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#22c55e", "#ef4444"];

interface Props {
  present: number;
  absent: number;
}

export default function AttendanceChart({ present, absent }: Props) {
  const total = present + absent;

  const data = [
    { name: "Present", value: present },
    { name: "Absent", value: absent },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl"
    >
      <h2 className="text-sm font-semibold mb-4">
        Attendance Overview
      </h2>

      <div className="relative h-56 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute text-center">
          <p className="text-lg font-bold">{total}</p>
          <p className="text-xs text-gray-500">Students</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          Present
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          Absent
        </div>
      </div>
    </motion.div>
  );
}