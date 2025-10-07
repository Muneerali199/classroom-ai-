"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, Plus, Clock, MapPin, BookOpen, Users, 
  Trash2, Edit, Save, X, Loader2, Bell 
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TimetableEntry {
  id: string;
  title: string;
  subject_id: number | null;
  subject_name?: string;
  room_id: number | null;
  room_number?: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  description: string | null;
  is_active: boolean;
  enrolled_students?: number;
}

interface Subject {
  id: number;
  name: string;
}

interface Room {
  id: number;
  room_number: string;
  building: string;
}

interface Course {
  id: number;
  name: string;
  code: string;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const DEFAULT_COURSES = ['BCA', 'MCA', 'BTech', 'MTech', 'MBA', 'BBA', 'BSc', 'MSc', 'BA', 'MA'];

export default function TimetableManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [courses, setCourses] = useState<string[]>(DEFAULT_COURSES);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // New state for custom add dialogs
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomBuilding, setNewRoomBuilding] = useState('');
  const [newCourseName, setNewCourseName] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subject_id: '',
    room_id: '',
    course: '',
    day_of_week: 1,
    start_time: '09:00',
    end_time: '10:00',
    description: ''
  });

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();

      // Fetch timetable entries
      const { data, error } = await (supabase as any)
        .from('teacher_timetable_view')
        .select('*')
        .eq('teacher_id', user?.id)
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

  const fetchSubjectsAndRooms = async () => {
    try {
      const supabase = getSupabase();

      const [subjectsRes, roomsRes] = await Promise.all([
        (supabase as any).from('subjects').select('id, name').order('name'),
        (supabase as any).from('rooms').select('id, room_number, building').order('room_number')
      ]);

      setSubjects(subjectsRes.data || []);
      setRooms(roomsRes.data || []);
    } catch (error) {
      console.error('Error fetching subjects/rooms:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTimetable();
      fetchSubjectsAndRooms();

      // Real-time subscription
      const supabase = getSupabase();
      const channel = supabase
        .channel('timetable-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'timetables'
        }, fetchTimetable)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      const supabase = getSupabase();

      const payload = {
        title: formData.title,
        subject_id: formData.subject_id ? parseInt(formData.subject_id) : null,
        room_id: formData.room_id ? parseInt(formData.room_id) : null,
        teacher_id: user?.id,
        day_of_week: formData.day_of_week,
        start_time: formData.start_time,
        end_time: formData.end_time,
        description: formData.description || null,
        created_by: user?.id,
        is_active: true
      };

      if (editingId) {
        // Update existing
        const { error } = await (supabase as any)
          .from('timetables')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Timetable entry updated successfully",
        });
      } else {
        // Create new
        console.log('Creating timetable with payload:', payload);
        const { data, error } = await (supabase as any)
          .from('timetables')
          .insert(payload)
          .select()
          .single();

        if (error) {
          console.error('Timetable insert error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            error: error
          });
          throw error;
        }

        console.log('Timetable created successfully:', data);

        // Auto-enroll all students using secure RPC function
        try {
          const { data: enrollResult, error: enrollError } = await (supabase as any)
            .rpc('enroll_all_students_in_timetable', {
              p_timetable_id: data.id
            });

          if (enrollError) {
            console.warn('Student enrollment warning:', enrollError);
            // Don't fail the whole operation, just warn
            toast({
              title: "Success",
              description: "Timetable created, but student enrollment may be incomplete",
            });
          } else {
            toast({
              title: "Success",
              description: `Timetable created and ${enrollResult?.enrolled_count || 0} students enrolled`,
            });
          }
        } catch (enrollErr) {
          console.warn('Enrollment error:', enrollErr);
          toast({
            title: "Success",
            description: "Timetable created successfully",
          });
        }
      }

      resetForm();
      fetchTimetable();
    } catch (error: any) {
      console.error('Error saving timetable:', error);
      console.error('Error type:', typeof error);
      console.error('Error keys:', error ? Object.keys(error) : 'null');
      
      let errorMessage = "Failed to save timetable entry";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error_description) {
        errorMessage = error.error_description;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (entry: TimetableEntry) => {
    setFormData({
      title: entry.title,
      subject_id: entry.subject_id ? entry.subject_id.toString() : '',
      room_id: entry.room_id ? entry.room_id.toString() : '',
      course: '',
      day_of_week: entry.day_of_week,
      start_time: entry.start_time,
      end_time: entry.end_time,
      description: entry.description || ''
    });
    setEditingId(entry.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timetable entry?')) return;

    try {
      const supabase = getSupabase();
      const { error } = await (supabase as any)
        .from('timetables')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timetable entry deleted",
      });

      fetchTimetable();
    } catch (error: any) {
      console.error('Error deleting timetable:', error);
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject_id: '',
      room_id: '',
      course: '',
      day_of_week: 1,
      start_time: '09:00',
      end_time: '10:00',
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a subject name",
        variant: "destructive",
      });
      return;
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await (supabase as any)
        .from('subjects')
        .insert({ name: newSubjectName.trim() })
        .select()
        .single();

      if (error) throw error;

      setSubjects([...subjects, data]);
      setFormData({ ...formData, subject_id: data.id.toString() });
      setNewSubjectName('');
      setShowAddSubject(false);
      
      toast({
        title: "Success",
        description: `Subject "${newSubjectName}" added successfully`,
      });
    } catch (error: any) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add subject",
        variant: "destructive",
      });
    }
  };

  const handleAddRoom = async () => {
    if (!newRoomNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a room number",
        variant: "destructive",
      });
      return;
    }

    try {
      const supabase = getSupabase();
      const { data, error } = await (supabase as any)
        .from('rooms')
        .insert({ 
          room_number: newRoomNumber.trim(),
          building: newRoomBuilding.trim() || null
        })
        .select()
        .single();

      if (error) throw error;

      setRooms([...rooms, data]);
      setFormData({ ...formData, room_id: data.id.toString() });
      setNewRoomNumber('');
      setNewRoomBuilding('');
      setShowAddRoom(false);
      
      toast({
        title: "Success",
        description: `Room "${newRoomNumber}" added successfully`,
      });
    } catch (error: any) {
      console.error('Error adding room:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add room",
        variant: "destructive",
      });
    }
  };

  const handleAddCourse = () => {
    if (!newCourseName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a course name",
        variant: "destructive",
      });
      return;
    }

    if (courses.includes(newCourseName.trim())) {
      toast({
        title: "Error",
        description: "Course already exists",
        variant: "destructive",
      });
      return;
    }

    const updatedCourses = [...courses, newCourseName.trim()];
    setCourses(updatedCourses);
    setFormData({ ...formData, course: newCourseName.trim() });
    setNewCourseName('');
    setShowAddCourse(false);
    
    toast({
      title: "Success",
      description: `Course "${newCourseName}" added successfully`,
    });
  };

  const sendNotifications = async () => {
    try {
      const supabase = getSupabase();
      const { data, error } = await (supabase as any)
        .rpc('send_due_timetable_notifications');

      if (error) throw error;

      toast({
        title: "Notifications Sent",
        description: `${data || 0} notifications sent to students`,
      });
    } catch (error: any) {
      console.error('Error sending notifications:', error);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    }
  };

  // Group timetable by day
  const timetableByDay = DAYS.map((day, index) => ({
    day,
    dayIndex: index,
    entries: timetable.filter(entry => entry.day_of_week === index)
  }));

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
      <Card className="huly-card">
        <CardHeader className="border-b bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <div>Timetable Management</div>
                <p className="text-xs font-normal text-muted-foreground mt-0.5">
                  Create and manage your class schedule
                </p>
              </div>
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={sendNotifications}
              >
                <Bell className="h-4 w-4 mr-1" />
                Send Notifications
              </Button>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Class
              </Button>
            </div>
          </div>
        </CardHeader>

        {showForm && (
          <CardContent className="border-b bg-muted/50 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Class Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Mathematics - Algebra"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <div className="flex gap-2">
                    <select
                      id="subject"
                      value={formData.subject_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject_id: e.target.value }))}
                      className="flex-1 h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="">Select subject</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>{subject.name}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddSubject(true)}
                      className="px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="room">Room</Label>
                  <div className="flex gap-2">
                    <select
                      id="room"
                      value={formData.room_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, room_id: e.target.value }))}
                      className="flex-1 h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="">Select room</option>
                      {rooms.map(room => (
                        <option key={room.id} value={room.id}>
                          {room.room_number}{room.building ? ` - ${room.building}` : ''}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddRoom(true)}
                      className="px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="course">Course / Program</Label>
                  <div className="flex gap-2">
                    <select
                      id="course"
                      value={formData.course}
                      onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                      className="flex-1 h-10 rounded-md border border-input bg-background px-3"
                    >
                      <option value="">Select course</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddCourse(true)}
                      className="px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="day">Day of Week *</Label>
                  <select
                    id="day"
                    value={formData.day_of_week}
                    onChange={(e) => setFormData(prev => ({ ...prev, day_of_week: parseInt(e.target.value) }))}
                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                    required
                  >
                    {DAYS.map((day, index) => (
                      <option key={index} value={index}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end_time">End Time *</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional notes or instructions..."
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingId ? 'Update' : 'Create'} Entry
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {timetableByDay.map(({ day, dayIndex, entries }) => (
          <Card key={dayIndex} className={cn(
            "huly-card",
            entries.length === 0 && "opacity-50"
          )}>
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{day}</span>
                <Badge variant="outline">{entries.length} classes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {entries.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No classes scheduled
                </p>
              ) : (
                entries.map(entry => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-sm leading-tight">{entry.title}</h4>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(entry.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
                        </div>
                      )}
                      {entry.enrolled_students !== undefined && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {entry.enrolled_students} students
                        </div>
                      )}
                    </div>

                    {entry.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {entry.description}
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Subject Modal */}
      {showAddSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddSubject(false)}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <CardTitle className="text-lg">Add New Subject</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="newSubject">Subject Name *</Label>
                <Input
                  id="newSubject"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, English"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddSubject}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddSubject(false);
                    setNewSubjectName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Room Modal */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddRoom(false)}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <CardTitle className="text-lg">Add New Room</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="newRoomNumber">Room Number *</Label>
                <Input
                  id="newRoomNumber"
                  value={newRoomNumber}
                  onChange={(e) => setNewRoomNumber(e.target.value)}
                  placeholder="e.g., 101, A-205, Lab-3"
                />
              </div>
              <div>
                <Label htmlFor="newRoomBuilding">Building (Optional)</Label>
                <Input
                  id="newRoomBuilding"
                  value={newRoomBuilding}
                  onChange={(e) => setNewRoomBuilding(e.target.value)}
                  placeholder="e.g., Main Building, Block A"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddRoom}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddRoom(false);
                    setNewRoomNumber('');
                    setNewRoomBuilding('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddCourse(false)}>
          <Card className="w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <CardTitle className="text-lg">Add New Course</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label htmlFor="newCourse">Course Name *</Label>
                <Input
                  id="newCourse"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  placeholder="e.g., BCA, MCA, BTech CSE"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCourse()}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Common courses: BCA, MCA, BTech, MTech, MBA, BBA, BSc, MSc
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddCourse}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddCourse(false);
                    setNewCourseName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
