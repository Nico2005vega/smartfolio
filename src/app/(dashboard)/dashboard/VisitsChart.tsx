"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; count: number }[];
}

function formatShortDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

export default function VisitsChart({ data }: Props) {
  const chartData = data.map(d => ({ ...d, label: formatShortDate(d.date) }));

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            interval={Math.ceil(chartData.length / 8)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} allowDecimals={false} axisLine={false} tickLine={false} width={28} />
          <Tooltip
            contentStyle={{ fontSize: "12px", borderRadius: "10px", border: "1px solid #f0f0f0" }}
            labelStyle={{ fontWeight: 600 }}
            formatter={(value: number) => [`${value} visitas`, ""]}
          />
          <Area type="monotone" dataKey="count" stroke="#7c3aed" strokeWidth={2} fill="url(#visitsGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}