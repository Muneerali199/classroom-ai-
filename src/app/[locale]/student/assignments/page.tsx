"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentAssignmentsPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assignments');
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
    const ch = supabase
      .channel('rt-student-assignments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'assignments' }, () => {
        fetchAssignments();
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Assignments Updated', message: 'New or updated assignment', ts: Date.now() } }));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase]);

  return (
    <div className="space-y-6">
      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800">My Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
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
            items.map((a) => (
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
                <div className="text-right">
                  <div className="text-xs text-gray-600">Status</div>
                  <div className="neumorphic-sm px-3 py-1 rounded-full text-xs font-medium mt-1 text-yellow-700">pending</div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
