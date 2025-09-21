'use client';

import { useState, useEffect } from 'react';
import { EnhancedTeacherService } from '@/lib/enhanced-teacher-service';
import { Teacher } from '@/lib/types';
import DeanTeacherManagement from './dean-teacher-management';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  BookOpen, 
  Building, 
  Calendar,
  TrendingUp,
  Activity,
  BarChart3,
  PieChart,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDeanDashboardProps {
  initialTeachers: Teacher[];
}

interface DashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalSubjects: number;
  totalRooms: number;
  teachersByStatus: {
    fullTime: number;
    partTime: number;
    contract: number;
    substitute: number;
  };
  departmentBreakdown: { [key: string]: number };
  recentActivity: Array<{
    id: string;
    type: 'teacher_created' | 'teacher_updated' | 'teacher_deleted';
    description: string;
    timestamp: string;
  }>;
}

export default function EnhancedDeanDashboard({ initialTeachers }: EnhancedDeanDashboardProps) {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [stats, setStats] = useState<DashboardStats>({
    totalTeachers: 0,
    totalStudents: 0,
    totalSubjects: 0,
    totalRooms: 0,
    teachersByStatus: {
      fullTime: 0,
      partTime: 0,
      contract: 0,
      substitute: 0,
    },
    departmentBreakdown: {},
    recentActivity: [],
  });
  const [loading, setLoading] = useState(false);

  // Calculate stats from teachers data
  useEffect(() => {
    const calculateStats = () => {
      const teachersByStatus = {
        fullTime: teachers.filter(t => t.employment_status === 'Full-time').length,
        partTime: teachers.filter(t => t.employment_status === 'Part-time').length,
        contract: teachers.filter(t => t.employment_status === 'Contract').length,
        substitute: teachers.filter(t => t.employment_status === 'Substitute').length,
      };

      const departmentBreakdown: { [key: string]: number } = {};
      teachers.forEach(teacher => {
        if (teacher.department) {
          departmentBreakdown[teacher.department] = (departmentBreakdown[teacher.department] || 0) + 1;
        }
      });

      setStats(prev => ({
        ...prev,
        totalTeachers: teachers.length,
        teachersByStatus,
        departmentBreakdown,
      }));
    };

    calculateStats();
  }, [teachers]);

  const refreshData = async () => {
    try {
      setLoading(true);
      const updatedTeachers = await EnhancedTeacherService.getTeachers();
      setTeachers(updatedTeachers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to refresh dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Full-time':
        return 'bg-green-500';
      case 'Part-time':
        return 'bg-blue-500';
      case 'Contract':
        return 'bg-yellow-500';
      case 'Substitute':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTotalEmployed = () => {
    return stats.teachersByStatus.fullTime + stats.teachersByStatus.partTime + 
           stats.teachersByStatus.contract + stats.teachersByStatus.substitute;
  };

  return (
    <div className="min-h-screen text-gray-700" style={{
      background: 'linear-gradient(135deg, #e3e3e3 0%, #d6d6d6 100%)'
    }}>
      {/* Subtle floating elements with neumorphic style */}
      <div className="fixed top-20 left-10 w-16 h-16 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
          boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
        }}
      />
      <div className="fixed top-60 right-16 w-12 h-12 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #ebebeb, #d5d5d5)',
          boxShadow: '6px 6px 12px #c4c4c4, -6px -6px 12px #ffffff'
        }}
      />
      <div className="fixed bottom-32 left-24 w-20 h-20 rounded-full pointer-events-none z-0 animate-pulse"
        style={{
          background: 'linear-gradient(145deg, #ededed, #d7d7d7)',
          boxShadow: '10px 10px 20px #c0c0c0, -10px -10px 20px #ffffff'
        }}
      />

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="neumorphic-card p-6 rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 neumorphic rounded-xl flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-700">
                Dean Dashboard
              </h1>
              <p className="text-gray-600">
                Comprehensive school management and teacher administration
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Total Teachers</h3>
              <Users className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">{stats.totalTeachers}</div>
            <p className="text-xs text-gray-600">
              Active teaching staff
            </p>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Full-Time</h3>
              <Briefcase className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">{stats.teachersByStatus.fullTime}</div>
            <p className="text-xs text-gray-600">
              Full-time employees
            </p>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Part-Time</h3>
              <Clock className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">{stats.teachersByStatus.partTime}</div>
            <p className="text-xs text-gray-600">
              Part-time staff
            </p>
          </div>

          <div className="neumorphic-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-gray-700">Departments</h3>
              <Building className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-700">{Object.keys(stats.departmentBreakdown).length}</div>
            <p className="text-xs text-gray-600">
              Active departments
            </p>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="neumorphic-card p-2 rounded-2xl">
            <TabsList className="neumorphic-sm-inset rounded-xl grid w-full grid-cols-4">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="teachers" 
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                Teachers
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 data-[state=active]:neumorphic-sm data-[state=active]:text-gray-700 transition-all duration-300"
              >
                <Activity className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Employment Status Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Employment Status Distribution
                  </CardTitle>
                  <CardDescription>
                    Breakdown of teachers by employment type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Full-time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.teachersByStatus.fullTime}</span>
                        <Badge variant="secondary">
                          {stats.totalTeachers > 0 ? Math.round((stats.teachersByStatus.fullTime / stats.totalTeachers) * 100) : 0}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={stats.totalTeachers > 0 ? (stats.teachersByStatus.fullTime / stats.totalTeachers) * 100 : 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Part-time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.teachersByStatus.partTime}</span>
                        <Badge variant="secondary">
                          {stats.totalTeachers > 0 ? Math.round((stats.teachersByStatus.partTime / stats.totalTeachers) * 100) : 0}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={stats.totalTeachers > 0 ? (stats.teachersByStatus.partTime / stats.totalTeachers) * 100 : 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Contract</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.teachersByStatus.contract}</span>
                        <Badge variant="secondary">
                          {stats.totalTeachers > 0 ? Math.round((stats.teachersByStatus.contract / stats.totalTeachers) * 100) : 0}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={stats.totalTeachers > 0 ? (stats.teachersByStatus.contract / stats.totalTeachers) * 100 : 0} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">Substitute</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{stats.teachersByStatus.substitute}</span>
                        <Badge variant="secondary">
                          {stats.totalTeachers > 0 ? Math.round((stats.teachersByStatus.substitute / stats.totalTeachers) * 100) : 0}%
                        </Badge>
                      </div>
                    </div>
                    <Progress 
                      value={stats.totalTeachers > 0 ? (stats.teachersByStatus.substitute / stats.totalTeachers) * 100 : 0} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Department Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Department Distribution
                  </CardTitle>
                  <CardDescription>
                    Teachers by department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(stats.departmentBreakdown).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(stats.departmentBreakdown)
                        .sort(([,a], [,b]) => b - a)
                        .map(([department, count]) => (
                          <div key={department} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{department}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{count} teachers</span>
                              <Badge variant="outline">
                                {stats.totalTeachers > 0 ? Math.round((count / stats.totalTeachers) * 100) : 0}%
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Building className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No department data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common administrative tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Alert>
                    <UserPlus className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Add Teachers:</strong> Create new teacher accounts with full profiles and login credentials.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Users className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Manage Staff:</strong> Edit teacher information, reset passwords, and manage employment status.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <BarChart3 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>View Reports:</strong> Generate comprehensive reports on staff and student management.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers">
            <DeanTeacherManagement initialTeachers={teachers} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Staff Analytics
                </CardTitle>
                <CardDescription>
                  Detailed insights into your teaching staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Staff Composition</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Active Teachers</span>
                        <Badge variant="secondary">{stats.totalTeachers}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Full-time Staff</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                          {stats.teachersByStatus.fullTime}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Part-time Staff</span>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                          {stats.teachersByStatus.partTime}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Contract Workers</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          {stats.teachersByStatus.contract}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Department Coverage</h4>
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Detailed analytics coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  System Reports
                </CardTitle>
                <CardDescription>
                  Generate and view comprehensive reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Reports Module</h3>
                  <p>Comprehensive reporting features will be available here including:</p>
                  <ul className="mt-4 space-y-1 text-sm">
                    <li>• Teacher performance reports</li>
                    <li>• Department statistics</li>
                    <li>• Attendance analytics</li>
                    <li>• Staff management summaries</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}