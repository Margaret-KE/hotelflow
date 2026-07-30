import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "Occupied",
    value: 41,
    color: "#16a34a",
  },
  {
    name: "Available",
    value: 7,
    color: "#3b82f6",
  },
  {
    name: "Reserved",
    value: 4,
    color: "#f59e0b",
  },
  {
    name: "Cleaning",
    value: 3,
    color: "#8b5cf6",
  },
  {
    name: "Maintenance",
    value: 2,
    color: "#ef4444",
  },
];

export default function OccupancyChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold text-slate-800">
        Room Occupancy
      </h2>

      <div className="h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}