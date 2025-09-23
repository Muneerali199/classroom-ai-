"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  CheckCircle,
  AlertTriangle,
  Code,
  Upload,
  Download,
  Zap,
  Brain,
  MessageSquare,
  BarChart3,
  Clock,
  Award,
  Search
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  type: 'mcq' | 'coding' | 'essay' | 'mixed';
  submissions: number;
  graded: number;
  avgScore: number;
  dueDate: string;
  status: 'active' | 'completed' | 'overdue';
}

interface Submission {
  id: string;
  studentName: string;
  studentId: string;
  submittedAt: string;
  type: 'mcq' | 'coding' | 'essay';
  content: string;
  aiScore?: number;
  aiConfidence?: number;
  plagiarismScore?: number;
  feedback?: string;
  status: 'pending' | 'ai_graded' | 'reviewed' | 'final';
}

interface GradingRubric {
  criteria: string;
  maxPoints: number;
  description: string;
}

export default function AIGradingAssistant() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>("");
  const [rubric, setRubric] = useState<GradingRubric[]>([]);
  const [batchProcessing, setBatchProcessing] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    
    // Simulate loading assignments
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockAssignments: Assignment[] = [
      {
        id: "1",
        title: "Data Structures - Binary Trees",
        type: 'coding',
        submissions: 28,
        graded: 15,
        avgScore: 78.5,
        dueDate: "2025-01-25",
        status: 'active'
      },
      {
        id: "2",
        title: "Algorithm Analysis Quiz",
        type: 'mcq',
        submissions: 32,
        graded: 32,
        avgScore: 85.2,
        dueDate: "2025-01-20",
        status: 'completed'
      },
      {
        id: "3",
        title: "Software Engineering Essay",
        type: 'essay',
        submissions: 25,
        graded: 8,
        avgScore: 72.1,
        dueDate: "2025-01-28",
        status: 'active'
      }
    ];

    const mockSubmissions: Submission[] = [
      {
        id: "1",
        studentName: "Alice Johnson",
        studentId: "ST001",
        submittedAt: "2025-01-22T10:30:00Z",
        type: 'coding',
        content: "class BinaryTree { /* implementation */ }",
        aiScore: 85,
        aiConfidence: 92,
        plagiarismScore: 5,
        feedback: "Excellent implementation with proper error handling. Consider optimizing the search function.",
        status: 'ai_graded'
      },
      {
        id: "2",
        studentName: "Bob Chen",
        studentId: "ST002",
        submittedAt: "2025-01-22T14:15:00Z",
        type: 'essay',
        content: "Software engineering principles are fundamental...",
        aiScore: 78,
        aiConfidence: 87,
        plagiarismScore: 12,
        feedback: "Good understanding of concepts. Needs more specific examples and better structure.",
        status: 'ai_graded'
      },
      {
        id: "3",
        studentName: "Carol Davis",
        studentId: "ST003",
        submittedAt: "2025-01-22T16:45:00Z",
        type: 'coding',
        content: "def binary_search(arr, target): # implementation",
        status: 'pending'
      }
    ];

    const mockRubric: GradingRubric[] = [
      {
        criteria: "Code Functionality",
        maxPoints: 40,
        description: "Does the code work correctly and handle edge cases?"
      },
      {
        criteria: "Code Quality",
        maxPoints: 30,
        description: "Is the code well-structured, readable, and following best practices?"
      },
      {
        criteria: "Algorithm Efficiency",
        maxPoints: 20,
        description: "Is the algorithm optimal in terms of time and space complexity?"
      },
      {
        criteria: "Documentation",
        maxPoints: 10,
        description: "Are comments and documentation adequate?"
      }
    ];

    setAssignments(mockAssignments);
    setSubmissions(mockSubmissions);
    setRubric(mockRubric);
    setLoading(false);
  };

  const runAIGrading = async (submissionId: string) => {
    setLoading(true);
    
    // Simulate AI grading process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? {
            ...sub,
            aiScore: Math.floor(Math.random() * 30) + 70, // 70-100
            aiConfidence: Math.floor(Math.random() * 20) + 80, // 80-100
            plagiarismScore: Math.floor(Math.random() * 15), // 0-15
            feedback: "AI-generated feedback based on rubric criteria and code analysis.",
            status: 'ai_graded' as const
          }
        : sub
    ));
    
    setLoading(false);
    toast({ title: "AI Grading Complete", description: "Assignment has been automatically graded" });
  };

  const runBatchGrading = async () => {
    setBatchProcessing(true);
    
    // Simulate batch processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');
    
    setSubmissions(prev => prev.map(sub => 
      sub.status === 'pending'
        ? {
            ...sub,
            aiScore: Math.floor(Math.random() * 30) + 70,
            aiConfidence: Math.floor(Math.random() * 20) + 80,
            plagiarismScore: Math.floor(Math.random() * 15),
            feedback: `AI Analysis: ${sub.type === 'coding' ? 'Code structure is good, consider edge case handling.' : 'Content demonstrates understanding, needs more examples.'}`,
            status: 'ai_graded' as const
          }
        : sub
    ));
    
    setBatchProcessing(false);
    toast({ 
      title: "Batch Grading Complete", 
      description: `${pendingSubmissions.length} submissions have been graded by AI` 
    });
  };

  const checkPlagiarism = async (submissionId: string) => {
    toast({ title: "Plagiarism Check", description: "Running AI plagiarism detection..." });
    
    // Simulate plagiarism check
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, plagiarismScore: Math.floor(Math.random() * 20) }
        : sub
    ));
    
    toast({ title: "Plagiarism Check Complete", description: "Results updated" });
  };

  const exportGrades = () => {
    const gradedSubmissions = submissions.filter(sub => sub.aiScore);
    const csvContent = [
      "Student Name,Student ID,Score,Confidence,Plagiarism %,Status",
      ...gradedSubmissions.map(sub => 
        `${sub.studentName},${sub.studentId},${sub.aiScore},${sub.aiConfidence}%,${sub.plagiarismScore}%,${sub.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-grading-results.csv';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Export Complete", description: "Grading results downloaded" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'ai_graded': return 'bg-blue-100 text-blue-700';
      case 'reviewed': return 'bg-green-100 text-green-700';
      case 'final': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlagiarismColor = (score: number) => {
    if (score > 20) return 'text-red-600';
    if (score > 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Assignment Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-800">{assignment.title}</h3>
                <Badge variant="outline">{assignment.type}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Submissions:</span>
                  <span className="font-medium">{assignment.submissions}</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Graded:</span>
                  <span className="font-medium text-blue-600">{assignment.graded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Score:</span>
                  <span className="font-medium">{assignment.avgScore}%</span>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full mt-3"
                onClick={() => setSelectedAssignment(assignment.id)}
              >
                View Submissions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="grading" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="grading">AI Grading</TabsTrigger>
            <TabsTrigger value="plagiarism">Plagiarism</TabsTrigger>
            <TabsTrigger value="rubric">Rubric</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button onClick={runBatchGrading} disabled={batchProcessing}>
              {batchProcessing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Batch Grade All
                </>
              )}
            </Button>
            <Button variant="outline" onClick={exportGrades}>
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        <TabsContent value="grading" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Grading Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="neumorphic-sm-inset p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-800">{submission.studentName}</h3>
                        <Badge variant="outline">{submission.studentId}</Badge>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <span className="ml-2">{new Date(submission.submittedAt).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <span className="ml-2 capitalize">{submission.type}</span>
                        </div>
                      </div>

                      {submission.aiScore && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <div className="grid grid-cols-3 gap-4 mb-2">
                            <div>
                              <span className="text-sm text-blue-600">AI Score:</span>
                              <span className="ml-2 font-bold text-blue-800">{submission.aiScore}/100</span>
                            </div>
                            <div>
                              <span className="text-sm text-blue-600">Confidence:</span>
                              <span className="ml-2 font-medium">{submission.aiConfidence}%</span>
                            </div>
                            <div>
                              <span className="text-sm text-blue-600">Plagiarism:</span>
                              <span className={`ml-2 font-medium ${getPlagiarismColor(submission.plagiarismScore || 0)}`}>
                                {submission.plagiarismScore}%
                              </span>
                            </div>
                          </div>
                          {submission.feedback && (
                            <div className="border-t border-blue-200 pt-2">
                              <p className="text-sm text-blue-800">
                                <MessageSquare className="w-3 h-3 inline mr-1" />
                                <strong>AI Feedback:</strong> {submission.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      {submission.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => runAIGrading(submission.id)}
                          disabled={loading}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          AI Grade
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => checkPlagiarism(submission.id)}
                      >
                        <Search className="w-3 h-3 mr-1" />
                        Check Plagiarism
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plagiarism" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Plagiarism Detection Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.filter(sub => sub.plagiarismScore !== undefined).map((submission) => (
                  <div key={submission.id} className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{submission.studentName}</h3>
                        <p className="text-sm text-gray-600">{submission.studentId}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getPlagiarismColor(submission.plagiarismScore || 0)}`}>
                          {submission.plagiarismScore}%
                        </div>
                        <div className="text-xs text-gray-500">similarity</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubric" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                AI Grading Rubric
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rubric.map((criterion, index) => (
                  <div key={index} className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-800">{criterion.criteria}</h3>
                      <Badge variant="outline">{criterion.maxPoints} pts</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{criterion.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">AI Grading Process:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Analyzes code functionality and correctness</li>
                  <li>• Evaluates code quality and best practices</li>
                  <li>• Checks algorithm efficiency and optimization</li>
                  <li>• Reviews documentation and comments</li>
                  <li>• Provides personalized feedback for improvement</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
