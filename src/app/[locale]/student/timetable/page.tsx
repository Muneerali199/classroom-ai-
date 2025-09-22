"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // Mon=0
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export default function StudentTimetablePage() {
  const supabase = useMemo(() => getSupabase(), []);
  const [items, setItems] = useState<any[]>([]);

  const fetchTimetables = async () => {
    const res = await fetch('/api/timetables');
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    }
  };

  useEffect(() => {
    fetchTimetables();
    const ch = supabase
      .channel('rt-student-timetables')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timetables' }, () => {
        fetchTimetables();
        window.dispatchEvent(new CustomEvent('notify', { detail: { title: 'Timetable Updated', message: 'New or updated timetable', ts: Date.now() } }));
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase]);

  const weekStart = startOfWeek();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-6">
      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800">My Timetable (This Week)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {days.map((d, idx) => (
              <div key={idx} className="p-3 neumorphic-sm-inset rounded-xl">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <div className="text-xs text-gray-500">No items</div>
                  ) : (
                    items.map((t) => (
                      <div key={t.id} className="text-xs">
                        <div className="font-semibold text-gray-700">{t.notes || 'Weekly Timetable'}</div>
                        {t.file_url ? (
                          t.file_type === 'application/pdf' ? (
                            <iframe src={t.file_url} className="mt-2 w-full h-40 rounded-md" />
                          ) : (
                            <img src={t.file_url} className="mt-2 h-28 w-full rounded-md object-cover" />
                          )
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
