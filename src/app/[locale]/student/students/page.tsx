"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "@/lib/auth";

interface SubjectItem { id: string; name: string; code?: string }

export default function StudentCoursesPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const user = await AuthService.getCurrentUser();
      if (!user) return;
      const { data: enr } = await (supabase as any)
        .from('subject_enrollments')
        .select('subject_id')
        .eq('student_id', user.id);
      const ids = (enr || []).map((e: any) => e.subject_id);
      if (ids.length === 0) { setSubjects([]); setCounts({}); return; }
      const { data: subs } = await (supabase as any)
        .from('subjects')
        .select('id,name,code')
        .in('id', ids)
        .order('name');
      setSubjects((subs || []) as SubjectItem[]);
      // Fetch assignment counts per subject via API
      const pairs = await Promise.all((subs || []).map(async (s: any) => {
        const res = await fetch(`/api/assignments?subject_id=${encodeURIComponent(s.id)}`);
        const list = res.ok ? await res.json() : [];
        return [s.id, Array.isArray(list) ? list.length : 0] as const;
      }));
      const map: Record<string, number> = {};
      pairs.forEach(([id, c]) => { map[id] = c; });
      setCounts(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    const ch = supabase
      .channel('rt-student-enrollments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subject_enrollments' }, () => {
        fetchEnrollments();
      })
      .subscribe();
    const ch2 = supabase
      .channel('rt-assignments-counts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        fetchEnrollments();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); supabase.removeChannel(ch2); };
  }, [supabase]);

  return (
    <div className="space-y-6">
      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800">My Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse p-3 neumorphic-sm-inset rounded-lg">
                  <div className="h-4 bg-gray-300/60 rounded w-52 mb-2" />
                  <div className="h-3 bg-gray-200/60 rounded w-44" />
                </div>
              ))}
            </>
          ) : subjects.length === 0 ? (
            <div className="text-sm text-gray-500">You are not enrolled in any subjects yet.</div>
          ) : (
            subjects.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{s.name}</div>
                  <div className="text-xs text-gray-500">{s.code || '—'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600">Assignments</div>
                  <div className="neumorphic-sm px-3 py-1 rounded-full text-xs font-medium mt-1 text-gray-700">{counts[s.id] ?? 0}</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}