"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Brain, FileText, Lightbulb, Download } from "lucide-react";

export default function AILectureSummarizer() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [lectureContent, setLectureContent] = useState("");
  const [summary, setSummary] = useState("");
  const [revisionNotes, setRevisionNotes] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const generateSummary = async () => {
    if (!lectureContent.trim() && !file) {
      toast({ title: "Input required", description: "Please provide lecture content or upload a file" });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate AI processing (replace with actual AI API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = lectureContent || "Uploaded file content";
      
      // Mock AI-generated summary
      const mockSummary = `📚 **Lecture Summary**

**Main Topic:** ${content.split(' ').slice(0, 3).join(' ')} and related concepts

**Key Concepts:**
• Core principles and fundamental theories
• Practical applications and real-world examples  
• Important formulas and methodologies
• Historical context and development

**Learning Objectives Covered:**
✓ Understanding of basic concepts
✓ Application of theoretical knowledge
✓ Problem-solving techniques
✓ Critical thinking development

**Duration:** Estimated 45-60 minutes of content
**Difficulty Level:** Intermediate`;

      const mockRevisionNotes = `🎯 **Quick Revision Notes**

**Must Remember:**
1. **Definition:** Key concept explanation
2. **Formula:** Important equations to memorize
3. **Examples:** 2-3 practical applications
4. **Common Mistakes:** What to avoid in exams

**Quick Facts:**
• Fact 1: Important statistical data
• Fact 2: Historical milestone
• Fact 3: Current applications

**Exam Tips:**
⚡ Focus on understanding rather than memorization
⚡ Practice with real examples
⚡ Review connections between concepts
⚡ Time management during problem-solving

**Related Topics:** Connect with previous lectures on similar subjects`;
      const mockKeyPoints = [
        "Core principles and fundamental theories",
        "Practical applications and real-world examples",
        "Important formulas and methodologies",
        "Historical context and development"
      ];
      
      setSummary(mockSummary);
      setRevisionNotes(mockRevisionNotes);
      setKeyPoints(mockKeyPoints);
      toast({
        title: "AI Summary Generated",
        description: "Your lecture has been successfully summarized using AI!"
      });
    } catch (error: any) {
      console.error('AI Summary Error:', error);
      toast({
        title: "AI Error",
        description: "Failed to generate summary. Please check your AI settings.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadNotes = () => {
    const content = `${summary}\n\n${revisionNotes}\n\nKey Points:\n${keyPoints.map(point => `• ${point}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lecture-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Lecture Summarizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Lecture Content</Label>
            <Textarea
              value={lectureContent}
              onChange={(e) => setLectureContent(e.target.value)}
              placeholder="Paste your lecture notes, transcript, or key points here..."
              rows={6}
              className="resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Or Upload File (PDF, TXT, DOCX)</Label>
            <Input
              type="file"
              accept=".pdf,.txt,.docx,.pptx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button onClick={generateSummary} disabled={loading} className="w-full">
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            Generate AI Summary
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {summary}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card className="neumorphic-card">
            <CardHeader>
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Quick Revision Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {revisionNotes}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {keyPoints.length > 0 && (
        <Card className="neumorphic-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800">Key Points</CardTitle>
              <Button variant="outline" size="sm" onClick={downloadNotes}>
                <Download className="w-4 h-4 mr-2" />
                Download Notes
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3 p-3 neumorphic-sm-inset rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{point}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
