import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Loader2 } from 'lucide-react';
import { adminAuthAPI } from '@/lib/admin/api';
import { useToast } from '@/hooks/use-toast';
import { initializeEnhancedMockData, getAdminByEmail } from '../../lib/enhanced-mock-data';
import { initializeUserData } from '../../lib/user-data-manager';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Initialize enhanced mock data
      initializeEnhancedMockData();
      
      // Check if admin exists in mock data
      const admin = getAdminByEmail(email);
      
      if (admin && admin.password === password) {
        // Set admin authentication with proper token
        localStorage.setItem('user', JSON.stringify({
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: 'admin',
          college: admin.college,
          department: admin.department,
          permissions: admin.permissions
        }));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('adminToken', 'admin-authenticated'); // Add the token ProtectedRoute expects
        
        // Initialize user-specific data
        initializeUserData(admin.email, 'admin');
        
        navigate('/admin/dashboard');
        toast({
          title: 'Login successful',
          description: `Welcome ${admin.name}!`,
        });
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-dashboard-xl border-0">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Campus Events</CardTitle>
            <CardDescription className="text-base">
              Admin Dashboard Login
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@campus.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-primary text-white font-medium"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Demo credentials: admin@campus.edu / admin123
          </div>
        </CardContent>
      </Card>
    </div>
  );
}