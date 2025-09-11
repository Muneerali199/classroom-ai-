'use client';

import { useState } from 'react';
import type { Student, AttendanceStatus } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceTable from '@/components/attendance-table';
import AttendanceSummaryGenerator from '@/components/attendance-summary-generator';
import ScanAttendanceClient from '@/components/scan-attendance-client';
import { useAuth } from '@/hooks/use-auth';

interface DashboardClientProps {
  initialStudents: Student[];
}

export default function DashboardClient({
  initialStudents,
}: DashboardClientProps) {
  const { user } = useAuth(); // We still need user info here
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  const handleAttendanceChange = (
    studentId: string,
    date: string,
    status: AttendanceStatus
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
  
  const handleScanAttendanceUpdate = (presentStudentIds: string[]) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setStudents(prevStudents => 
        prevStudents.map(student => {
            const isPresent = presentStudentIds.includes(student.id);
            const newStatus: AttendanceStatus = isPresent ? 'Present' : 'Absent';
            
            const newAttendance = [...student.attendance];
            const recordIndex = newAttendance.findIndex(att => att.date === todayStr);

            if (recordIndex > -1) {
                newAttendance[recordIndex] = { ...newAttendance[recordIndex], status: newStatus };
            } else {
                newAttendance.push({ date: todayStr, status: newStatus });
            }
            
            return { ...student, attendance: newAttendance };
        })
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Hello, {user?.displayName?.split(' ')[0] || 'Teacher'}!
        </h1>
        <p className="text-muted-foreground">
          Welcome back. Mark student attendance and generate AI-powered summaries.
        </p>
      </div>

      <Tabs defaultValue="marking" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg bg-background/50 dark:bg-black/20 border dark:border-white/10">
          <TabsTrigger value="marking">Manual Marking</TabsTrigger>
          <TabsTrigger value="scan">Scan Attendance</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="marking" className="mt-4">
          <AttendanceTable
            students={students}
            onAttendanceChange={handleAttendanceChange}
            date={today}
          />
        </TabsContent>
        <TabsContent value="scan" className="mt-4">
            <ScanAttendanceClient students={students} onAttendanceUpdate={handleScanAttendanceUpdate} />
        </TabsContent>
        <TabsContent value="summary" className="mt-4">
          <AttendanceSummaryGenerator students={students} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
