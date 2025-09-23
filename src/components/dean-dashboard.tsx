"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AICurriculumGapDetector from '@/components/ai-curriculum-gap-detector';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Users, 
  BookOpen,
  Calendar,
  Award,
  Activity,
  BarChart3,
  Clock,
  Target,
  Trophy,
  Zap
} from "lucide-react";

interface CourseAlert {
  id: string;
  courseName: string;
  instructor: string;
  department: string;
  alertType: 'schedule_delay' | 'low_attendance' | 'poor_performance';
  severity: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  daysDelayed?: number;
  completionRate?: number;
}

interface DepartmentStats {
  department: string;
  totalStudents: number;
  averageAttendance: number;
  courseCompletion: number;
  topStudents: Array<{ name: string; score: number }>;
  strugglingStudents: Array<{ name: string; issues: string[] }>;
  activeCourses: number;
  upcomingEvents: number;
}

interface CurriculumActivity {
  id: string;
  title: string;
  type: 'seminar' | 'hackathon' | 'cultural' | 'workshop';
  date: string;
  department: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export default function DeanDashboard() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<CourseAlert[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [activities, setActivities] = useState<CurriculumActivity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Simulate data loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockAlerts: CourseAlert[] = [
      {
        id: "1",
        courseName: "Advanced Database Systems",
        instructor: "Dr. Smith",
        department: "Computer Science",
        alertType: 'schedule_delay',
        severity: 'high',
        description: "Course is 2 weeks behind scheduled curriculum",
        recommendation: "Consider additional lab sessions or extended hours",
        daysDelayed: 14,
        completionRate: 65
      },
      {
        id: "2", 
        courseName: "Organic Chemistry",
        instructor: "Prof. Johnson",
        department: "Chemistry",
        alertType: 'low_attendance',
        severity: 'medium',
        description: "Average attendance dropped to 68%",
        recommendation: "Investigate attendance issues and implement engagement strategies",
        completionRate: 68
      },
      {
        id: "3",
        courseName: "Linear Algebra",
        instructor: "Dr. Brown",
        department: "Mathematics", 
        alertType: 'poor_performance',
        severity: 'high',
        description: "45% of students failing midterm assessments",
        recommendation: "Arrange remedial classes and additional tutoring support",
        completionRate: 55
      }
    ];

    const mockDepartmentStats: DepartmentStats[] = [
      {
        department: "Computer Science",
        totalStudents: 245,
        averageAttendance: 82,
        courseCompletion: 78,
        topStudents: [
          { name: "Alice Chen", score: 95 },
          { name: "Bob Wilson", score: 92 },
          { name: "Carol Davis", score: 90 }
        ],
        strugglingStudents: [
          { name: "David Lee", issues: ["Attendance", "Assignments"] },
          { name: "Eva Martinez", issues: ["Exam Performance"] }
        ],
        activeCourses: 12,
        upcomingEvents: 3
      },
      {
        department: "Mathematics",
        totalStudents: 189,
        averageAttendance: 75,
        courseCompletion: 72,
        topStudents: [
          { name: "Frank Zhang", score: 94 },
          { name: "Grace Kim", score: 91 },
          { name: "Henry Taylor", score: 88 }
        ],
        strugglingStudents: [
          { name: "Ivy Johnson", issues: ["Complex Topics", "Time Management"] },
          { name: "Jack Brown", issues: ["Attendance", "Participation"] }
        ],
        activeCourses: 8,
        upcomingEvents: 2
      },
      {
        department: "Chemistry",
        totalStudents: 156,
        averageAttendance: 79,
        courseCompletion: 74,
        topStudents: [
          { name: "Kate Miller", score: 93 },
          { name: "Liam Wilson", score: 89 },
          { name: "Mia Garcia", score: 87 }
        ],
        strugglingStudents: [
          { name: "Noah Davis", issues: ["Lab Work", "Theory"] },
          { name: "Olivia Smith", issues: ["Practical Applications"] }
        ],
        activeCourses: 6,
        upcomingEvents: 4
      }
    ];

    const mockActivities: CurriculumActivity[] = [
      {
        id: "1",
        title: "AI & Machine Learning Symposium",
        type: 'seminar',
        date: "2025-01-28",
        department: "Computer Science",
        participants: 120,
        status: 'upcoming'
      },
      {
        id: "2",
        title: "CodeFest 2025",
        type: 'hackathon', 
        date: "2025-02-05",
        department: "Computer Science",
        participants: 85,
        status: 'upcoming'
      },
      {
        id: "3",
        title: "Cultural Diversity Week",
        type: 'cultural',
        date: "2025-01-25",
        department: "All Departments",
        participants: 300,
        status: 'ongoing'
      },
      {
        id: "4",
        title: "Research Methodology Workshop",
        type: 'workshop',
        date: "2025-01-20",
        department: "Mathematics",
        participants: 45,
        status: 'completed'
      }
    ];

    setAlerts(mockAlerts);
    setDepartmentStats(mockDepartmentStats);
    setActivities(mockActivities);
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'seminar': return <BookOpen className="w-4 h-4" />;
      case 'hackathon': return <Zap className="w-4 h-4" />;
      case 'cultural': return <Award className="w-4 h-4" />;
      case 'workshop': return <Target className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast({ title: "Alert resolved", description: "Intervention plan has been initiated" });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {departmentStats.reduce((sum, dept) => sum + dept.totalStudents, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{alerts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(departmentStats.reduce((sum, dept) => sum + dept.averageAttendance, 0) / departmentStats.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activities.filter(a => a.status === 'upcoming' || a.status === 'ongoing').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Early Warning System</TabsTrigger>
          <TabsTrigger value="analytics">Department Analytics</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum Gaps</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Course Alerts & Early Warnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="neumorphic-sm-inset p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-800">{alert.courseName}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Instructor: {alert.instructor} • Department: {alert.department}
                      </p>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Recommendation:</strong> {alert.recommendation}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                  
                  {alert.daysDelayed && (
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-red-600" />
                        {alert.daysDelayed} days delayed
                      </span>
                      {alert.completionRate && (
                        <span className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          {alert.completionRate}% completion
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {alerts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                  <p className="text-sm">All courses are on track</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {departmentStats.map((dept) => (
            <Card key={dept.department} className="neumorphic-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{dept.department} Department</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {dept.totalStudents} students
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {dept.activeCourses} courses
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div className="neumorphic-sm p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {dept.averageAttendance}%
                    </div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </div>
                  
                  <div className="neumorphic-sm p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {dept.courseCompletion}%
                    </div>
                    <div className="text-sm text-gray-600">Course Completion</div>
                  </div>

                  <div className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium">Top Performers</span>
                    </div>
                    <div className="space-y-1">
                      {dept.topStudents.map((student, index) => (
                        <div key={index} className="flex justify-between text-xs">
                          <span>{student.name}</span>
                          <span className="font-medium">{student.score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm font-medium">Need Support</span>
                    </div>
                    <div className="space-y-1">
                      {dept.strugglingStudents.map((student, index) => (
                        <div key={index} className="text-xs">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-gray-500">{student.issues.join(", ")}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="curriculum" className="space-y-4">
          <AICurriculumGapDetector />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Curriculum Activity Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activities.map((activity) => (
                  <div key={activity.id} className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getActivityIcon(activity.type)}
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <Badge 
                        className={
                          activity.status === 'completed' ? 'bg-green-100 text-green-700' :
                          activity.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-medium text-gray-800 mb-1">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{activity.department}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(activity.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {activity.participants} participants
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
