// Redesigned with Ant Design — logic unchanged
import { NavLink, useLocation } from "react-router-dom";
import { DashboardOutlined, SearchOutlined, ProfileOutlined, UserOutlined, BulbOutlined, UploadOutlined, LogoutOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Layout, Menu, Typography, Avatar } from "antd";
import { useState } from "react";

const { Sider } = Layout;
const { Text } = Typography;

const navItems = [
  { key: "/candidate", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/candidate/explore", icon: <SearchOutlined />, label: "Explore Jobs" },
  { key: "/candidate/applications", icon: <ProfileOutlined />, label: "My Applications" },
  { key: "/candidate/profile", icon: <UserOutlined />, label: "Profile" },
  { key: "/candidate/career-ai", icon: <BulbOutlined />, label: "Career AI" },
  { key: "/candidate/upload-cv", icon: <UploadOutlined />, label: "Upload CV" },
];

export function CandidateSidebar() {
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
      
      <div style={{ position: 'absolute', bottom: 60, width: '100%', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
         <NavLink to="/candidate/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', padding: '8px' }}>
            <Avatar size="small" style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#F97316', fontWeight: 'bold' }}>JD</Avatar>
            {!collapsed && <span>John Doe</span>}
         </NavLink>
         <NavLink to="/login" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4d4f', padding: '8px' }}>
            <LogoutOutlined style={{ fontSize: '18px' }} />
            {!collapsed && <span>Logout</span>}
         </NavLink>
      </div>
    </Sider>
  );
}
