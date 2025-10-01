"use client";

import { useEffect, useState } from "react";
import { Bell, X, CheckCheck, BookOpen, GraduationCap, Calendar, Megaphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  student_id: string;
  assignment_id: string | null;
  title: string;
  message: string;
  type: 'assignment' | 'grade' | 'attendance' | 'announcement' | 'timetable';
  is_read: boolean;
  created_at: string;
}

interface StudentNotificationsProps {
  variant?: 'full' | 'compact';
  maxHeight?: string;
}

export default function StudentNotifications({ variant = 'full', maxHeight = '400px' }: StudentNotificationsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const supabase = getSupabase();
      
      // Get student record to find student_id
      const { data: studentData } = await (supabase as any)
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!studentData) {
        console.log('No student record found');
        setLoading(false);
        return;
      }

      // Fetch notifications
      const { data, error } = await (supabase as any)
        .from('student_notifications')
        .select('*')
        .eq('student_id', studentData.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data || []);
        setUnreadCount(data?.filter((n: Notification) => !n.is_read).length || 0);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const supabase = getSupabase();
    const channel = supabase
      .channel('notifications-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_notifications'
      }, (payload) => {
        console.log('Notification change:', payload);
        fetchNotifications();
        
        // Show toast for new notifications
        if (payload.eventType === 'INSERT') {
          const newNotif = payload.new as Notification;
          toast({
            title: newNotif.title,
            description: newNotif.message,
            duration: 5000,
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (notificationId: number) => {
    try {
      const supabase = getSupabase();
      await (supabase as any)
        .from('student_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const supabase = getSupabase();
      
      const { data: studentData } = await (supabase as any)
        .from('students')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (studentData) {
        await (supabase as any)
          .from('student_notifications')
          .update({ is_read: true })
          .eq('student_id', studentData.id)
          .eq('is_read', false);

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        toast({
          title: "All notifications marked as read",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const supabase = getSupabase();
      await (supabase as any)
        .from('student_notifications')
        .delete()
        .eq('id', notificationId);

      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      toast({
        title: "Notification deleted",
        duration: 2000,
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <BookOpen className="h-4 w-4" />;
      case 'grade':
        return <GraduationCap className="h-4 w-4" />;
      case 'attendance':
        return <CheckCheck className="h-4 w-4" />;
      case 'timetable':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Megaphone className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'assignment':
        return 'from-blue-500 to-cyan-500';
      case 'grade':
        return 'from-green-500 to-emerald-500';
      case 'attendance':
        return 'from-orange-500 to-amber-500';
      case 'timetable':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 border-0">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="huly-card">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                Notifications
                {unreadCount > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <p className="text-xs font-normal text-muted-foreground mt-0.5">
                Stay updated with your assignments and classes
              </p>
            </div>
          </CardTitle>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">You'll be notified about assignments and updates here</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-xl border transition-all duration-200 hover:shadow-md group",
                    notification.is_read
                      ? "bg-card border-border/30"
                      : "bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30"
                  )}
                  onClick={() => !notification.is_read && markAsRead(notification.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${getTypeColor(notification.type)}`}>
                      {getIcon(notification.type)}
                      <span className="text-white">{getIcon(notification.type)}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm leading-tight mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleDateString()} at{' '}
                          {new Date(notification.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
