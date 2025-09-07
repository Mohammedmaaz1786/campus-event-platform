import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminEventsEnhanced from "./pages/admin/AdminEventsEnhanced";
import Users from "./pages/admin/Users";
import Registrations from "./pages/admin/Registrations";
import Attendance from "./pages/admin/Attendance";
import Reports from "./pages/admin/Reports";
import AdminProfile from "./pages/admin/AdminProfile";

// Student Pages
import StudentLogin from "./pages/student/StudentLogin";
import StudentHomeFixed from "./pages/student/StudentHomeFixed";
import StudentBrowseEvents from "./pages/student/StudentBrowseEvents";
import StudentMyRegistrations from "./pages/student/StudentMyRegistrations";
import StudentProfileFixed from "./pages/student/StudentProfileFixed";

// Shared Pages
import NotFound from "./pages/NotFound";

// Components
import { AdminLayout } from "./components/admin/AdminLayout";
import { StudentLayoutFixed } from "./components/student/StudentLayoutFixed";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/student/login" element={<StudentLogin />} />
            
            {/* Redirect root to admin login */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/login" element={<Navigate to="/admin/login" replace />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="events" element={<AdminEventsEnhanced />} />
              <Route path="users" element={<Users />} />
              <Route path="registrations" element={<Registrations />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>
            
            {/* Protected Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute>
                <StudentLayoutFixed />
              </ProtectedRoute>
            }>
              <Route index element={<StudentHomeFixed />} />
              <Route path="events" element={<StudentBrowseEvents />} />
              <Route path="registrations" element={<StudentMyRegistrations />} />
              <Route path="profile" element={<StudentProfileFixed />} />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
