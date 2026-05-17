// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, User, Building2, ChevronRight, ShieldCheck, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import { Card, Form, Input, Select, Button, Checkbox, message, Typography, Steps } from "antd";
import { MailOutlined, LockOutlined, GlobalOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

type Role = "candidate" | "recruiter" | null;

function AnimatedCheckmark() {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center glow-mint">
        <svg viewBox="0 0 52 52" className="w-10 h-10">
          <circle cx="26" cy="26" r="24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" className="animate-draw-circle" />
          <path fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" className="animate-draw-check" />
        </svg>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  
  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }
    if (!values.agreed) {
      message.error("You must agree to the terms.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: "", 
        role: role?.toUpperCase(),
      };

      const res = await api.post('/auth/register', payload);
      const { token, role: userRole, ...userData } = res.data.data;
      
      login(token, { ...userData, role: userRole });
      
      setStep(3);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to register. Email may be taken.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!role) {
      message.error("Please select a role before continuing with Google.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/auth/google', { 
        credential: credentialResponse.credential,
        role: role.toUpperCase()
      });
      
      const { token, role: userRole, ...userData } = res.data.data;
      login(token, { ...userData, role: userRole });
      setStep(3);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Google registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const industries = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Media", "Other"];

  return (
    <div className="min-h-screen bg-background dot-grid relative flex items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/[0.12] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.08] blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[520px] animate-scale-in">
        <Card bordered={false} style={{ background: 'var(--surface)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-cyan animate-pulse-glow">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>

          {step < 3 && (
            <>
              <Title level={3} style={{ textAlign: 'center', marginBottom: '4px', color: 'var(--foreground)' }}>Join <span style={{ color: '#F97316', fontWeight: 700 }}>Job</span><span style={{ color: 'var(--foreground)', fontWeight: 700 }}>Engine</span></Title>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                 <Text type="secondary">Create your account and start connecting</Text>
              </div>
            </>
          )}

          {step < 3 && (
            <Steps 
              current={step - 1} 
              items={[{ title: 'Role' }, { title: 'Details' }, { title: 'Done' }]} 
              style={{ marginBottom: '32px' }} 
            />
          )}

          {/* ─── STEP 1: Role ─── */}
          {step === 1 && (
            <div className="animate-fade-in space-y-6">
              <p className="text-sm font-medium text-foreground text-center">I am a...</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setRole("candidate")}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-200 relative group",
                    role === "candidate"
                      ? "border-primary/40 bg-primary/5 scale-[1.02] glow-cyan"
                      : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.12]"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", role === "candidate" ? "bg-primary/20" : "bg-foreground/5")}>
                    <User className={cn("w-5 h-5", role === "candidate" ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">Candidate</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Find jobs matched to your skills by AI</p>
                </button>

                <button
                  onClick={() => setRole("recruiter")}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-200 relative group",
                    role === "recruiter"
                      ? "border-secondary/40 bg-secondary/5 scale-[1.02] glow-violet"
                      : "border-foreground/[0.06] bg-foreground/[0.02] hover:border-foreground/[0.12]"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", role === "recruiter" ? "bg-secondary/20" : "bg-foreground/5")}>
                    <Building2 className={cn("w-5 h-5", role === "recruiter" ? "text-secondary" : "text-muted-foreground")} />
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-1">Recruiter</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">Find perfect candidates</p>
                </button>
              </div>

              <Button
                type="primary"
                onClick={() => { if (role) setStep(2); }}
                disabled={!role}
                block
                size="large"
                style={{ height: '44px' }}
              >
                Continue with Email <ChevronRight className="w-4 h-4" />
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-surface px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="flex justify-center w-full" onClick={() => { if (!role) message.error("Please select a role first."); }}>
                <div className={cn(!role && "opacity-50 pointer-events-none")}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => message.error("Google authentication failed")}
                    useOneTap
                    theme="filled_black"
                    shape="rectangular"
                    text="signup_with"
                    width="440px"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Form ─── */}
          {step === 2 && (
            <Form form={form} layout="vertical" onFinish={onFinish} size="large" className="animate-slide-in-right">
              <div style={{ display: 'flex', gap: '16px' }}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input placeholder="John" />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]} style={{ flex: 1 }}>
                  <Input placeholder="Doe" />
                </Form.Item>
              </div>

              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input prefix={<MailOutlined />} placeholder="you@company.com" />
              </Form.Item>

              <Form.Item name="password" label="Password" rules={[{ required: true, min: 6 }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
              </Form.Item>

              <Form.Item name="confirmPassword" label="Confirm Password" rules={[{ required: true }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
              </Form.Item>

              {role === "recruiter" && (
                <>
                  <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                    <Input placeholder="Acme Inc." />
                  </Form.Item>
                  <Form.Item name="industry" label="Industry" rules={[{ required: true }]}>
                    <Select placeholder="Select industry" options={industries.map(ind => ({ label: ind, value: ind }))} />
                  </Form.Item>
                  <Form.Item name="website" label="Website (optional)">
                    <Input prefix={<GlobalOutlined />} placeholder="https://company.com" />
                  </Form.Item>
                </>
              )}

              <Form.Item name="agreed" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must agree to terms')) }]}>
                <Checkbox>I agree to the Terms of Service and Privacy Policy</Checkbox>
              </Form.Item>

              <div style={{ display: 'flex', gap: '16px' }}>
                <Button onClick={() => setStep(1)} size="large" style={{ width: '100px' }}>Back</Button>
                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                  Create Account
                </Button>
              </div>
            </Form>
          )}

          {/* ─── STEP 3: Success ─── */}
          {step === 3 && (
            <div className="text-center animate-scale-in py-4">
              <AnimatedCheckmark />
              <Title level={3} style={{ color: 'var(--foreground)' }}>Welcome to <span style={{ color: '#F97316', fontWeight: 700 }}>Job</span><span style={{ color: 'var(--foreground)', fontWeight: 700 }}>Engine</span>! 🚀</Title>
              {role === "candidate" ? (
                <>
                  <p className="text-sm text-muted-foreground mb-8">Let's upload your CV and start matching.</p>
                  <Button type="primary" size="large" onClick={() => navigate("/candidate/upload-cv")} block icon={<Sparkles className="w-4 h-4" />}>
                    Upload CV
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-8">Your account is pending verification. We'll review it within 24 hours.</p>
                  <Button type="primary" size="large" onClick={() => navigate("/dashboard")} block>
                    Go to Dashboard
                  </Button>
                </>
              )}
            </div>
          )}

          {step < 3 && (
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-medium">Sign in →</Link>
            </p>
          )}
        </Card>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-[11px] text-muted-foreground/50">Secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
