"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus, Loader2 } from "lucide-react";

export default function TeacherTimetablePanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [subjectId, setSubjectId] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [listLoading, setListLoading] = useState(true);
  const [weekTag, setWeekTag] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("");

  const fetchTimetables = async () => {
    try {
      setListLoading(true);
      const res = await fetch('/api/timetables');
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch {}
    finally { setListLoading(false); }
  };

  useEffect(() => {
    fetchTimetables();
    (async () => {
      try {
        const { data } = await (getSupabase() as any).from('subjects').select('id,name').order('name');
        setSubjects(data || []);
      } catch {}
    })();
    const supabase = getSupabase();
    const ch = supabase
      .channel('rt-timetables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timetables' }, () => {
        fetchTimetables();
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Timetable Updated', message: 'A timetable was added or changed', ts: Date.now() } }));
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const fd = new FormData();
      if (subjectId) fd.append('subject_id', subjectId);
      const finalNotes = weekTag ? `[${weekTag}] ${notes || ''}`.trim() : notes;
      if (finalNotes) fd.append('notes', finalNotes);
      if (file) fd.append('file', file);
      const res = await fetch('/api/timetables', { method: 'POST', body: fd });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Failed to create timetable');
      }
      setSubjectId('');
      setNotes('');
      setFile(null);
      toast({ title: 'Timetable published' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2"><CalendarPlus className="w-4 h-4"/> Publish Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
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
            <div className="space-y-2">
              <Label>Week Tag (optional)</Label>
              <Input value={weekTag} onChange={(e) => setWeekTag(e.target.value)} placeholder="e.g., Week 39" />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g., Week 39 schedule" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Attachment (image/PDF)</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}Publish</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="neo-surface">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="text-gray-800">Latest Timetables</CardTitle>
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
            <div className="text-sm text-gray-500">No timetables yet.</div>
          ) : (
            items.filter((t) => !subjectFilter || t.subject_id === subjectFilter).map((t) => (
              <div key={t.id} className="p-3 neumorphic-sm-inset rounded-lg">
                <div className="font-medium text-gray-800">{t.notes || 'Weekly Timetable'}</div>
                {t.file_url ? (
                  t.file_type === 'application/pdf' ? (
                    <iframe src={t.file_url} className="mt-2 w-full h-56 rounded-md" />
                  ) : (
                    <img src={t.file_url} className="mt-2 h-40 rounded-md object-cover" />
                  )
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
