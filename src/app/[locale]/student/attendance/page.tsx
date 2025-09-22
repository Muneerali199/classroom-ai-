"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";

export default function StudentAttendancePage() {
  const { toast } = useToast();
  const supabase = useMemo(() => getSupabase(), []);
  const [records, setRecords] = useState<any[]>([]);

  const fetchAttendance = async () => {
    const user = await AuthService.getCurrentUser();
    if (!user) return;
    const { data, error } = await (supabase as any)
      .from('session_attendance_records')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    if (!error) setRecords(data || []);
  };

  useEffect(() => {
    fetchAttendance();
    const sub = supabase
      .channel('rt-student-attendance')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'session_attendance_records' }, () => {
        fetchAttendance();
        toast({ title: 'Attendance Updated', description: 'Your attendance has been updated.' });
      })
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [supabase]);

  return (
    <div className="space-y-6">
      <Card className="neo-surface">
        <CardHeader>
          <CardTitle className="text-gray-800">My Attendance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.length === 0 ? (
            <div className="text-sm text-gray-500">No attendance records yet.</div>
          ) : (
            records.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 neumorphic-sm-inset rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">Session: {r.session_id}</div>
                  <div className="text-xs text-gray-500">Marked at {new Date(r.created_at).toLocaleString()}</div>
                </div>
                <div className={`neumorphic-sm px-3 py-1 rounded-full text-xs font-medium ${r.status === 'present' ? 'text-green-700' : 'text-yellow-700'}`}>
                  {r.status || 'present'}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
