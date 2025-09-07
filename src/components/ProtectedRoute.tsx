import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isStudentRoute = location.pathname.startsWith('/student');
  
  if (isAdminRoute) {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      return <Navigate to="/admin/login" replace />;
    }
  } else if (isStudentRoute) {
    const studentToken = localStorage.getItem('studentToken');
    if (!studentToken) {
      return <Navigate to="/student/login" replace />;
    }
  } else {
    // Fallback for any other routes
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (!token) {
      return <Navigate to="/admin/login" replace />;
    }
  }
  
  return <>{children}</>;
}