const fs = require('fs');
const path = require('path');

const files = {
  'tailwind.config.ts': `// Redesigned with Ant Design — logic unchanged
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#F97316",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#1B2D4F",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#4ECDC4",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;`,

  'src/App.tsx': `// Redesigned with Ant Design — logic unchanged
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
          colorBgLayout: resolvedTheme === 'dark' ? '#0D1625' : '#F8F9FB',
          colorBgContainer: resolvedTheme === 'dark' ? '#111C2D' : '#FFFFFF',
          colorBorderSecondary: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        },
        components: {
          Menu: {
            darkItemSelectedBg: 'rgba(249,115,22,0.15)',
            darkItemSelectedColor: '#F97316',
            darkSubMenuItemBg: '#162340',
            darkItemBg: '#1B2D4F',
          },
          Layout: {
            siderBg: '#1B2D4F',
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

export default App;`,

  'src/components/layout/Sidebar.tsx': `// Redesigned with Ant Design — logic unchanged
import { Layout, Menu, Typography, Avatar, Tooltip } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  BriefcaseBusiness, 
  Users, 
  LayoutDashboard, 
  KanbanSquare, 
  LineChart,
  LogOut,
  UserCircle
} from "lucide-react";
import React from "react";

const { Sider } = Layout;
const { Text } = Typography;

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const getMenuItems = () => {
    return [
      { key: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
      { key: '/jobs', icon: <BriefcaseBusiness size={18} />, label: 'Jobs' },
      { key: '/candidates', icon: <Users size={18} />, label: 'Candidates' },
      { key: '/pipeline', icon: <KanbanSquare size={18} />, label: 'Pipeline' },
      { key: '/analytics', icon: <LineChart size={18} />, label: 'Analytics' },
    ];
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      width={260}
      collapsedWidth={72}
      className="h-screen fixed left-0 top-0 border-r border-white/10"
      style={{ backgroundColor: '#1B2D4F' }}
      theme="dark"
    >
      <div className="h-[72px] flex items-center justify-center border-b border-white/10 px-4">
        {collapsed ? (
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white">J</div>
        ) : (
          <Text className="text-white text-xl font-bold tracking-tight">JobEngine</Text>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ backgroundColor: 'transparent', border: 'none' }}
          items={getMenuItems().map(item => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.key}>{item.label}</Link>,
            style: { 
              height: '44px',
              borderRadius: '8px',
              margin: '4px 12px',
              width: 'calc(100% - 24px)'
            }
          }))}
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10" style={{ backgroundColor: '#1B2D4F' }}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-4">
            <Tooltip title="Profile" placement="right">
              <Avatar src={user?.avatar} icon={<UserCircle />} className="bg-white/10 text-white cursor-pointer" onClick={() => navigate('/recruiter/profile')} />
            </Tooltip>
            <Tooltip title="Logout" placement="right">
              <LogOut size={20} className="text-white/60 hover:text-white cursor-pointer" onClick={handleLogout} />
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar src={user?.avatar} icon={<UserCircle />} className="bg-white/10 text-white" />
            <div className="flex-1 min-w-0">
              <Text className="text-white block truncate text-sm font-medium">{user?.name || 'Recruiter'}</Text>
              <Text className="text-white/60 block text-xs truncate">Recruiter</Text>
            </div>
            <LogOut size={18} className="text-white/60 hover:text-white cursor-pointer shrink-0" onClick={handleLogout} />
          </div>
        )}
      </div>
    </Sider>
  );
}`,

  'src/components/layout/TopBar.tsx': `// Redesigned with Ant Design — logic unchanged
import { Layout, Input, Badge, Dropdown, Avatar } from "antd";
import { Search, Bell, User } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export function TopBar({ title = "Dashboard" }: { title?: string }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userMenu = {
    items: [
      { key: 'profile', label: 'Profile', onClick: () => navigate('/recruiter/profile') },
      { type: 'divider' as const },
      { key: 'logout', label: 'Log out', danger: true, onClick: () => { logout(); navigate('/'); } }
    ]
  };

  return (
    <Header 
      className="h-[64px] px-6 flex items-center justify-between sticky top-0 z-10 transition-colors"
      style={{ 
        background: isDark ? '#111C2D' : '#FFFFFF',
        borderBottom: \`1px solid \${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}\`,
        padding: '0 24px'
      }}
    >
      <div className="flex-1 flex items-center">
        <h1 className="text-lg font-semibold m-0" style={{ color: isDark ? '#fff' : '#000' }}>
          {title}
        </h1>
      </div>

      <div className="flex-1 flex justify-center">
        <Input 
          placeholder="Search candidates, jobs..." 
          prefix={<Search size={16} className="text-gray-400" />}
          style={{ width: '280px', borderRadius: '24px' }}
        />
      </div>

      <div className="flex-1 flex items-center justify-end gap-4">
        <ThemeToggle />
        
        <Badge count={3} size="small" className="cursor-pointer">
          <Bell size={20} style={{ color: isDark ? '#fff' : '#000' }} />
        </Badge>

        <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
          <div className="flex items-center gap-2 cursor-pointer ml-2">
            <Avatar src={user?.avatar} icon={<User />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}`,

  'src/components/layout/AppLayout.tsx': `// Redesigned with Ant Design — logic unchanged
import { Layout } from "antd";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useLocation } from "react-router-dom";

const { Content } = Layout;

export function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/jobs': return 'Jobs';
      case '/candidates': return 'Candidates';
      case '/pipeline': return 'Pipeline';
      case '/analytics': return 'Analytics';
      case '/recruiter/profile': return 'Profile';
      default: return 'Dashboard';
    }
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar />
      <Layout className="transition-all duration-200" style={{ marginLeft: 260 }}>
        <TopBar title={getPageTitle()} />
        <Content className="p-6 md:p-8 overflow-y-auto" style={{ height: 'calc(100vh - 64px)' }}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}`,

  'src/pages/Login.tsx': `// Redesigned with Ant Design — logic unchanged
import { Form, Input, Button, Divider, Radio, Typography } from "antd";
import { Mail, Lock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

const { Title, Text } = Typography;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      toast.success("Successfully logged in");
      // Use role logic to redirect normally
    } catch (err) {
      toast.error("Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-[40%] bg-[#1B2D4F] p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10">
          <Title level={2} className="!text-white font-bold mb-2 tracking-tight">JobEngine</Title>
          <Text className="text-white/60 text-lg">The AI-powered recruitment platform.</Text>
          
          <div className="mt-24 space-y-8">
            {[
              "AI-powered match scoring",
              "Automated resume extraction",
              "Smart pipeline management"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-[#4ECDC4]" />
                </div>
                <Text className="text-white/90 text-lg">{text}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-32 bg-[var(--ant-color-bg-container)]">
        <div className="w-full max-w-md mx-auto">
          <Title level={1} className="!text-3xl font-bold mb-2">Welcome back</Title>
          <Text className="text-muted-foreground block mb-8">Enter your credentials to access your account</Text>

          <Button 
            className="w-full h-11 rounded-[10px] mb-6 flex items-center justify-center font-medium"
            icon={<img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />}
          >
            Continue with Google
          </Button>

          <Divider className="text-muted-foreground text-sm my-6">or continue with email</Divider>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item 
              label={<span className="text-[13px] font-medium">Email address</span>}
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Input 
                prefix={<Mail size={18} className="text-muted-foreground mr-2" />} 
                placeholder="name@company.com"
                className="h-11 rounded-[10px]"
              />
            </Form.Item>

            <Form.Item 
              label={
                <div className="flex justify-between w-full text-[13px] font-medium">
                  <span>Password</span>
                  <Link to="/forgot-password" className="text-primary hover:underline">Forgot?</Link>
                </div>
              }
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password 
                prefix={<Lock size={18} className="text-muted-foreground mr-2" />} 
                placeholder="••••••••"
                className="h-11 rounded-[10px]"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full h-11 rounded-[10px] font-medium text-base mt-2" loading={loading}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Text className="text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Create an account</Link>
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}`
};

Object.entries(files).forEach(([file, content]) => {
  const fullPath = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\\n');
  console.log(\`✓ \${file} — done\`);
});
