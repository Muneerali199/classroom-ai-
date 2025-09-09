'use client';

import { useState } from 'react';
import type { Student } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceTable from '@/components/attendance-table';
import AttendanceSummaryGenerator from '@/components/attendance-summary-generator';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from './ui/skeleton';

interface DashboardClientProps {
  initialStudents: Student[];
}

export default function DashboardClient({
  initialStudents,
}: DashboardClientProps) {
  const { user, loading } = useAuth();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  const handleAttendanceChange = (
    studentId: string,
    date: string,
    status: 'Present' | 'Absent' | 'Late' | 'Excused'
  ) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) => {
        if (student.id === studentId) {
          const newAttendance = [...student.attendance];
          const recordIndex = newAttendance.findIndex((att) => att.date === date);

          if (recordIndex > -1) {
            newAttendance[recordIndex] = { ...newAttendance[recordIndex], status };
          } else {
            newAttendance.push({ date, status });
          }

          return { ...student, attendance: newAttendance };
        }
        return student;
      })
    );
  };

  if (loading) {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-9 w-1/2" />
                <Skeleton className="mt-2 h-5 w-1/3" />
            </div>
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Attendance Management
        </h1>
        <p className="text-muted-foreground">
          Mark student attendance and generate AI-powered summaries.
        </p>
      </div>

      <Tabs defaultValue="marking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="marking">Manual Marking</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="marking" className="mt-4">
          <AttendanceTable
            students={students}
            onAttendanceChange={handleAttendanceChange}
            date={today}
          />
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <AttendanceSummaryGenerator students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
