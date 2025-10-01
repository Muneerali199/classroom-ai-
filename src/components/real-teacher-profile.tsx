'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Calendar, Edit2, Save, Sparkles, Upload, Loader2, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getSupabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
  bio?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at: string;
}

export default function RealTeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [formData, setFormData] = useState<Partial<TeacherProfile>>({});
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const supabase = getSupabase();

      // Try to get from teachers table first
      const { data: teacherData, error: teacherError } = await (supabase as any)
        .from('teachers')
        .select('*')
        .eq('auth_user_id', user?.id)
        .single();

      if (teacherData) {
        const profileData = {
          id: teacherData.id,
          first_name: teacherData.first_name || '',
          last_name: teacherData.last_name || '',
          email: teacherData.email || user?.email || '',
          phone: teacherData.phone || '',
          department: teacherData.department || '',
          role: teacherData.role || 'Teacher',
          bio: teacherData.bio || '',
          avatar_url: teacherData.avatar_url || '',
          address: teacherData.address || '',
          city: teacherData.city || '',
          country: teacherData.country || '',
          created_at: teacherData.created_at
        };
        setProfile(profileData);
        setFormData(profileData);
      } else {
        // Fallback to auth user data
        const profileData = {
          id: user?.id || '',
          first_name: user?.user_metadata?.first_name || '',
          last_name: user?.user_metadata?.last_name || '',
          email: user?.email || '',
          phone: user?.user_metadata?.phone || '',
          department: user?.user_metadata?.department || '',
          role: user?.user_metadata?.role || 'Teacher',
          bio: user?.user_metadata?.bio || '',
          avatar_url: user?.user_metadata?.avatar_url || '',
          address: user?.user_metadata?.address || '',
          city: user?.user_metadata?.city || '',
          country: user?.user_metadata?.country || '',
          created_at: user?.created_at || new Date().toISOString()
        };
        setProfile(profileData);
        setFormData(profileData);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploadingPhoto(true);
      const supabase = getSupabase();

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Update profile with new avatar URL
      setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));

      // Auto-save avatar
      await updateProfile({ avatar_url: avatarUrl });

      toast({
        title: "Success",
        description: "Profile photo updated successfully"
      });
    } catch (error: any) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const updateProfile = async (updates?: Partial<TeacherProfile>) => {
    try {
      setSaving(true);
      const supabase = getSupabase();
      const dataToUpdate = updates || formData;

      // Remove read-only fields
      const { id, email, created_at, ...updateData } = dataToUpdate;

      console.log('Updating profile with data:', updateData);
      console.log('User ID:', user?.id);

      // Update teachers table
      const { data, error: teacherError } = await (supabase as any)
        .from('teachers')
        .update({
          first_name: updateData.first_name,
          last_name: updateData.last_name,
          phone: updateData.phone,
          department: updateData.department,
          role: updateData.role,
          bio: updateData.bio,
          avatar_url: updateData.avatar_url,
          address: updateData.address,
          city: updateData.city,
          country: updateData.country,
          updated_at: new Date().toISOString()
        })
        .eq('auth_user_id', user?.id)
        .select();

      if (teacherError) {
        console.error('Teacher update error:', teacherError);
        throw new Error(teacherError.message || 'Failed to update teacher profile');
      }

      console.log('Update successful:', data);

      // Refresh profile data
      await fetchProfile();

      if (!updates) {
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile();
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'User';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Profile Settings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">Manage your account information</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={getFullName()}
                    className="w-24 h-24 rounded-full object-cover border-4 border-cyan-500/30"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-3xl font-black border-4 border-cyan-500/30">
                    {getInitials()}
                  </div>
                )}
                <label
                  htmlFor="photo-upload"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center border-4 border-white dark:border-gray-900 cursor-pointer hover:scale-110 transition-transform"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-white" />
                  )}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {getFullName()}
              </h2>
              <p className="text-cyan-600 dark:text-cyan-400 mb-4">{profile?.role || 'Teacher'}</p>
              <div className="flex gap-2 justify-center">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                  Active
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="border-gray-200 dark:border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name || ''}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name || ''}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Email (Read-only) */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="mt-1 bg-gray-100 dark:bg-gray-800"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Email cannot be changed for security reasons
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+1 234 567 8900"
                    className="mt-1"
                  />
                </div>

                {/* Department & Role */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department || ''}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g. Mathematics"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role/Title</Label>
                    <Input
                      id="role"
                      value={formData.role || ''}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g. Senior Teacher"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Street address"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        disabled={!isEditing}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={formData.country || ''}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Country"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <Label>Member Since</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
