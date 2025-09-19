'use client';

import { useState, useMemo, useTransition } from 'react';
import type { Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Loader2 } from 'lucide-react';
import { generateWeeklyReportAction } from '@/app/actions';
import { WeeklyReportInput } from '@/ai/flows/weekly-attendance-report';

interface AttendanceAnalyticsClientProps {
  students: Student[];
}

export default function AttendanceAnalyticsClient({ students }: AttendanceAnalyticsClientProps) {
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const attendanceData = useMemo(() => {
    const dateMap = new Map<string, { Present: number; Absent: number; Late: number }>();
    students.forEach(student => {
      student.attendance.forEach(record => {
        if (!dateMap.has(record.date)) {
          dateMap.set(record.date, { Present: 0, Absent: 0, Late: 0 });
        }
        const counts = dateMap.get(record.date)!;
        if (record.status === 'Present' || record.status === 'Excused') {
          counts.Present++;
        } else if (record.status === 'Absent') {
          counts.Absent++;
        } else if (record.status === 'Late') {
          counts.Late++;
        }
      });
    });

    const sortedDates = Array.from(dateMap.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const latestDates = sortedDates.slice(-5); // Get the last 5 days

    return latestDates.map(date => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...dateMap.get(date)!,
    }));
  }, [students]);

  const chartConfig = {
    Present: { label: 'Present', color: 'hsl(var(--chart-2))' },
    Absent: { label: 'Absent', color: 'hsl(var(--chart-5))' },
    Late: { label: 'Late', color: 'hsl(var(--chart-4))' },
  };

  const handleGenerateReport = () => {
    setError(null);
    setReport(null);

    startTransition(async () => {
      const allRecords = students.flatMap(s => s.attendance.map(a => ({ studentName: s.name, ...a })));
      const input: WeeklyReportInput = { attendanceRecords: allRecords };
      const result = await generateWeeklyReportAction(input);

      if (result.success) {
        setReport(result.report || null);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-full bg-card/50 dark:bg-white/5 border dark:border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle>Daily Attendance Overview (Last 5 Days)</CardTitle>
          <CardDescription>A summary of class attendance trends.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Present" fill="var(--color-Present)" radius={4} />
                <Bar dataKey="Absent" fill="var(--color-Absent)" radius={4} />
                <Bar dataKey="Late" fill="var(--color-Late)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="w-full bg-card/50 dark:bg-white/5 border dark:border-white/10 backdrop-blur-lg">
        <CardHeader>
          <CardTitle>AI Weekly Report</CardTitle>
          <CardDescription>Generate an AI-powered summary of the week&apos;s attendance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateReport} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Generating Report...' : 'Generate Weekly Report'}
          </Button>
          
          {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {(isPending || report) && (
            <div className="pt-4">
                <h3 className="font-semibold mb-2">Weekly Attendance Analysis</h3>
                <div className="p-4 border rounded-md bg-background/50 dark:bg-black/20 min-h-[120px]">
                    {isPending ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <p className="text-sm text-foreground whitespace-pre-wrap">{report}</p>
                    )}
                </div>
            </div>
          )}

        </CardContent>
         <CardFooter>
          <Alert className="bg-transparent border-border/50 dark:border-white/10">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Powered by AI</AlertTitle>
              <AlertDescription>
                This report is generated by an AI model. Always cross-reference with detailed records for critical decisions.
              </AlertDescription>
          </Alert>
      </CardFooter>
      </Card>
    </div>
  );
}
