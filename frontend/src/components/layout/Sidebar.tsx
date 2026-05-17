// Redesigned with Ant Design — logic unchanged
import { NavLink, useLocation } from "react-router-dom";
import { DashboardOutlined, AppstoreOutlined, TeamOutlined, BranchesOutlined, BarChartOutlined, SettingOutlined, LogoutOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Layout, Menu, Typography } from "antd";
import { useState } from "react";

const { Sider } = Layout;
const { Text } = Typography;

const navItems = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/jobs", icon: <AppstoreOutlined />, label: "Jobs" },
  { key: "/candidates", icon: <TeamOutlined />, label: "Candidates" },
  { key: "/pipeline", icon: <BranchesOutlined />, label: "Pipeline" },
  { key: "/analytics", icon: <BarChartOutlined />, label: "Analytics" },
  { key: "/settings", icon: <SettingOutlined />, label: "Settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <Sider 
      collapsible 
      collapsed={collapsed} 
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      theme="dark"
      width={260}
      style={{ background: '#1B2D4F' }}
    >
      <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(249, 115, 22, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ThunderboltOutlined style={{ color: '#F97316', fontSize: '20px' }} />
        </div>
        {!collapsed && (
          <div style={{ fontSize: '18px', margin: 0 }}><span style={{ color: '#F97316', fontWeight: 700 }}>Job</span><span style={{ color: '#FFFFFF', fontWeight: 700 }}>Engine</span></div>
        )}
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={navItems.map(item => ({
          ...item,
          label: <NavLink to={item.key}>{item.label}</NavLink>
        }))}
      />
      
      <div style={{ position: 'absolute', bottom: 60, width: '100%', padding: '16px' }}>
         <NavLink to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4f', padding: '8px', borderRadius: '8px' }}>
            <LogoutOutlined style={{ fontSize: '18px' }} />
            {!collapsed && <span>Logout</span>}
         </NavLink>
      </div>
    </Sider>
  );
}
