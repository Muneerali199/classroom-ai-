"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, PlusCircle } from "lucide-react";

export default function TeacherAssignmentsPanel() {
  const { toast } = useToast();
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

  const fetchAssignments = async () => {
    try {
      setListLoading(true);
      const res = await fetch("/api/assignments");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (e) {}
    finally { setListLoading(false); }
  };

  useEffect(() => {
    fetchAssignments();
    // subjects dropdown
    (async () => {
      try {
        const { data } = await (getSupabase() as any).from('subjects').select('id,name').order('name');
        setSubjects(data || []);
      } catch {}
    })();
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
      const fd = new FormData();
      fd.append("title", title);
      if (description) fd.append("description", description);
      if (dueDate) fd.append("due_date", dueDate);
      if (subjectId) fd.append("subject_id", subjectId);
      if (file) fd.append("file", file);
      const res = await fetch("/api/assignments", { method: "POST", body: fd });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to create assignment");
      }
      setTitle("");
      setDescription("");
      setDueDate("");
      setSubjectId("");
      setFile(null);
      toast({ title: "Assignment created" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Create Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2 sm:col-span-2">
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Chapter 5 Worksheet" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Instructions or notes" rows={3}/>
            </div>
            <div className="space-y-2">
              <Label>Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <select className="w-full border rounded-md h-9 px-2"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">Select subject</option>
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Attachment (image/PDF/any)</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <UploadCloud className="w-4 h-4 mr-2"/>}
                Publish Assignment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="neo-surface">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-gray-800">Latest Assignments</CardTitle>
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
