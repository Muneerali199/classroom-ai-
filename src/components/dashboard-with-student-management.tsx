'use client';

import { useState } from 'react';
import type { Student } from '@/lib/types';
import DashboardClient from '@/components/dashboard-client';
import UserManagement from '@/components/user-management';
import StudentIdGenerator from '@/components/student-id-generator';
import EnhancedStudentForm from '@/components/enhanced-student-form';
import StudentListManager from '@/components/student-list-manager';
import { Separator } from '@/components/ui/separator';

interface DashboardWithStudentManagementProps {
  initialStudents: Student[];
}

export default function DashboardWithStudentManagement({ 
  initialStudents 
}: DashboardWithStudentManagementProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);

  const handleStudentDeleted = (deletedStudentId: string) => {
    setStudents(prevStudents => 
      prevStudents.filter(student => student.id !== deletedStudentId)
    );
  };

  const handleStudentUpdated = (updatedStudent: Student) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === updatedStudent.id ? updatedStudent : student
      )
    );
  };

  const handleStudentCreated = () => {
    // Refresh the page or fetch updated student list
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Teacher Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Manage your classes and students here.
        </p>
      </div>
      <Separator />
      <div className="grid gap-6">
        <DashboardClient initialStudents={students} />
        
        {/* Student Management Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Student Management</h2>
          <div className="grid gap-6">
            {/* Student Creation */}
            <div className="grid gap-6 lg:grid-cols-2">
              <UserManagement userRole="teacher" onSuccess={handleStudentCreated} />
              <EnhancedStudentForm onSuccess={handleStudentCreated} />
            </div>
            
            {/* Student List and Tools */}
            <div className="grid gap-6 lg:grid-cols-2">
              <StudentListManager 
                students={students} 
                onStudentDeleted={handleStudentDeleted}
                onStudentUpdated={handleStudentUpdated}
              />
              <StudentIdGenerator students={students} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}