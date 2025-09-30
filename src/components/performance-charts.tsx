"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

interface PerformanceChartsProps {
  className?: string;
  gradeData?: { week: string; grade: number }[];
  attendanceData?: { month: string; present: number; total: number }[];
}

const demoGradeData = [
  { week: "W1", grade: 72 },
  { week: "W2", grade: 75 },
  { week: "W3", grade: 78 },
  { week: "W4", grade: 80 },
  { week: "W5", grade: 82 },
  { week: "W6", grade: 84 },
  { week: "W7", grade: 86 },
  { week: "W8", grade: 88 },
];

const demoAttendanceData = [
  { month: "Jan", present: 18, total: 20 },
  { month: "Feb", present: 17, total: 19 },
  { month: "Mar", present: 19, total: 22 },
  { month: "Apr", present: 20, total: 21 },
  { month: "May", present: 21, total: 22 },
  { month: "Jun", present: 19, total: 20 },
];

const chartConfig = {
  grade: {
    label: "Average Grade",
    color: "hsl(220 70% 50%)",
  },
  present: {
    label: "Present",
    color: "hsl(140 70% 45%)",
  },
} as const;

export default function PerformanceCharts({ className = "", gradeData, attendanceData }: PerformanceChartsProps) {
  const grades = gradeData && gradeData.length > 0 ? gradeData : demoGradeData;
  const attendance = attendanceData && attendanceData.length > 0 ? attendanceData : demoAttendanceData;
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <Card className="huly-card">
        <CardHeader>
          <CardTitle className="text-foreground">Academic Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <LineChart data={grades} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} domain={[60, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="grade" stroke="var(--color-grade)" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="huly-card">
        <CardHeader>
          <CardTitle className="text-foreground">Attendance by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64">
            <BarChart data={attendance} margin={{ left: 12, right: 12 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="present" fill="var(--color-present)" radius={6} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
