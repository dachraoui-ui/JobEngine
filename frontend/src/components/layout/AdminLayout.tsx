// Redesigned with Ant Design — logic unchanged
import { ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, TeamOutlined, CheckSquareOutlined, SettingOutlined, BarChartOutlined, SafetyOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, Space, Typography } from "antd";
import { ThemeToggle } from "@/components/ThemeToggle";

const { Sider, Content } = Layout;
const { Text } = Typography;

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "/admin", icon: <HomeOutlined />, label: "System Core" },
    { key: "/admin/users", icon: <TeamOutlined />, label: "Users" },
    { key: "/admin/verifications", icon: <CheckSquareOutlined />, label: "Verifications" },
    { key: "/admin/config", icon: <SettingOutlined />, label: "Configuration" },
    { key: "/admin/reports", icon: <BarChartOutlined />, label: "Reports" },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        theme="dark"
        style={{ background: '#1B2D4F' }}
      >
        <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SafetyOutlined style={{ color: '#F97316', fontSize: '20px' }} />
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '18px', margin: 0, lineHeight: 1 }}><span style={{ color: '#F97316', fontWeight: 700 }}>Job</span><span style={{ color: '#FFFFFF', fontWeight: 700 }}>Engine</span></div>
              <Text style={{ color: '#F97316', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</Text>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
        <div style={{ position: 'absolute', bottom: 60, width: '100%', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '8px', flexDirection: collapsed ? 'column' : 'row', alignItems: 'center' }}>
          <ThemeToggle />
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            style={{ color: '#888', flex: 1 }} 
            onClick={() => navigate('/dashboard')}
          >
            {!collapsed && "Back"}
          </Button>
        </div>
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', overflowY: 'auto' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
