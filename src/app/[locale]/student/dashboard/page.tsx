import UltraModernStudentDashboard from '@/components/ultra-modern-student-dashboard';
import StudentNotifications from '@/components/student-notifications';
import StudentAssignments from '@/components/student-assignments';
import StudentTimetableView from '@/components/student-timetable-view';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6 p-6">
      {/* Main Dashboard Overview */}
      <UltraModernStudentDashboard />
      
      {/* Notifications Section */}
      <StudentNotifications variant="full" maxHeight="400px" />
      
      {/* Assignments Section */}
      <StudentAssignments />
      
      {/* Timetable Section */}
      <StudentTimetableView />
    </div>
  );
}
