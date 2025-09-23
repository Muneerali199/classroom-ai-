"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Youtube, 
  BookOpen, 
  ExternalLink,
  Search,
  TrendingUp,
  Clock,
  Star,
  Play,
  FileText,
  Award
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'course' | 'pdf' | 'quiz' | 'article';
  provider: string;
  url: string;
  duration?: string;
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  tags: string[];
}

interface StudentWeakness {
  subject: string;
  topics: string[];
  severity: 'high' | 'medium' | 'low';
  lastAssessment: string;
}

export default function AIResourceRecommender() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [weaknesses, setWeaknesses] = useState<StudentWeakness[]>([]);
  const [recommendations, setRecommendations] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  useEffect(() => {
    analyzeStudentWeaknesses();
  }, []);

  const analyzeStudentWeaknesses = async () => {
    setLoading(true);
    
    // Simulate AI analysis of student performance
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockWeaknesses: StudentWeakness[] = [
      {
        subject: "Calculus",
        topics: ["Integration by Parts", "Chain Rule", "Limits"],
        severity: 'high',
        lastAssessment: "2025-01-20"
      },
      {
        subject: "Physics",
        topics: ["Electromagnetic Induction", "Wave Mechanics"],
        severity: 'medium',
        lastAssessment: "2025-01-18"
      },
      {
        subject: "Programming",
        topics: ["Recursion", "Data Structures"],
        severity: 'medium',
        lastAssessment: "2025-01-19"
      }
    ];

    setWeaknesses(mockWeaknesses);
    generateRecommendations(mockWeaknesses[0]); // Auto-select first weakness
    setSelectedSubject(mockWeaknesses[0].subject);
    setLoading(false);
  };

  const generateRecommendations = async (weakness: StudentWeakness) => {
    setLoading(true);
    
    // Simulate AI-powered resource recommendation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockRecommendations: Resource[] = [
      {
        id: "1",
        title: "Integration by Parts - Complete Tutorial",
        type: 'video',
        provider: 'Khan Academy',
        url: 'https://youtube.com/watch?v=example1',
        duration: '18 min',
        rating: 4.8,
        difficulty: 'intermediate',
        description: 'Step-by-step guide to mastering integration by parts with multiple examples',
        tags: ['calculus', 'integration', 'tutorial']
      },
      {
        id: "2", 
        title: "Calculus Practice Problems - Integration",
        type: 'quiz',
        provider: 'MIT OpenCourseWare',
        url: 'https://ocw.mit.edu/example',
        duration: '45 min',
        rating: 4.6,
        difficulty: 'intermediate',
        description: 'Interactive practice problems with detailed solutions',
        tags: ['practice', 'calculus', 'problems']
      },
      {
        id: "3",
        title: "Advanced Calculus Techniques",
        type: 'course',
        provider: 'Coursera',
        url: 'https://coursera.org/example',
        duration: '6 weeks',
        rating: 4.7,
        difficulty: 'advanced',
        description: 'Comprehensive course covering advanced integration and differentiation',
        tags: ['course', 'advanced', 'calculus']
      },
      {
        id: "4",
        title: "Chain Rule Explained Simply",
        type: 'video',
        provider: 'YouTube - Professor Leonard',
        url: 'https://youtube.com/watch?v=example2',
        duration: '25 min',
        rating: 4.9,
        difficulty: 'beginner',
        description: 'Clear explanation of the chain rule with visual examples',
        tags: ['chain-rule', 'derivatives', 'beginner']
      },
      {
        id: "5",
        title: "Limits and Continuity - Study Guide",
        type: 'pdf',
        provider: 'Paul\'s Online Math Notes',
        url: 'https://tutorial.math.lamar.edu/example.pdf',
        duration: '30 pages',
        rating: 4.5,
        difficulty: 'intermediate',
        description: 'Comprehensive study guide with examples and practice problems',
        tags: ['limits', 'continuity', 'study-guide']
      },
      {
        id: "6",
        title: "Interactive Calculus Simulator",
        type: 'article',
        provider: 'Desmos',
        url: 'https://desmos.com/calculator',
        duration: 'Interactive',
        rating: 4.8,
        difficulty: 'beginner',
        description: 'Visual calculator to explore calculus concepts interactively',
        tags: ['interactive', 'visual', 'calculator']
      }
    ];

    setRecommendations(mockRecommendations);
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Youtube className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'pdf': return <FileText className="w-4 h-4" />;
      case 'quiz': return <Award className="w-4 h-4" />;
      case 'article': return <ExternalLink className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const openResource = (url: string) => {
    window.open(url, '_blank');
    toast({ title: "Resource opened", description: "Opening in new tab" });
  };

  const filteredRecommendations = recommendations.filter(resource =>
    searchQuery === "" || 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Resource Recommender
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Identified Learning Areas</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {weaknesses.map((weakness, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSubject === weakness.subject 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'neumorphic-sm-inset hover:shadow-md'
                  }`}
                  onClick={() => {
                    setSelectedSubject(weakness.subject);
                    generateRecommendations(weakness);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{weakness.subject}</h4>
                    <Badge className={getSeverityColor(weakness.severity)}>
                      {weakness.severity}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {weakness.topics.slice(0, 2).map((topic, topicIndex) => (
                      <Badge key={topicIndex} variant="outline" className="text-xs mr-1">
                        {topic}
                      </Badge>
                    ))}
                    {weakness.topics.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{weakness.topics.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          {selectedSubject && (
            <div>
              <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recommended Resources for {selectedSubject}
              </h3>
              
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="neumorphic-sm p-4 rounded-lg animate-pulse">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredRecommendations.map((resource) => (
                    <div key={resource.id} className="neumorphic-sm p-4 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{resource.rating}</span>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-800 mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{resource.provider}</p>
                      <p className="text-xs text-gray-500 mb-3">{resource.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getDifficultyColor(resource.difficulty)}>
                            {resource.difficulty}
                          </Badge>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {resource.duration}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => openResource(resource.url)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start Learning
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              {filteredRecommendations.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No resources found</p>
                  <p className="text-sm">Try adjusting your search</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
