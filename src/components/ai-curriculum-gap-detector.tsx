"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Code,
  Briefcase,
  GitBranch,
  FileText,
  Target,
  Lightbulb,
  Clock
} from "lucide-react";

interface CurriculumGap {
  id: string;
  course: string;
  department: string;
  missingSkill: string;
  industryDemand: 'high' | 'medium' | 'low';
  urgency: 'critical' | 'important' | 'moderate';
  description: string;
  sources: string[];
  suggestedAction: string;
  estimatedImplementationTime: string;
}

interface IndustryTrend {
  id: string;
  skill: string;
  category: 'technical' | 'soft' | 'domain';
  growthRate: number;
  jobPostings: number;
  averageSalary: string;
  relatedCourses: string[];
  description: string;
}

interface CurriculumAnalysis {
  totalCourses: number;
  analyzedCourses: number;
  identifiedGaps: number;
  coverageScore: number;
  lastAnalysis: string;
}

export default function AICurriculumGapDetector() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gaps, setGaps] = useState<CurriculumGap[]>([]);
  const [trends, setTrends] = useState<IndustryTrend[]>([]);
  const [analysis, setAnalysis] = useState<CurriculumAnalysis | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  useEffect(() => {
    runCurriculumAnalysis();
  }, []);

  const runCurriculumAnalysis = async () => {
    setLoading(true);
    
    // Simulate AI analysis of curriculum vs industry trends
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockAnalysis: CurriculumAnalysis = {
      totalCourses: 45,
      analyzedCourses: 42,
      identifiedGaps: 8,
      coverageScore: 78,
      lastAnalysis: new Date().toISOString()
    };

    const mockGaps: CurriculumGap[] = [
      {
        id: "1",
        course: "Artificial Intelligence",
        department: "Computer Science",
        missingSkill: "AI Ethics and Bias Detection",
        industryDemand: 'high',
        urgency: 'critical',
        description: "Growing industry focus on responsible AI development and bias mitigation is not covered in current curriculum",
        sources: ["IEEE AI Standards", "Google AI Principles", "MIT AI Ethics Papers"],
        suggestedAction: "Add 2-week module on AI Ethics, Fairness, and Bias Detection with practical case studies",
        estimatedImplementationTime: "4-6 weeks"
      },
      {
        id: "2",
        course: "Software Engineering",
        department: "Computer Science", 
        missingSkill: "DevOps and CI/CD Pipelines",
        industryDemand: 'high',
        urgency: 'important',
        description: "Modern software development practices including containerization, automated testing, and deployment pipelines",
        sources: ["GitHub Job Trends", "Stack Overflow Survey", "DevOps Institute"],
        suggestedAction: "Integrate hands-on DevOps lab with Docker, Jenkins, and cloud deployment",
        estimatedImplementationTime: "6-8 weeks"
      },
      {
        id: "3",
        course: "Data Structures",
        department: "Computer Science",
        missingSkill: "Distributed Systems Concepts",
        industryDemand: 'medium',
        urgency: 'important',
        description: "Scalability, consistency, and distributed data structures are increasingly important in modern applications",
        sources: ["AWS Architecture Papers", "Google SRE Book", "Distributed Systems Research"],
        suggestedAction: "Add advanced module on distributed hash tables, consensus algorithms, and CAP theorem",
        estimatedImplementationTime: "3-4 weeks"
      },
      {
        id: "4",
        course: "Database Systems",
        department: "Computer Science",
        missingSkill: "NoSQL and Graph Databases",
        industryDemand: 'high',
        urgency: 'important',
        description: "Modern applications increasingly use NoSQL databases and graph-based data models",
        sources: ["DB-Engines Ranking", "MongoDB Usage Stats", "Neo4j Case Studies"],
        suggestedAction: "Add practical sessions with MongoDB, Cassandra, and Neo4j",
        estimatedImplementationTime: "4-5 weeks"
      },
      {
        id: "5",
        course: "Business Analytics",
        department: "Business",
        missingSkill: "Real-time Analytics and Streaming",
        industryDemand: 'high',
        urgency: 'critical',
        description: "Businesses need real-time insights and streaming analytics capabilities",
        sources: ["Gartner Analytics Report", "Apache Kafka Usage", "Real-time Analytics Trends"],
        suggestedAction: "Introduce Apache Kafka, Apache Flink, and real-time dashboard creation",
        estimatedImplementationTime: "5-6 weeks"
      },
      {
        id: "6",
        course: "Cybersecurity",
        department: "Computer Science",
        missingSkill: "Cloud Security and Zero Trust",
        industryDemand: 'high',
        urgency: 'critical',
        description: "Cloud-first security models and zero-trust architecture are becoming industry standards",
        sources: ["NIST Cybersecurity Framework", "Cloud Security Alliance", "Zero Trust Research"],
        suggestedAction: "Add cloud security module covering AWS/Azure security, zero-trust principles",
        estimatedImplementationTime: "6-7 weeks"
      }
    ];

    const mockTrends: IndustryTrend[] = [
      {
        id: "1",
        skill: "Machine Learning Operations (MLOps)",
        category: 'technical',
        growthRate: 145,
        jobPostings: 12500,
        averageSalary: "$125,000",
        relatedCourses: ["Machine Learning", "Software Engineering"],
        description: "Deployment, monitoring, and maintenance of ML models in production"
      },
      {
        id: "2",
        skill: "Quantum Computing",
        category: 'technical',
        growthRate: 89,
        jobPostings: 3200,
        averageSalary: "$140,000",
        relatedCourses: ["Advanced Mathematics", "Physics"],
        description: "Quantum algorithms, quantum programming languages, and quantum hardware"
      },
      {
        id: "3",
        skill: "Sustainable Technology",
        category: 'domain',
        growthRate: 76,
        jobPostings: 8900,
        averageSalary: "$95,000",
        relatedCourses: ["Environmental Science", "Engineering"],
        description: "Green computing, energy-efficient algorithms, and sustainable system design"
      },
      {
        id: "4",
        skill: "Blockchain Development",
        category: 'technical',
        growthRate: 67,
        jobPostings: 15600,
        averageSalary: "$110,000",
        relatedCourses: ["Cryptography", "Distributed Systems"],
        description: "Smart contracts, DeFi protocols, and decentralized applications"
      }
    ];

    setAnalysis(mockAnalysis);
    setGaps(mockGaps);
    setTrends(mockTrends);
    setLoading(false);
    
    toast({ 
      title: "Analysis Complete", 
      description: `Identified ${mockGaps.length} curriculum gaps across ${mockAnalysis.analyzedCourses} courses` 
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'important': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'moderate': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'soft': return <Target className="w-4 h-4" />;
      case 'domain': return <Briefcase className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const implementGap = (gapId: string) => {
    toast({ 
      title: "Implementation Planned", 
      description: "Curriculum update has been scheduled for review" 
    });
  };

  const filteredGaps = selectedDepartment === "all" 
    ? gaps 
    : gaps.filter(gap => gap.department === selectedDepartment);

  const departments = Array.from(new Set(gaps.map(gap => gap.department)));

  return (
    <div className="space-y-6">
      {/* Analysis Overview */}
      {analysis && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Coverage Score</p>
                  <p className="text-2xl font-bold text-blue-600">{analysis.coverageScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses Analyzed</p>
                  <p className="text-2xl font-bold text-green-600">{analysis.analyzedCourses}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Identified Gaps</p>
                  <p className="text-2xl font-bold text-red-600">{analysis.identifiedGaps}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Analysis</p>
                  <p className="text-sm font-bold text-gray-700">
                    {new Date(analysis.lastAnalysis).toLocaleDateString()}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="gaps" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="gaps">Curriculum Gaps</TabsTrigger>
            <TabsTrigger value="trends">Industry Trends</TabsTrigger>
          </TabsList>
          
          <Button onClick={runCurriculumAnalysis} disabled={loading}>
            {loading ? "Analyzing..." : "Refresh Analysis"}
          </Button>
        </div>

        <TabsContent value="gaps" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Powered Curriculum Gap Analysis
                </CardTitle>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Department:</label>
                  <select 
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="border rounded-md h-8 px-2 text-sm"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="neumorphic-sm p-4 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                filteredGaps.map((gap) => (
                  <div key={gap.id} className="neumorphic-sm-inset p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-800">{gap.course}</h3>
                          <Badge variant="outline">{gap.department}</Badge>
                          <Badge className={getUrgencyColor(gap.urgency)}>
                            {gap.urgency}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-blue-700 mb-2">{gap.missingSkill}</h4>
                        <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                        
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <p className="text-sm text-blue-800">
                            <strong>Suggested Action:</strong> {gap.suggestedAction}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Implementation time: {gap.estimatedImplementationTime}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <Badge className={getDemandColor(gap.industryDemand)}>
                            {gap.industryDemand} demand
                          </Badge>
                          <span className="text-gray-500">
                            Sources: {gap.sources.length} industry reports
                          </span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => implementGap(gap.id)}
                      >
                        Plan Implementation
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Emerging Industry Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {trends.map((trend) => (
                  <div key={trend.id} className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(trend.category)}
                        <h3 className="font-medium text-gray-800">{trend.skill}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {trend.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{trend.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                      <div>
                        <span className="text-gray-500">Growth:</span>
                        <span className="font-medium text-green-600 ml-1">+{trend.growthRate}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Jobs:</span>
                        <span className="font-medium ml-1">{trend.jobPostings.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Salary:</span>
                        <span className="font-medium ml-1">{trend.averageSalary}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Courses:</span>
                        <span className="font-medium ml-1">{trend.relatedCourses.length}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">Related Courses:</p>
                      <div className="flex flex-wrap gap-1">
                        {trend.relatedCourses.map((course, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {course}
                          </Badge>
                        ))}
                      </div>
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
