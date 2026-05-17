// Redesigned with Ant Design — logic unchanged
import { Layout, Input, Button, Badge, Avatar, Space, Typography } from "antd";
import { SearchOutlined, BellOutlined } from "@ant-design/icons";
import { ThemeToggle } from "@/components/ThemeToggle";

const { Header } = Layout;
const { Title } = Typography;

export function CandidateTopBar({ title }: { title?: string }) {
  return (
    <Header style={{ background: 'transparent', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>{title || "Dashboard"}</Title>
      <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
        <Input 
          prefix={<SearchOutlined />} 
          placeholder="Search... ⌘K" 
          style={{ width: 200, borderRadius: 8 }}
        />
        <ThemeToggle />
        <Badge dot color="#F97316">
          <Button type="text" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
        </Badge>
        <Avatar style={{ backgroundColor: 'rgba(249, 115, 22, 0.15)', color: '#F97316', fontWeight: 'bold' }}>
          JD
        </Avatar>
      </Space>
    </Header>
  );
}
