"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BookOpen, 
  Users, 
  Award,
  Target,
  Clock
} from "lucide-react";
import { useTranslations } from "next-intl";

interface PerformanceData {
  academics: {
    overallGrade: number;
    subjects: Array<{
      name: string;
      grade: number;
      trend: 'up' | 'down' | 'stable';
      assignments: {
        completed: number;
        total: number;
      };
    }>;
    gpa: number;
    rank: number;
    totalStudents: number;
  };
  attendance: {
    overall: number;
    monthly: Array<{
      month: string;
      percentage: number;
    }>;
    subjects: Array<{
      name: string;
      percentage: number;
      present: number;
      total: number;
    }>;
    streak: number;
    lastAbsent: string;
  };
  goals: Array<{
    id: string;
    title: string;
    target: number;
    current: number;
    deadline: string;
    category: 'academic' | 'attendance';
  }>;
}

interface PerformanceTrackerProps {
  userId: string;
  userRole: 'student' | 'teacher' | 'dean';
  className?: string;
}

export default function PerformanceTracker({ 
  userId, 
  userRole, 
  className = "" 
}: PerformanceTrackerProps) {
  const t = useTranslations('performance');
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching performance data
    // In real implementation, this would fetch from your API
    const fetchPerformanceData = async () => {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockData: PerformanceData = {
        academics: {
          overallGrade: 85,
          subjects: [
            { name: "Mathematics", grade: 88, trend: 'up', assignments: { completed: 8, total: 10 } },
            { name: "Science", grade: 82, trend: 'stable', assignments: { completed: 9, total: 10 } },
            { name: "English", grade: 90, trend: 'up', assignments: { completed: 10, total: 10 } },
            { name: "History", grade: 78, trend: 'down', assignments: { completed: 7, total: 10 } },
          ],
          gpa: 3.4,
          rank: 15,
          totalStudents: 120
        },
        attendance: {
          overall: 92,
          monthly: [
            { month: "Jan", percentage: 95 },
            { month: "Feb", percentage: 88 },
            { month: "Mar", percentage: 92 },
            { month: "Apr", percentage: 94 },
          ],
          subjects: [
            { name: "Mathematics", percentage: 95, present: 19, total: 20 },
            { name: "Science", percentage: 90, present: 18, total: 20 },
            { name: "English", percentage: 88, present: 17, total: 20 },
            { name: "History", percentage: 92, present: 18, total: 20 },
          ],
          streak: 7,
          lastAbsent: "2024-01-15"
        },
        goals: [
          {
            id: "1",
            title: "Improve Math Grade to 90%",
            target: 90,
            current: 88,
            deadline: "2024-03-31",
            category: "academic"
          },
          {
            id: "2",
            title: "Maintain 95% Attendance",
            target: 95,
            current: 92,
            deadline: "2024-06-30",
            category: "attendance"
          }
        ]
      };

      setTimeout(() => {
        setPerformanceData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchPerformanceData();
  }, [userId]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return "text-green-600";
    if (percentage >= 85) return "text-blue-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!performanceData) return null;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          {t('performanceOverview')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="academics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="academics" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {t('academics')}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {t('attendance')}
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              {t('goals')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="academics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getGradeColor(performanceData.academics.overallGrade)}`}>
                      {performanceData.academics.overallGrade}%
                    </div>
                    <div className="text-sm text-muted-foreground">{t('overallGrade')}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {performanceData.academics.gpa}
                    </div>
                    <div className="text-sm text-muted-foreground">GPA</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      #{performanceData.academics.rank}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t('rankOutOf')} {performanceData.academics.totalStudents}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">{t('subjectPerformance')}</h4>
              {performanceData.academics.subjects.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{subject.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('assignments')}: {subject.assignments.completed}/{subject.assignments.total}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(subject.trend)}
                    <Badge variant="outline" className={getGradeColor(subject.grade)}>
                      {subject.grade}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getAttendanceColor(performanceData.attendance.overall)}`}>
                      {performanceData.attendance.overall}%
                    </div>
                    <div className="text-sm text-muted-foreground">{t('overallAttendance')}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {performanceData.attendance.streak}
                    </div>
                    <div className="text-sm text-muted-foreground">{t('dayStreak')}</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-sm font-medium text-muted-foreground">
                      {t('lastAbsent')}
                    </div>
                    <div className="text-sm">
                      {new Date(performanceData.attendance.lastAbsent).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">{t('subjectAttendance')}</h4>
              {performanceData.attendance.subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {subject.present}/{subject.total}
                      </span>
                      <Badge variant="outline" className={getAttendanceColor(subject.percentage)}>
                        {subject.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            {performanceData.goals.map((goal) => (
              <Card key={goal.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {t('deadline')}: {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge variant={goal.category === 'academic' ? 'default' : 'secondary'}>
                        {goal.category}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('progress')}</span>
                        <span>{goal.current}/{goal.target}</span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
