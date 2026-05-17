import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import { useTheme } from "@/components/ThemeProvider";
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
import RecruiterProfile from "./pages/recruiter/Profile";
import { AuthProvider } from "@/hooks/useAuth";

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

function AntdConfigWrapper({ children }: { children: React.ReactNode }) {
  const { theme: appTheme } = useTheme();
  let resolvedTheme = appTheme;
  if (appTheme === "system") {
    resolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return (
    <ConfigProvider
      theme={{
        algorithm: resolvedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#F97316',
          colorLink: '#F97316',
          colorSuccess: '#4ECDC4',
          colorInfo: '#4ECDC4',
          borderRadius: 8,
          fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
          colorBgLayout: resolvedTheme === 'dark' ? undefined : '#F8F9FB',
          colorBgContainer: resolvedTheme === 'dark' ? '#0F1A2E' : '#FFFFFF',
        },
        components: {
          Menu: {
            darkItemSelectedBg: '#F97316',
            darkItemSelectedColor: '#FFFFFF',
            darkSubMenuItemBg: '#162340',
          },
          Button: {
            colorPrimary: '#F97316',
            algorithm: true,
          },
          Progress: {
            colorSuccess: '#4ECDC4',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "732009230588-your-placeholder-client-id.apps.googleusercontent.com"}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="jobengine-ui-theme">
        <AntdConfigWrapper>
        <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* Global Ambient Light Leaks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Recruiter dashboard */}
            <Route path="/dashboard" element={<DashboardShell><Index /></DashboardShell>} />
            <Route path="/jobs" element={<DashboardShell><Jobs /></DashboardShell>} />
            <Route path="/candidates" element={<DashboardShell><Candidates /></DashboardShell>} />
            <Route path="/pipeline" element={<DashboardShell><Pipeline /></DashboardShell>} />
            <Route path="/analytics" element={<DashboardShell><Analytics /></DashboardShell>} />
            <Route path="/recruiter/profile" element={<DashboardShell><RecruiterProfile /></DashboardShell>} />
            {/* Admin section */}
            <Route path="/admin" element={<AdminShell><AdminDashboard /></AdminShell>} />
            <Route path="/admin/users" element={<AdminShell><AdminUsers /></AdminShell>} />
            {/* Candidate dashboard */}
            <Route path="/candidate" element={<CandidateShell title="Dashboard"><Dashboard /></CandidateShell>} />
            <Route path="/candidate/explore" element={<CandidateShell title="Explore Jobs"><ExploreJobs /></CandidateShell>} />
            <Route path="/candidate/job/:id" element={<CandidateShell title="Job Details"><JobDetail /></CandidateShell>} />
            <Route path="/candidate/applications" element={<CandidateShell title="My Applications"><Applications /></CandidateShell>} />
            <Route path="/candidate/profile" element={<CandidateShell title="Profile"><Profile /></CandidateShell>} />
            <Route path="/candidate/career-ai" element={<CandidateShell title="Career AI"><CareerAI /></CandidateShell>} />
            <Route path="/candidate/upload-cv" element={<CandidateShell title="Upload CV"><UploadCV /></CandidateShell>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </TooltipProvider>
      </AntdConfigWrapper>
    </ThemeProvider>
  </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
