"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Camera, 
  QrCode, 
  AlertTriangle,
  TrendingDown,
  Users,
  Eye,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  UserCheck,
  Zap,
  Loader2
} from "lucide-react";

interface AttendanceAnomaly {
  id: string;
  studentName: string;
  studentId: string;
  type: 'proxy' | 'sudden_drop' | 'pattern_change' | 'suspicious_timing';
  severity: 'high' | 'medium' | 'low';
  description: string;
  detectedAt: string;
  confidence: number;
  recommendation: string;
}

interface AttendanceAnalytics {
  totalStudents: number;
  presentToday: number;
  averageAttendance: number;
  trendDirection: 'up' | 'down' | 'stable';
  anomaliesDetected: number;
  lastUpdated: string;
}

interface StudentAttendancePattern {
  studentId: string;
  studentName: string;
  attendanceRate: number;
  trend: 'improving' | 'declining' | 'stable';
  lastSeen: string;
  riskLevel: 'high' | 'medium' | 'low';
  patterns: string[];
}

export default function AISmartAttendance() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [scanningMode, setScanningMode] = useState<'face' | 'qr' | null>(null);
  const [anomalies, setAnomalies] = useState<AttendanceAnomaly[]>([]);
  const [analytics, setAnalytics] = useState<AttendanceAnalytics | null>(null);
  const [studentPatterns, setStudentPatterns] = useState<StudentAttendancePattern[]>([]);

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const loadAttendanceData = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockAnalytics: AttendanceAnalytics = {
      totalStudents: 45,
      presentToday: 38,
      averageAttendance: 84.4,
      trendDirection: 'down',
      anomaliesDetected: 3,
      lastUpdated: new Date().toISOString()
    };

    const mockAnomalies: AttendanceAnomaly[] = [
      {
        id: "1",
        studentName: "Alex Johnson",
        studentId: "ST001",
        type: 'proxy',
        severity: 'high',
        description: "Facial recognition confidence below threshold (45%). Possible proxy attendance.",
        detectedAt: new Date().toISOString(),
        confidence: 45,
        recommendation: "Verify identity manually and investigate attendance pattern"
      },
      {
        id: "2",
        studentName: "Sarah Chen",
        studentId: "ST002", 
        type: 'sudden_drop',
        severity: 'medium',
        description: "Attendance dropped from 95% to 60% in the last 2 weeks.",
        detectedAt: new Date().toISOString(),
        confidence: 89,
        recommendation: "Schedule one-on-one meeting to discuss attendance issues"
      },
      {
        id: "3",
        studentName: "Mike Rodriguez",
        studentId: "ST003",
        type: 'pattern_change',
        severity: 'low',
        description: "Unusual attendance timing - arriving 15 minutes later than usual pattern.",
        detectedAt: new Date().toISOString(),
        confidence: 72,
        recommendation: "Monitor for transportation or schedule conflicts"
      }
    ];

    const mockPatterns: StudentAttendancePattern[] = [
      {
        studentId: "ST001",
        studentName: "Alex Johnson",
        attendanceRate: 65,
        trend: 'declining',
        lastSeen: "2 days ago",
        riskLevel: 'high',
        patterns: ["Frequently absent on Mondays", "Late arrivals increasing"]
      },
      {
        studentId: "ST002", 
        studentName: "Sarah Chen",
        attendanceRate: 78,
        trend: 'declining',
        lastSeen: "Today",
        riskLevel: 'medium',
        patterns: ["Recent drop in attendance", "Consistent morning presence"]
      },
      {
        studentId: "ST004",
        studentName: "Emma Wilson",
        attendanceRate: 95,
        trend: 'stable',
        lastSeen: "Today",
        riskLevel: 'low',
        patterns: ["Excellent attendance", "Always punctual"]
      }
    ];

    setAnalytics(mockAnalytics);
    setAnomalies(mockAnomalies);
    setStudentPatterns(mockPatterns);
    setLoading(false);
  };

  const startFaceRecognition = () => {
    setScanningMode('face');
    toast({ title: "Face Recognition Started", description: "AI is scanning for student faces..." });
    
    // Simulate face recognition process
    setTimeout(() => {
      setScanningMode(null);
      toast({ title: "Attendance Marked", description: "3 students identified and marked present" });
    }, 3000);
  };

  const startQRScanning = () => {
    setScanningMode('qr');
    toast({ title: "QR Scanner Active", description: "Students can now scan their QR codes" });
    
    // Simulate QR scanning
    setTimeout(() => {
      setScanningMode(null);
      toast({ title: "QR Attendance Complete", description: "5 students marked present via QR scan" });
    }, 2000);
  };

  const resolveAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
    toast({ title: "Anomaly Resolved", description: "Investigation completed and resolved" });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-green-600 rotate-180" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold text-green-600">
                    {analytics.presentToday}/{analytics.totalStudents}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Attendance</p>
                  <p className="text-2xl font-bold text-blue-600">{analytics.averageAttendance}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Anomalies</p>
                  <p className="text-2xl font-bold text-red-600">{analytics.anomaliesDetected}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Trend</p>
                  <p className={`text-sm font-bold ${analytics.trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {analytics.trendDirection === 'up' ? '↗ Improving' : '↘ Declining'}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Smart Scanning Controls */}
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI-Powered Attendance Scanning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="neumorphic-sm p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Camera className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-800">Face Recognition</h3>
                  <p className="text-sm text-gray-600">AI automatically identifies and marks students</p>
                </div>
              </div>
              <Button 
                onClick={startFaceRecognition} 
                disabled={scanningMode === 'face'}
                className="w-full"
              >
                {scanningMode === 'face' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scanning Faces...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4 mr-2" />
                    Start Face Recognition
                  </>
                )}
              </Button>
            </div>

            <div className="neumorphic-sm p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <QrCode className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-medium text-gray-800">QR Code Scanner</h3>
                  <p className="text-sm text-gray-600">Students scan personal QR codes</p>
                </div>
              </div>
              <Button 
                onClick={startQRScanning} 
                disabled={scanningMode === 'qr'}
                variant="outline"
                className="w-full"
              >
                {scanningMode === 'qr' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    QR Scanner Active...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Activate QR Scanner
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="anomalies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="anomalies">AI Anomaly Detection</TabsTrigger>
          <TabsTrigger value="patterns">Student Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="anomalies" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Attendance Anomalies Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {anomalies.map((anomaly) => (
                <div key={anomaly.id} className="neumorphic-sm-inset p-4 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-800">{anomaly.studentName}</h3>
                        <Badge variant="outline">{anomaly.studentId}</Badge>
                        <Badge className={getSeverityColor(anomaly.severity)}>
                          {anomaly.severity} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{anomaly.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg mb-2">
                        <p className="text-sm text-blue-800">
                          <strong>AI Recommendation:</strong> {anomaly.recommendation}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Confidence: {anomaly.confidence}%</span>
                        <span>Detected: {new Date(anomaly.detectedAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => resolveAnomaly(anomaly.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
              
              {anomalies.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p>No anomalies detected</p>
                  <p className="text-sm">All attendance patterns look normal</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Student Attendance Patterns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentPatterns.map((pattern) => (
                  <div key={pattern.studentId} className="neumorphic-sm p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-800">{pattern.studentName}</h3>
                        {getTrendIcon(pattern.trend)}
                        <span className={`text-sm font-medium ${getRiskColor(pattern.riskLevel)}`}>
                          {pattern.riskLevel} risk
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{pattern.attendanceRate}%</div>
                        <div className="text-xs text-gray-500">attendance rate</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>Last seen: {pattern.lastSeen}</span>
                      <span>Trend: {pattern.trend}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">AI-Detected Patterns:</p>
                      <div className="flex flex-wrap gap-1">
                        {pattern.patterns.map((patternText, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {patternText}
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
