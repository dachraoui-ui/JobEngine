import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { CandidateLayout } from "@/components/layout/CandidateLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import Pipeline from "./pages/Pipeline";
import Analytics from "./pages/Analytics";
import ExploreJobs from "./pages/candidate/ExploreJobs";
import JobDetail from "./pages/candidate/JobDetail";
import Dashboard from "./pages/candidate/Dashboard";
import Applications from "./pages/candidate/Applications";
import Profile from "./pages/candidate/Profile";
import CareerAI from "./pages/candidate/CareerAI";
import UploadCV from "./pages/candidate/UploadCV";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/admin/Users";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminVerifications from "./pages/admin/Verifications";
import AdminConfig from "./pages/admin/Config";
import AdminReports from "./pages/admin/Reports";
import RecruiterProfile from "./pages/recruiter/Profile";
import Settings from "./pages/Settings";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

const queryClient = new QueryClient();

function DashboardShell({ children }: { children: React.ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

function CandidateShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return <CandidateLayout title={title}>{children}</CandidateLayout>;
}

function AdminShell({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "732009230588-your-placeholder-client-id.apps.googleusercontent.com"}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="jobengine-ui-theme">
        <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* Global Ambient Light Leaks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-15%] left-[-5%] w-[700px] h-[700px] bg-primary/8 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/6 rounded-full blur-[150px]" />
      </div>

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Recruiter dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><Index /></DashboardShell></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><Jobs /></DashboardShell></ProtectedRoute>} />
            <Route path="/candidates" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><Candidates /></DashboardShell></ProtectedRoute>} />
            <Route path="/pipeline" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><Pipeline /></DashboardShell></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><Analytics /></DashboardShell></ProtectedRoute>} />
            <Route path="/recruiter/profile" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><RecruiterProfile /></DashboardShell></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['RECRUITER']}><DashboardShell><Settings /></DashboardShell></ProtectedRoute>} />
            {/* Admin section — separate portal */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShell><AdminDashboard /></AdminShell></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShell><AdminUsers /></AdminShell></ProtectedRoute>} />
            <Route path="/admin/verifications" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShell><AdminVerifications /></AdminShell></ProtectedRoute>} />
            <Route path="/admin/config" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShell><AdminConfig /></AdminShell></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminShell><AdminReports /></AdminShell></ProtectedRoute>} />
            {/* Candidate dashboard */}
            <Route path="/candidate" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="Dashboard"><Dashboard /></CandidateShell></ProtectedRoute>} />
            <Route path="/candidate/explore" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="Explore Jobs"><ExploreJobs /></CandidateShell></ProtectedRoute>} />
            <Route path="/candidate/job/:id" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="Job Details"><JobDetail /></CandidateShell></ProtectedRoute>} />
            <Route path="/candidate/applications" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="My Applications"><Applications /></CandidateShell></ProtectedRoute>} />
            <Route path="/candidate/profile" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="Profile"><Profile /></CandidateShell></ProtectedRoute>} />
            <Route path="/candidate/career-ai" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="Career AI"><CareerAI /></CandidateShell></ProtectedRoute>} />
            <Route path="/candidate/upload-cv" element={<ProtectedRoute allowedRoles={['CANDIDATE']}><CandidateShell title="Upload CV"><UploadCV /></CandidateShell></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
