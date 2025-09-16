'use client';

import { useState } from 'react';
import type { Student, AttendanceStatus } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AttendanceTable from '@/components/attendance-table';
import AttendanceSummaryGenerator from '@/components/attendance-summary-generator';
import ScanAttendanceClient from '@/components/scan-attendance-client';
import { useAuth } from '@/hooks/use-auth';
import PinSessionManager from './pin-session-manager';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface DashboardClientProps {
  initialStudents: Student[];
}

export default function DashboardClient({
  initialStudents,
}: DashboardClientProps) {
  const { user } = useAuth(); // We still need user info here
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [today] = useState(new Date().toISOString().split('T')[0]);

  const handleAttendanceChange = async (
    studentId: string,
    date: string,
    status: AttendanceStatus
  ) => {
    try {
      // Save to Supabase
      if (supabase) {
        const { error } = await supabase
          .from('attendance')
          .upsert({
            student_id: studentId,
            date: date,
            status: status,
          });

        if (error) {
          throw new Error(`Failed to save attendance: ${error.message}`);
        }
      }

      // Update local state
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

      toast({
        title: 'Attendance Updated',
        description: 'Attendance record has been saved successfully.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save attendance. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleScanAttendanceUpdate = async (presentStudentIds: string[]) => {
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      // Save attendance records to Supabase
      if (supabase) {
        const attendanceRecords = students.map(student => {
          const isPresent = presentStudentIds.includes(student.id);
          return {
            student_id: student.id,
            date: todayStr,
            status: isPresent ? 'Present' as const : 'Absent' as const,
          };
        });

        const { error } = await supabase
          .from('attendance')
          .upsert(attendanceRecords);

        if (error) {
          throw new Error(`Failed to save attendance: ${error.message}`);
        }
      }

      // Update local state
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

      toast({
        title: 'Attendance Updated',
        description: 'Facial recognition attendance has been recorded.',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to save attendance. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Hello, {(user?.user_metadata?.firstName || user?.user_metadata?.full_name?.split(' ')[0] || 'Teacher') as string}!
        </h1>
        <p className="text-muted-foreground">
          Welcome back. Mark student attendance and generate AI-powered summaries.
        </p>
      </div>

      <Tabs defaultValue="marking" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-background/50 dark:bg-black/20 border dark:border-white/10">
          <TabsTrigger value="marking">Manual Marking</TabsTrigger>
          <TabsTrigger value="pin-code">PIN Attendance</TabsTrigger>
          <TabsTrigger value="scan">Facial Scan</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="marking" className="mt-4">
          <AttendanceTable
            students={students}
            onAttendanceChange={handleAttendanceChange}
            date={today}
          />
        </TabsContent>
        <TabsContent value="pin-code" className="mt-4">
          <PinSessionManager students={students} />
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
