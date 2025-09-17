'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, BookOpen, Search, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Subject } from '@/lib/database.types';

interface SubjectManagementProps {
  teacherId: string;
}

export default function SubjectManagement({ teacherId }: SubjectManagementProps) {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  });

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      const response = await fetch('/api/subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: 'Error',
        description: 'Failed to load subjects',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingSubject ? `/api/subjects/${editingSubject.id}` : '/api/subjects';
      const method = editingSubject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: editingSubject ? 'Subject updated successfully' : 'Subject created successfully'
        });
        setFormData({ name: '', code: '', description: '' });
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
        setEditingSubject(null);
        fetchSubjects();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to save subject',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to save subject',
        variant: 'destructive'
      });
    }
  };

  // Handle delete
  const handleDelete = async (subjectId: number) => {
    try {
      const response = await fetch(`/api/subjects/${subjectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Subject deleted successfully'
        });
        fetchSubjects();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete subject',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subject',
        variant: 'destructive'
      });
    }
  };

  // Handle edit
  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code || '',
      description: subject.description || ''
    });
    setIsEditDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Subject Management</h2>
          <p className="text-muted-foreground">Manage subjects and their details</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Add a new subject with its details and description.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Subject Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., MATH101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the subject..."
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Subject</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subjects Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Subjects ({filteredSubjects.length})
          </CardTitle>
          <CardDescription>
            All subjects available in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No subjects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first subject.'}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subject
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.name}</TableCell>
                    <TableCell>
                      {subject.code ? (
                        <Badge variant="secondary">{subject.code}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {subject.description || <span className="text-muted-foreground">No description</span>}
                    </TableCell>
                    <TableCell>
                      {new Date(subject.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(subject)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{subject.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(subject.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update the subject details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Subject Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Mathematics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code">Subject Code</Label>
              <Input
                id="edit-code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g., MATH101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the subject..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Subject</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}