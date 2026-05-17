// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, ShieldCheck } from "lucide-react";
import { Card, Form, Input, Button, Checkbox, Typography, message, Divider } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { GoogleLogin } from "@react-oauth/google";
import { cn } from "@/lib/utils";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email: values.email, password: values.password });
      
      const { token, role, ...userData } = res.data.data;
      
      login(token, { ...userData, role });

      if (role === "CANDIDATE") navigate("/candidate");
      else if (role === "RECRUITER") navigate("/dashboard");
      else navigate("/admin");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Invalid email or password");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const res = await api.post('/auth/google', { 
        credential: credentialResponse.credential
      });
      
      const { token, role, ...userData } = res.data.data;
      login(token, { ...userData, role });

      if (role === "CANDIDATE") navigate("/candidate");
      else if (role === "RECRUITER") navigate("/dashboard");
      else navigate("/admin");
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Google authentication failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dot-grid relative flex items-center justify-center overflow-hidden px-4">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/[0.12] blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-secondary/[0.08] blur-[160px] pointer-events-none" />

      <div className={cn("relative z-10 w-full max-w-[440px] animate-scale-in", shake && "animate-shake")}>
        <Card bordered={false} style={{ background: 'var(--surface)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center glow-cyan animate-pulse-glow">
              <Zap className="w-6 h-6 text-primary" />
            </div>
          </div>

          <Title level={3} style={{ textAlign: 'center', marginBottom: '4px', color: 'var(--foreground)' }}>Welcome back</Title>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
             <Text type="secondary">Sign in to your neural network</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish} size="large">
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input prefix={<MailOutlined />} placeholder="you@company.com" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors" style={{ fontSize: '14px' }}>Forgot password?</a>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} style={{ height: '44px', fontWeight: 600 }}>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider plain><Text type="secondary" style={{ fontSize: '12px' }}>OR</Text></Divider>

          <div className="flex justify-center mt-2 w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                message.error("Google authentication failed");
                triggerShake();
              }}
              useOneTap
              theme="filled_black"
              shape="rectangular"
              text="continue_with"
              width="360px"
            />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to <span style={{ color: '#F97316', fontWeight: 700 }}>Job</span><span style={{ color: 'var(--foreground)', fontWeight: 700 }}>Engine</span>?{" "}
            <Link to="/register" className="text-primary hover:text-primary/80 transition-colors font-medium">
              Create an account →
            </Link>
          </p>
        </Card>

        <div className="flex items-center justify-center gap-1.5 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground/50" />
          <span className="text-[11px] text-muted-foreground/50">Secured with 256-bit encryption</span>
        </div>
      </div>
    </div>
  );
}
