"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, Upload, CheckCircle2, Clock, AlertCircle, 
  FileText, Calendar, Loader2, Download 
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  subject_name: string | null;
  file_url: string | null;
  file_type: string | null;
  max_score: number;
  created_at: string;
  submission?: Submission;
}

interface Submission {
  id: string;
  submission_text: string | null;
  file_url: string | null;
  status: 'submitted' | 'graded' | 'late' | 'missing';
  score: number | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
}

export default function StudentAssignments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState<Record<string, string>>({});
  const [submissionFiles, setSubmissionFiles] = useState<Record<string, File | null>>({});

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();

      // Get student ID
      const { data: studentData } = await (supabase as any)
        .from('students')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!studentData) return;

      // Fetch all assignments
      const { data: assignmentsData, error } = await (supabase as any)
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch submissions for these assignments
      const assignmentIds = assignmentsData?.map((a: any) => a.id) || [];
      const { data: submissionsData } = await (supabase as any)
        .from('assignment_submissions')
        .select('*')
        .in('assignment_id', assignmentIds)
        .eq('student_id', studentData.id);

      // Merge submissions with assignments
      const mergedData = assignmentsData?.map((assignment: any) => ({
        ...assignment,
        submission: submissionsData?.find((s: any) => s.assignment_id === assignment.id)
      })) || [];

      setAssignments(mergedData);
    } catch (error: any) {
      console.error('Error fetching assignments:', error);
      toast({
        title: "Error",
        description: "Failed to load assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAssignments();

      // Real-time subscription
      const supabase = getSupabase();
      const channel = supabase
        .channel('assignments-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'assignments'
        }, fetchAssignments)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const submitAssignment = async (assignmentId: string) => {
    try {
      setSubmitting(assignmentId);
      const supabase = getSupabase();

      // Get student ID
      const { data: studentData } = await (supabase as any)
        .from('students')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!studentData) throw new Error('Student not found');

      // Upload file if present
      let fileUrl = null;
      let fileType = null;
      let filePath = null;

      const file = submissionFiles[assignmentId];
      if (file) {
        const fileName = `${studentData.id}/${Date.now()}_${file.name}`;
        
        const { data: uploadData, error: uploadError } = await (supabase as any)
          .storage
          .from('assignments')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false
          });

        if (uploadError) {
          console.warn('File upload failed:', uploadError);
        } else if (uploadData) {
          filePath = uploadData.path;
          const { data: signedData } = await (supabase as any)
            .storage
            .from('assignments')
            .createSignedUrl(uploadData.path, 60 * 60 * 24 * 7); // 7 days
          fileUrl = signedData?.signedUrl;
          fileType = file.type;
        }
      }

      // Create submission
      const { error: submissionError } = await (supabase as any)
        .from('assignment_submissions')
        .insert({
          assignment_id: assignmentId,
          student_id: studentData.id,
          submission_text: submissionText[assignmentId] || null,
          file_url: fileUrl,
          file_type: fileType,
          file_path: filePath,
          status: 'submitted',
          submitted_at: new Date().toISOString()
        });

      if (submissionError) throw submissionError;

      toast({
        title: "Success!",
        description: "Assignment submitted successfully",
      });

      // Clear form
      setSubmissionText(prev => ({ ...prev, [assignmentId]: '' }));
      setSubmissionFiles(prev => ({ ...prev, [assignmentId]: null }));

      // Refresh assignments
      fetchAssignments();
    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const getStatus = (assignment: Assignment) => {
    if (assignment.submission) {
      return assignment.submission.status;
    }
    if (assignment.due_date && new Date(assignment.due_date) < new Date()) {
      return 'missing';
    }
    return 'pending';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-500/20 border-blue-500/30 text-blue-400">Submitted</Badge>;
      case 'graded':
        return <Badge className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400">Graded</Badge>;
      case 'late':
        return <Badge className="bg-orange-500/20 border-orange-500/30 text-orange-400">Late</Badge>;
      case 'missing':
        return <Badge className="bg-red-500/20 border-red-500/30 text-red-400">Missing</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30 text-gray-400">Pending</Badge>;
    }
  };

  const pendingAssignments = assignments.filter(a => !a.submission);
  const submittedAssignments = assignments.filter(a => a.submission);

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 shadow-2xl">
      <CardHeader className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="text-white">My Assignments</div>
            <p className="text-xs font-normal text-gray-400 mt-0.5">
              View and submit your assignments
            </p>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent p-0">
            <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent text-gray-400 data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent data-[state=active]:text-white">
              Pending ({pendingAssignments.length})
            </TabsTrigger>
            <TabsTrigger value="submitted" className="rounded-none border-b-2 border-transparent text-gray-400 data-[state=active]:border-cyan-500 data-[state=active]:bg-transparent data-[state=active]:text-white">
              Submitted ({submittedAssignments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="p-4 space-y-4">
            {pendingAssignments.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-gray-400">All caught up!</p>
                <p className="text-xs text-gray-500 mt-1">No pending assignments</p>
              </div>
            ) : (
              pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">{assignment.title}</CardTitle>
                        {assignment.description && (
                          <p className="text-sm text-gray-400 mt-2">{assignment.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {assignment.subject_name && (
                            <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                              <FileText className="h-3 w-3 mr-1" />
                              {assignment.subject_name}
                            </Badge>
                          )}
                          {assignment.due_date && (
                            <Badge variant="outline" className={cn(
                              "bg-blue-500/10 border-blue-500/30 text-blue-400",
                              new Date(assignment.due_date) < new Date() && "bg-red-500/10 border-red-500/30 text-red-400"
                            )}>
                              <Calendar className="h-3 w-3 mr-1" />
                              Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </Badge>
                          )}
                          {getStatusBadge(getStatus(assignment))}
                        </div>
                        {assignment.file_url && (
                          <Button variant="outline" size="sm" className="mt-3 bg-white/5 border-white/20 text-white hover:bg-white/10" asChild>
                            <a href={assignment.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-3 w-3 mr-1" />
                              Download Attachment
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="border-t border-white/10 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 space-y-4">
                    <div>
                      <Label htmlFor={`text-${assignment.id}`} className="text-gray-300">Your Response</Label>
                      <Textarea
                        id={`text-${assignment.id}`}
                        placeholder="Write your answer here..."
                        value={submissionText[assignment.id] || ''}
                        onChange={(e) => setSubmissionText(prev => ({ 
                          ...prev, 
                          [assignment.id]: e.target.value 
                        }))}
                        rows={4}
                        className="mt-2 bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`file-${assignment.id}`} className="text-gray-300">Attach File (Optional)</Label>
                      <Input
                        id={`file-${assignment.id}`}
                        type="file"
                        onChange={(e) => setSubmissionFiles(prev => ({
                          ...prev,
                          [assignment.id]: e.target.files?.[0] || null
                        }))}
                        className="mt-2 bg-white/5 border-white/20 text-white file:text-white focus:border-cyan-500"
                      />
                      {submissionFiles[assignment.id] && (
                        <p className="text-xs text-gray-400 mt-1">
                          Selected: {submissionFiles[assignment.id]?.name}
                        </p>
                      )}
                    </div>

                    <Button
                      onClick={() => submitAssignment(assignment.id)}
                      disabled={submitting === assignment.id || (!submissionText[assignment.id] && !submissionFiles[assignment.id])}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold shadow-lg shadow-cyan-500/25"
                    >
                      {submitting === assignment.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Assignment
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="submitted" className="p-4 space-y-4">
            {submittedAssignments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-cyan-500 mx-auto mb-3 opacity-50" />
                <p className="text-sm text-gray-400">No submissions yet</p>
                <p className="text-xs text-gray-500 mt-1">Start submitting your assignments</p>
              </div>
            ) : (
              submittedAssignments.map((assignment) => (
                <Card key={assignment.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">{assignment.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {assignment.subject_name && (
                            <Badge variant="outline" className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400">{assignment.subject_name}</Badge>
                          )}
                          {getStatusBadge(assignment.submission!.status)}
                          {assignment.submission?.score !== null && assignment.submission?.score !== undefined && (
                            <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400">
                              Score: {assignment.submission?.score}/{assignment.max_score}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {assignment.submission?.submission_text && (
                      <div>
                        <Label className="text-xs text-gray-300">Your Submission:</Label>
                        <p className="text-sm bg-white/5 border border-white/10 text-gray-300 p-3 rounded-lg mt-1">
                          {assignment.submission.submission_text}
                        </p>
                      </div>
                    )}

                    {assignment.submission?.file_url && (
                      <Button variant="outline" size="sm" className="bg-white/5 border-white/20 text-white hover:bg-white/10" asChild>
                        <a href={assignment.submission.file_url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-1" />
                          View Submission
                        </a>
                      </Button>
                    )}

                    {assignment.submission?.feedback && (
                      <div className="border-t border-white/10 pt-3">
                        <Label className="text-xs text-gray-300">Teacher Feedback:</Label>
                        <p className="text-sm text-gray-400 mt-1">
                          {assignment.submission.feedback}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-4 text-xs text-gray-500 border-t border-white/10 pt-3">
                      <div>
                        <Clock className="h-3 w-3 inline mr-1" />
                        Submitted: {new Date(assignment.submission!.submitted_at).toLocaleString()}
                      </div>
                      {assignment.submission?.graded_at && (
                        <div>
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                          Graded: {new Date(assignment.submission.graded_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
