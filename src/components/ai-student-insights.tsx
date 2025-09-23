"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Target,
  BookOpen,
  Clock,
  Award,
  MessageSquare
} from "lucide-react";

interface StudentInsight {
  id: string;
  name: string;
  email: string;
  riskLevel: 'high' | 'medium' | 'low';
  attendanceRate: number;
  assignmentCompletion: number;
  lastActivity: string;
  strugglingAreas: string[];
  recommendations: string[];
  trend: 'improving' | 'declining' | 'stable';
}

export default function AIStudentInsights() {
  const { toast } = useToast();
  const [insights, setInsights] = useState<StudentInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentInsight | null>(null);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockInsights: StudentInsight[] = [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex.j@student.edu",
        riskLevel: 'high',
        attendanceRate: 65,
        assignmentCompletion: 45,
        lastActivity: "3 days ago",
        strugglingAreas: ["Mathematics", "Physics", "Problem Solving"],
        recommendations: [
          "Schedule one-on-one tutoring session",
          "Provide additional practice materials",
          "Check for personal challenges affecting studies",
          "Consider peer mentoring program"
        ],
        trend: 'declining'
      },
      {
        id: "2", 
        name: "Sarah Chen",
        email: "sarah.c@student.edu",
        riskLevel: 'medium',
        attendanceRate: 78,
        assignmentCompletion: 72,
        lastActivity: "1 day ago",
        strugglingAreas: ["Advanced Topics", "Time Management"],
        recommendations: [
          "Suggest study group participation",
          "Provide time management resources",
          "Monitor progress weekly"
        ],
        trend: 'stable'
      },
      {
        id: "3",
        name: "Michael Rodriguez", 
        email: "michael.r@student.edu",
        riskLevel: 'low',
        attendanceRate: 92,
        assignmentCompletion: 88,
        lastActivity: "Today",
        strugglingAreas: [],
        recommendations: [
          "Consider for peer mentoring role",
          "Provide advanced challenges",
          "Maintain current engagement level"
        ],
        trend: 'improving'
      },
      {
        id: "4",
        name: "Emma Thompson",
        email: "emma.t@student.edu", 
        riskLevel: 'medium',
        attendanceRate: 82,
        assignmentCompletion: 68,
        lastActivity: "2 days ago",
        strugglingAreas: ["Practical Applications", "Group Work"],
        recommendations: [
          "Encourage more group participation",
          "Provide real-world examples",
          "Schedule progress check-in"
        ],
        trend: 'stable'
      }
    ];

    setInsights(mockInsights);
    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-600 rotate-180" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const sendRecommendation = (studentId: string, recommendation: string) => {
    toast({ 
      title: "Recommendation sent", 
      description: `Intervention suggestion sent for student ${insights.find(s => s.id === studentId)?.name}` 
    });
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Student Insights
            </CardTitle>
            <Button variant="outline" onClick={generateInsights} disabled={loading}>
              {loading ? "Analyzing..." : "Refresh Analysis"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="neumorphic-sm p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-gray-700">High Risk</span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {insights.filter(s => s.riskLevel === 'high').length}
              </div>
            </div>
            
            <div className="neumorphic-sm p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Medium Risk</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {insights.filter(s => s.riskLevel === 'medium').length}
              </div>
            </div>

            <div className="neumorphic-sm p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Performing Well</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {insights.filter(s => s.riskLevel === 'low').length}
              </div>
            </div>

            <div className="neumorphic-sm p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Total Students</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {insights.length}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {insights.map((student) => (
              <div key={student.id} className="neumorphic-sm-inset p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-medium text-gray-800">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                    <Badge className={getRiskColor(student.riskLevel)}>
                      {student.riskLevel} risk
                    </Badge>
                    {getTrendIcon(student.trend)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedStudent(selectedStudent?.id === student.id ? null : student)}
                  >
                    {selectedStudent?.id === student.id ? "Hide Details" : "View Details"}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">{student.attendanceRate}%</div>
                    <div className="text-xs text-gray-600">Attendance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800">{student.assignmentCompletion}%</div>
                    <div className="text-xs text-gray-600">Assignments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800">{student.lastActivity}</div>
                    <div className="text-xs text-gray-600">Last Active</div>
                  </div>
                </div>

                {selectedStudent?.id === student.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    {student.strugglingAreas.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Struggling Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {student.strugglingAreas.map((area, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        AI Recommendations
                      </h4>
                      <div className="space-y-2">
                        {student.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                            <span className="text-sm text-gray-700">{rec}</span>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => sendRecommendation(student.id, rec)}
                            >
                              Apply
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
