import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, GraduationCap, Calendar, Edit, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    joinDate: '',
    studentId: '',
    year: ''
  });
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    // Load profile from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profileData = {
      name: user.name || 'Student Name',
      email: user.email || 'student@campus.edu',
      phone: user.phone || '+1 (555) 123-4567',
      college: user.college || 'Engineering', // Use actual college from user data
      joinDate: user.joinDate || '2023-09-01',
      studentId: user.studentId || 'STU001',
      year: user.year || 'Junior'
    };
    
    setProfile(profileData);
    setEditForm(profileData);
    setLoading(false);
  }, []);

  const handleSave = () => {
    // Update localStorage with new profile data
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...user,
      ...editForm
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setProfile(editForm);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(part => part.charAt(0).toUpperCase()).join('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-600">{profile.studentId}</p>
                <Badge variant="secondary">{profile.year}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College</Label>
                {isEditing ? (
                  <Input
                    id="college"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span>{profile.college}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                {isEditing ? (
                  <Input
                    id="studentId"
                    value={editForm.studentId}
                    onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="text-gray-500">#</span>
                    <span>{profile.studentId}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                {isEditing ? (
                  <Input
                    id="year"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{profile.year}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Member Since</Label>
              <p className="text-sm">{formatDate(profile.joinDate)}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Account Status</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">College</Label>
              <p className="text-sm font-medium">{profile.college}</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600">Student Type</Label>
              <p className="text-sm">Regular Student</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentProfile;
