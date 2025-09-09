'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Student, AttendanceStatus } from '@/lib/types';
import { Badge } from './ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AttendanceTableProps {
  students: Student[];
  date: string;
  onAttendanceChange: (
    studentId: string,
    date: string,
    status: AttendanceStatus
  ) => void;
}

export default function AttendanceTable({
  students,
  date,
  onAttendanceChange,
}: AttendanceTableProps) {
  const { toast } = useToast();

  const getStatusForDate = (student: Student, date: string): AttendanceStatus => {
    const record = student.attendance.find((att) => att.date === date);
    return record ? record.status : 'Present';
  };
  
  const getStatusVariant = (status: AttendanceStatus) => {
    switch (status) {
      case 'Present':
        return 'default';
      case 'Late':
        return 'secondary';
      case 'Absent':
        return 'destructive';
      case 'Excused':
        return 'outline';
      default:
        return 'default';
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Attendance Saved',
      description: 'Today\'s attendance records have been updated successfully.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Attendance for {new Date(date).toLocaleDateString()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant={getStatusVariant(getStatusForDate(student, date))}>
                            {getStatusForDate(student, date)}
                        </Badge>
                    </TableCell>
                    <TableCell>
                    <Select
                        defaultValue={getStatusForDate(student, date)}
                        onValueChange={(value) =>
                        onAttendanceChange(student.id, date, value as AttendanceStatus)
                        }
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Mark attendance" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Present">Present</SelectItem>
                        <SelectItem value="Absent">Absent</SelectItem>
                        <SelectItem value="Late">Late</SelectItem>
                        <SelectItem value="Excused">Excused</SelectItem>
                        </SelectContent>
                    </Select>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
