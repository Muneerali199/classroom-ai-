"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Clock, MapPin, BookOpen, RefreshCw, 
  Loader2, Bell, CheckCircle2 
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TimetableEntry {
  id: string;
  title: string;
  day_of_week: number;
  day_name: string;
  start_time: string;
  end_time: string;
  description: string | null;
  subject_name: string | null;
  room_number: string | null;
  room_building: string | null;
  student_id: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function StudentTimetableView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(new Date().getDay());

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();

      // Get student ID
      const { data: studentData } = await (supabase as any)
        .from('students')
        .select('id')
        .eq('auth_user_id', user?.id)
        .single();

      if (!studentData) {
        console.log('No student record found');
        setLoading(false);
        return;
      }

      // Fetch timetable
      const { data, error } = await (supabase as any)
        .from('student_timetable_view')
        .select('*')
        .eq('student_id', studentData.id)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setTimetable(data || []);
    } catch (error: any) {
      console.error('Error fetching timetable:', error);
      toast({
        title: "Error",
        description: "Failed to load timetable",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimetable();

      // Real-time subscription for live updates
      const supabase = getSupabase();
      const channel = supabase
        .channel('student-timetable-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'timetables'
        }, () => {
          console.log('Timetable updated');
          fetchTimetable();
          toast({
            title: "Timetable Updated",
            description: "Your class schedule has been updated",
            duration: 3000,
          });
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'timetable_students'
        }, fetchTimetable)
        .subscribe();

      // Update current day every minute
      const interval = setInterval(() => {
        setCurrentDay(new Date().getDay());
      }, 60000);

      return () => {
        supabase.removeChannel(channel);
        clearInterval(interval);
      };
    }
  }, [user]);

  // Get current time for highlighting
  const getCurrentTimeMinutes = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  };

  const isClassNow = (start: string, end: string) => {
    const currentMinutes = getCurrentTimeMinutes();
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  };

  const isUpcoming = (start: string) => {
    const currentMinutes = getCurrentTimeMinutes();
    const [startHour, startMin] = start.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    return startMinutes > currentMinutes && startMinutes - currentMinutes <= 60;
  };

  // Group by day
  const timetableByDay = DAYS.map((day, index) => ({
    day,
    dayIndex: index,
    isToday: index === currentDay,
    entries: timetable.filter(entry => entry.day_of_week === index)
  }));

  // Get today's classes
  const todayClasses = timetable.filter(entry => entry.day_of_week === currentDay);
  const upcomingClass = todayClasses.find(entry => {
    const [startHour, startMin] = entry.start_time.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    return startMinutes > getCurrentTimeMinutes();
  });

  if (loading) {
    return (
      <Card className="huly-card">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Status Card */}
      <Card className="huly-card border-2 border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Today's Schedule</h3>
              <p className="text-sm text-muted-foreground">
                {DAYS[currentDay]}, {new Date().toLocaleDateString()}
              </p>
              {todayClasses.length > 0 ? (
                <div className="mt-3">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500">
                    {todayClasses.length} classes today
                  </Badge>
                  {upcomingClass && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Bell className="h-4 w-4 text-orange-500" />
                      <span>
                        Next: <strong>{upcomingClass.title}</strong> at {upcomingClass.start_time}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  No classes scheduled today
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTimetable}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Timetable */}
      <Card className="huly-card">
        <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <div>My Weekly Schedule</div>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                View your complete class timetable
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
            {timetableByDay.map(({ day, dayIndex, isToday, entries }) => (
              <Card key={dayIndex} className={cn(
                "border-2 transition-all",
                isToday 
                  ? "border-blue-500 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" 
                  : "border-border",
                entries.length === 0 && "opacity-50"
              )}>
                <CardHeader className={cn(
                  "pb-3",
                  isToday && "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
                )}>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      {day}
                      {isToday && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs">
                          Today
                        </Badge>
                      )}
                    </span>
                    <Badge variant="outline">{entries.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-2">
                  {entries.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No classes
                    </p>
                  ) : (
                    entries.map(entry => {
                      const isNow = isToday && isClassNow(entry.start_time, entry.end_time);
                      const isNext = isToday && isUpcoming(entry.start_time);

                      return (
                        <div
                          key={entry.id}
                          className={cn(
                            "p-3 rounded-lg border transition-all",
                            isNow && "border-green-500 bg-green-500/10 shadow-lg",
                            isNext && "border-orange-500 bg-orange-500/10",
                            !isNow && !isNext && "bg-card hover:shadow-md"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm leading-tight">{entry.title}</h4>
                            {isNow && (
                              <Badge className="bg-green-500 text-xs">Live</Badge>
                            )}
                            {isNext && (
                              <Badge className="bg-orange-500 text-xs">Soon</Badge>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {entry.start_time} - {entry.end_time}
                            </div>
                            {entry.subject_name && (
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {entry.subject_name}
                              </div>
                            )}
                            {entry.room_number && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Room {entry.room_number}
                                {entry.room_building && ` - ${entry.room_building}`}
                              </div>
                            )}
                          </div>

                          {entry.description && (
                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                              {entry.description}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
