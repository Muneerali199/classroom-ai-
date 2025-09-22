"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Video, Loader2, Filter } from "lucide-react";

interface Meeting { id: string; title: string; description?: string; start_time: string; subject_id?: string; room_url: string; }

export default function MeetingsHub({ viewOnly = false }: { viewOnly?: boolean }) {

  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState<string>(new Date().toISOString().slice(0,16));
  const [subjectId, setSubjectId] = useState("");
  const [roomUrl, setRoomUrl] = useState("");
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [filterSubject, setFilterSubject] = useState<string>("");
  const [filterSoon, setFilterSoon] = useState<boolean>(false);

  const supabase = useMemo(() => getSupabase(), []);

  const fetchMeetings = async () => {
    try {
      setListLoading(true);
      const url = filterSubject ? `/api/meetings?subject_id=${encodeURIComponent(filterSubject)}` : '/api/meetings';
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setMeetings(data);
    } catch {}
    finally { setListLoading(false); }
  };

  useEffect(() => {
    fetchMeetings();
    // load subjects for dropdowns
    (async () => {
      try {
        const { data } = await (getSupabase() as any).from('subjects').select('id,name').order('name');
        setSubjects(data || []);
      } catch {}
    })();
    const ch = supabase
      .channel('rt-meetings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => {
        fetchMeetings();
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Meetings Updated', message: 'New or updated meeting', ts: Date.now() } }));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase]);

  // Re-apply filter when filterSubject changes
  useEffect(() => { fetchMeetings(); }, [filterSubject]);

  const filteredMeetings = useMemo(() => {
    let m = meetings;
    if (filterSoon) {
      const now = Date.now();
      const cutoff = now + 60 * 60 * 1000; // next 60 minutes
      m = m.filter(x => new Date(x.start_time).getTime() <= cutoff && new Date(x.start_time).getTime() >= now);
    }
    return m;
  }, [meetings, filterSoon]);

  const startingSoon = useMemo(() => {
    const now = Date.now();
    const soonCutoff = now + 10 * 60 * 1000; // 10 minutes
    const soon = meetings
      .filter(x => {
        const t = new Date(x.start_time).getTime();
        return t >= now && t <= soonCutoff;
      })
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    return soon[0] || null;
  }, [meetings]);

  // Header toast for starting soon meeting (<=10m), deduped
  useEffect(() => {
    const id = setInterval(() => {
      if (!startingSoon) return;
      const key = `mtg-toast-${startingSoon.id}-${startingSoon.start_time}`;
      if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
        localStorage.setItem(key, '1');
        const msg = `${startingSoon.title} at ${new Date(startingSoon.start_time).toLocaleTimeString()}`;
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Meeting starting soon', message: msg, ts: Date.now() } }));
      }
    }, 30 * 1000); // check every 30s
    return () => clearInterval(id);
  }, [startingSoon]);

  const createMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = {
        title,
        description,
        start_time: new Date(startTime).toISOString(),
        subject_id: subjectId || undefined,
        room_url: roomUrl || undefined,
      };
      const res = await fetch('/api/meetings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Failed to create meeting');
      }
      setTitle(""); setDescription(""); setSubjectId(""); setRoomUrl("");
      toast({ title: 'Meeting created' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {!viewOnly && (
        <Card className="neo-surface">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2"><Video className="w-4 h-4"/> Create Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={createMeeting}>
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Algebra Live Session" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Agenda and notes" rows={3}/>
              </div>
              <div className="space-y-2">
                <Label>Start time</Label>
                <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <select className="w-full border rounded-md h-9 px-2" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                  <option value="">Select subject</option>
                  {subjects.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Room URL (optional, leave blank to auto-generate Jitsi)</Label>
                <Input value={roomUrl} onChange={(e) => setRoomUrl(e.target.value)} placeholder="https://meet.jit.si/your-room" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : null}Create</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4"/> Upcoming Meetings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {startingSoon && (
            <div className="p-3 rounded-xl border border-yellow-300 bg-yellow-50 text-yellow-800 text-sm">
              Starting soon: <strong>{startingSoon.title}</strong> at {new Date(startingSoon.start_time).toLocaleTimeString()}.
              <Button size="sm" className="ml-2" onClick={() => setActiveRoom(startingSoon.room_url)}>Join now</Button>
            </div>
          )}
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Filter className="w-4 h-4"/> Filters</div>
            <select className="border rounded-md h-9 px-2" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="">All subjects</option>
              {subjects.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={filterSoon} onChange={(e) => setFilterSoon(e.target.checked)} /> Starting soon (≤ 60m)
            </label>
          </div>

          {listLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-3 neumorphic-sm-inset rounded-lg">
                  <div className="h-4 bg-gray-300/60 rounded w-44 mb-2" />
                  <div className="h-3 bg-gray-200/60 rounded w-72" />
                </div>
              ))}
            </>
          ) : filteredMeetings.length === 0 ? (
            <div className="text-sm text-gray-500">No upcoming meetings.</div>
          ) : (
            filteredMeetings.map(m => (
              <div key={m.id} className="p-3 neumorphic-sm-inset rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{m.title}</div>
                    <div className="text-xs text-gray-500">{new Date(m.start_time).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setActiveRoom(m.room_url); window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Joining Meeting', message: m.title, ts: Date.now() } })); }}>Join</Button>
                    <a className="text-sm text-blue-600 underline px-2 py-1" href={m.room_url} target="_blank">Open</a>
                  </div>
                </div>
                {activeRoom === m.room_url && (
                  <div className="mt-3 aspect-video rounded-xl overflow-hidden border">
                    <iframe src={m.room_url} className="w-full h-full" allow="camera; microphone; fullscreen; display-capture; clipboard-read; clipboard-write" />
                  </div>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
