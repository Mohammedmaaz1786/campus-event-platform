import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Mail, GraduationCap } from 'lucide-react';
import { usersAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  college: string;
  department: string;
  year?: string;
  registrations: number;
  last_active: string;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@campus.edu',
    role: 'student',
    college: 'Engineering',
    department: 'Computer Science',
    year: '3rd Year',
    registrations: 8,
    last_active: '2024-03-01T10:30:00',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@campus.edu',
    role: 'faculty',
    college: 'Engineering',
    department: 'Computer Science',
    registrations: 12,
    last_active: '2024-03-01T14:20:00',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.j@campus.edu',
    role: 'student',
    college: 'Arts & Sciences',
    department: 'Psychology',
    year: '2nd Year',
    registrations: 5,
    last_active: '2024-02-28T16:45:00',
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob.wilson@campus.edu',
    role: 'student',
    college: 'Business',
    department: 'Marketing',
    year: '4th Year',
    registrations: 15,
    last_active: '2024-03-01T09:15:00',
  },
  {
    id: '5',
    name: 'Dr. Sarah Brown',
    email: 'sarah.brown@campus.edu',
    role: 'faculty',
    college: 'Arts & Sciences',
    department: 'Chemistry',
    registrations: 3,
    last_active: '2024-02-29T11:30:00',
  },
];

export default function Users() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'faculty' | 'admin'>('all');
  const [collegeFilter, setCollegeFilter] = useState<'all' | string>('all');

  const colleges = Array.from(new Set(users.map(user => user.college)));

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesCollege = collegeFilter === 'all' || user.college === collegeFilter;

    return matchesSearch && matchesRole && matchesCollege;
  });

  const getRoleBadge = (role: User['role']) => {
    const variants = {
      student: 'default',
      faculty: 'secondary',
      admin: 'destructive',
    } as const;

    const colors = {
      student: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      faculty: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };

    return (
      <Badge className={`capitalize ${colors[role]}`}>
        {role}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatLastActive = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground">
          Manage student and faculty profiles
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-dashboard-md">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={(value: any) => setRoleFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>

            {/* College Filter */}
            <Select value={collegeFilter} onValueChange={setCollegeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by college" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                {colleges.map(college => (
                  <SelectItem key={college} value={college}>{college}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-dashboard-md">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} users found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>College & Department</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Registrations</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${user.id}.png`} />
                        <AvatarFallback className="bg-gradient-stats text-primary font-medium">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.college}</div>
                      <div className="text-sm text-muted-foreground">{user.department}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.year ? (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        {user.year}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <span className="font-medium">{user.registrations}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatLastActive(user.last_active)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}