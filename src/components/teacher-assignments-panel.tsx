"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, PlusCircle } from "lucide-react";

export default function TeacherAssignmentsPanel() {
  const { toast } = useToast();
  const t = useTranslations('TeacherDashboard');
  const tCommon = useTranslations('Common');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [listLoading, setListLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState<string>("");
  const [showCustomSubject, setShowCustomSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);

  const fetchAssignments = async () => {
    try {
      setListLoading(true);
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) {}
    finally { setListLoading(false); }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await (getSupabase() as any).from('subjects').select('id,name').order('name');
      setSubjects(data || []);
    } catch {}
  };

  const createCustomSubject = async () => {
    if (!customSubjectName.trim()) return;
    
    try {
      setCreatingSubject(true);
      const supabase = getSupabase();
      const { data, error } = await (supabase as any)
        .from('subjects')
        .insert({ 
          name: customSubjectName.trim(),
          id: crypto.randomUUID()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchSubjects();
      setSubjectId(data.id);
      setCustomSubjectName("");
      setShowCustomSubject(false);
      toast({ title: "Subject created", description: `${customSubjectName} has been added` });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setCreatingSubject(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
    const supabase = getSupabase();
    const ch = supabase
      .channel("rt-assignments-panel")
      .on("postgres_changes", { event: "*", schema: "public", table: "assignments" }, () => {
        fetchAssignments();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast({ title: "Missing title", description: "Please provide a title" });
      return;
    }
    try {
      setLoading(true);
      
      // Handle recommended subjects (create them if they don't exist)
      let finalSubjectId = subjectId;
      const recommendedSubjects: Record<string, string> = {
        'math': 'Mathematics',
        'english': 'English',
        'science': 'Science', 
        'history': 'History',
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'biology': 'Biology',
        'computer': 'Computer Science'
      };
      
      if (recommendedSubjects[subjectId]) {
        // Check if subject already exists
        const existingSubject = subjects.find(s => s.name === recommendedSubjects[subjectId]);
        if (existingSubject) {
          finalSubjectId = existingSubject.id;
        } else {
          // Create the recommended subject
          const supabase = getSupabase();
          const newSubjectId = crypto.randomUUID();
          const { error } = await (supabase as any)
            .from('subjects')
            .insert({ 
              id: newSubjectId,
              name: recommendedSubjects[subjectId]
            });
          
          if (!error) {
            finalSubjectId = newSubjectId;
            await fetchSubjects(); // Refresh subjects list
          }
        }
      }
      
      const fd = new FormData();
      fd.append("title", title);
      if (description) fd.append("description", description);
      if (dueDate) fd.append("due_date", dueDate);
      if (finalSubjectId) fd.append("subject_id", finalSubjectId);
      if (file) fd.append("file", file);
      const res = await fetch("/api/assignments", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to create assignment");
      }
      
      const assignmentData = await res.json();
      
      // Send notifications to students
      try {
        const subjectName = subjects.find(s => s.id === finalSubjectId)?.name || 
                           recommendedSubjects[subjectId] || '';
        
        await fetch("/api/assignments/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignment_id: assignmentData.id,
            title: title,
            subject_name: subjectName
          })
        });
      } catch (notifError) {
        console.error('Failed to send notifications:', notifError);
        // Don't fail the main operation
      }
      
      setTitle("");
      setDescription("");
      setDueDate("");
      setSubjectId("");
      setFile(null);
      toast({ title: tCommon('success'), description: "Students have been notified" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="huly-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2"><PlusCircle className="w-4 h-4"/> {tCommon('create')} {tCommon('assignments')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2 sm:col-span-2">
              <Label>{tCommon('title')}</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 5 Worksheet" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>{tCommon('description')}</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Instructions or notes" rows={3}/>
            </div>
            <div className="space-y-2">
              <Label>Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              {!showCustomSubject ? (
                <div className="space-y-2">
                  <select className="w-full border rounded-md h-9 px-2"
                          value={subjectId}
                          onChange={(e) => setSubjectId(e.target.value)}>
                    <option value="">Select subject</option>
                    <optgroup label="Your Subjects">
                      {subjects.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Recommended Subjects">
                      <option value="math">Mathematics</option>
                      <option value="english">English</option>
                      <option value="science">Science</option>
                      <option value="history">History</option>
                      <option value="physics">Physics</option>
                      <option value="chemistry">Chemistry</option>
                      <option value="biology">Biology</option>
                      <option value="computer">Computer Science</option>
                    </optgroup>
                  </select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowCustomSubject(true)}
                    className="w-full"
                  >
                    + Create New Subject
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    value={customSubjectName}
                    onChange={(e) => setCustomSubjectName(e.target.value)}
                    placeholder="Enter subject name (e.g., Advanced Physics)"
                    onKeyDown={(e) => e.key === 'Enter' && createCustomSubject()}
                  />
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={createCustomSubject}
                      disabled={!customSubjectName.trim() || creatingSubject}
                    >
                      {creatingSubject ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setShowCustomSubject(false);
                        setCustomSubjectName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Attachment (image/PDF/any)</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <UploadCloud className="w-4 h-4 mr-2"/>}
                {tCommon('publish')} {tCommon('assignments')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="huly-card">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-foreground">{tCommon('recent')} {tCommon('assignments')}</CardTitle>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Subject</label>
              <select className="border rounded-md h-9 px-2" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                <option value="">All</option>
                {subjects.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {listLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-3 neumorphic-sm-inset rounded-lg">
                  <div className="h-4 bg-gray-300/60 rounded w-44 mb-2" />
                  <div className="h-3 bg-gray-200/60 rounded w-72" />
                </div>
              ))}
            </>
          ) : items.length === 0 ? (
            <div className="text-sm text-gray-500">No assignments yet.</div>
          ) : (
            items.filter((a) => !subjectFilter || a.subject_id === subjectFilter).map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.subject_name || '—'}{a.dueDate ? ` • Due ${a.dueDate}` : ''}</div>
                  {a.file_url && (
                    a.file_type?.startsWith("image/") ? (
                      <img src={a.file_url} alt={a.title} className="mt-2 h-24 rounded-md object-cover" />
                    ) : a.file_type === 'application/pdf' ? (
                      <iframe src={a.file_url} className="mt-2 w-full h-48 rounded-md" />
                    ) : (
                      <a href={a.file_url} target="_blank" className="mt-2 text-xs text-blue-600 underline block">Open attachment</a>
                    )
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
