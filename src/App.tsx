import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Users from "./pages/Users";
import Registrations from "./pages/Registrations";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Student Pages
import StudentLogin from "./pages/student/StudentLogin";
import StudentHome from "./pages/student/StudentHome";
import StudentEvents from "./pages/student/StudentEvents";
import StudentRegistrations from "./pages/student/StudentRegistrations";
import StudentProfile from "./pages/student/StudentProfile";

// Components
import { DashboardLayout } from "./components/DashboardLayout";
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
            <Route path="/login" element={<Login />} />
            <Route path="/student/login" element={<StudentLogin />} />
            
            {/* Protected Admin Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="users" element={<Users />} />
              <Route path="registrations" element={<Registrations />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            
            {/* Protected Student Routes */}
            <Route path="/student" element={
              <ProtectedRoute>
                <StudentHome />
              </ProtectedRoute>
            } />
            <Route path="/student/events" element={
              <ProtectedRoute>
                <StudentEvents />
              </ProtectedRoute>
            } />
            <Route path="/student/registrations" element={
              <ProtectedRoute>
                <StudentRegistrations />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute>
                <StudentProfile />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
