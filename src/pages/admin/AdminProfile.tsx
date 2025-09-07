import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Mail, Phone, GraduationCap, Calendar, Edit, Save, X, Shield, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { initializeEnhancedMockData, getAdminByEmail, type EnhancedAdminData } from '../../lib/enhanced-mock-data';
import { getCurrentUserSession, initializeUserData } from '../../lib/user-data-manager';
import { getRealTimeAdminStats, syncAdminEventRegistrations, initializeAdminStatsTracking, clearAndReinitializeStatsData } from '@/lib/admin-stats-sync';

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  role: string;
  department: string;
  joinDate: string;
  permissions: string[];
  eventsCreated: number;
  totalRegistrations: number;
}

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    college: '',
    role: '',
    department: '',
    joinDate: '',
    permissions: [],
    eventsCreated: 0,
    totalRegistrations: 0
  });
  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    try {
      // Initialize enhanced mock data first
      initializeEnhancedMockData();
      
      // Get current user session
      const userSession = getCurrentUserSession();
      if (!userSession || userSession.role !== 'admin') {
        setLoading(false);
        return;
      }

      // Only check if we need to reinitialize data
      const quickCheck = localStorage.getItem('event_registrations');
      if (!quickCheck || JSON.parse(quickCheck).length < 5) {
        console.log('Minimal data detected, reinitializing...');
        clearAndReinitializeStatsData();
        initializeEnhancedMockData();
      }

      // Initialize user-specific data
      initializeUserData(userSession.email, 'admin');
      
      // Get enhanced admin data
      const enhancedAdmin = getAdminByEmail(userSession.email);
      const adminData = enhancedAdmin || {
        id: userSession.id,
        name: userSession.name,
        email: userSession.email,
        password: '',
        phone: '+1 (555) 987-6543',
        college: userSession.college,
        role: 'Campus Administrator',
        department: 'Administration',
        joinDate: '2023-01-15',
        permissions: ['event_management', 'user_management', 'reports_access']
      };
      
      // Try to get stats, with fallback
      let eventsCreated = 1;
      let totalRegistrations = 1;
      
      try {
        // Initialize and sync admin stats carefully
        initializeAdminStatsTracking(userSession.email);
        syncAdminEventRegistrations();
        
        // Get real-time admin stats
        const realTimeStats = getRealTimeAdminStats(userSession.email);
        eventsCreated = realTimeStats.eventsCreated || 1;
        totalRegistrations = realTimeStats.totalRegistrations || 1;
        
        console.log('Admin Profile Stats:', { eventsCreated, totalRegistrations });
      } catch (error) {
        console.error('Error calculating stats, using defaults:', error);
      }

      const profileData: AdminProfile = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        phone: adminData.phone,
        college: adminData.college,
        role: adminData.role,
        department: adminData.department,
        joinDate: adminData.joinDate,
        permissions: adminData.permissions,
        eventsCreated,
        totalRegistrations
      };
      
      setProfile(profileData);
      setEditForm(profileData);
    } catch (error) {
      console.error('Error in AdminProfile useEffect:', error);
      // Fallback profile
      const userSession = getCurrentUserSession();
      if (userSession) {
        const fallbackProfile: AdminProfile = {
          id: userSession.id,
          name: userSession.name,
          email: userSession.email,
          phone: '+1 (555) 987-6543',
          college: userSession.college,
          role: 'Campus Administrator',
          department: 'Administration',
          joinDate: '2023-01-15',
          permissions: ['event_management', 'user_management', 'reports_access'],
          eventsCreated: 1,
          totalRegistrations: 1
        };
        setProfile(fallbackProfile);
        setEditForm(fallbackProfile);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = () => {
    // Update localStorage with new profile data
    const admin = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedAdmin = {
      ...admin,
      ...editForm
    };
    
    localStorage.setItem('user', JSON.stringify(updatedAdmin));
    setProfile(editForm);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your admin profile has been successfully updated.",
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

  const getRoleColor = (role: string) => {
    const colors = {
      'Campus Administrator': 'bg-purple-100 text-purple-800',
      'Dean': 'bg-blue-100 text-blue-800',
      'Department Head': 'bg-green-100 text-green-800',
      'Event Coordinator': 'bg-orange-100 text-orange-800',
      'Faculty Admin': 'bg-indigo-100 text-indigo-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600">Manage your administrative information</p>
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
                <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-gray-600">{profile.id}</p>
                <Badge className={getRoleColor(profile.role)}>{profile.role}</Badge>
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
                <Label htmlFor="college">College/Campus</Label>
                {isEditing ? (
                  <Select value={editForm.college} onValueChange={(value) => setEditForm({ ...editForm, college: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select college" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Campus">Main Campus</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Arts & Sciences">Arts & Sciences</SelectItem>
                      <SelectItem value="Business School">Business School</SelectItem>
                      <SelectItem value="Medical College">Medical College</SelectItem>
                      <SelectItem value="Law School">Law School</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <GraduationCap className="h-4 w-4 text-gray-500" />
                    <span>{profile.college}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Administrative Role</Label>
                {isEditing ? (
                  <Select value={editForm.role} onValueChange={(value) => setEditForm({ ...editForm, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Campus Administrator">Campus Administrator</SelectItem>
                      <SelectItem value="Dean">Dean</SelectItem>
                      <SelectItem value="Department Head">Department Head</SelectItem>
                      <SelectItem value="Event Coordinator">Event Coordinator</SelectItem>
                      <SelectItem value="Faculty Admin">Faculty Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span>{profile.role}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span>{profile.department}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats & Info */}
        <div className="space-y-6">
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
                <Label className="text-sm font-medium text-gray-600">Admin Since</Label>
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
                <Label className="text-sm font-medium text-gray-600">Admin Type</Label>
                <p className="text-sm">{profile.role}</p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Events Created</span>
                <span className="text-lg font-bold text-blue-600">{profile.eventsCreated}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Registrations</span>
                <span className="text-lg font-bold text-green-600">{profile.totalRegistrations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average per Event</span>
                <span className="text-lg font-bold text-purple-600">
                  {profile.eventsCreated > 0 ? Math.round(profile.totalRegistrations / profile.eventsCreated) : 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.permissions.map((permission) => (
                  <Badge key={permission} variant="secondary" className="mr-2">
                    {permission.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
