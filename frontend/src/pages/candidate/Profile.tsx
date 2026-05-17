// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Card, Button, Input, Tag, Typography, Row, Col, Space } from "antd";
import { GlobalOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Profile() {
  const [skills, setSkills] = useState(["React", "TypeScript", "Node.js", "MongoDB", "Python"]);
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto pb-10">
      <div className="flex flex-col gap-1">
        <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>My Profile</Title>
        <Text type="secondary">Manage your personal information and neural preferences.</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          {/* Avatar Card */}
          <Card bordered={false} style={{ background: 'var(--surface)', textAlign: 'center' }} bodyStyle={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(249,115,22,0.2)]" style={{ background: 'rgba(249, 115, 22, 0.1)', border: '2px solid rgba(249, 115, 22, 0.5)' }}>
              <span className="text-3xl font-bold text-primary">NT</span>
            </div>
            <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Talent</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>Software Engineer</Text>
            <Tag color="success" icon={<GlobalOutlined />} style={{ padding: '4px 12px', borderRadius: 16 }}>
              Public Profile
            </Tag>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <div className="space-y-6">
            {/* Personal Info */}
            <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 24 }}>
              <Title level={4} style={{ color: 'var(--foreground)', marginBottom: 24 }}>Basic Information</Title>
              <div className="space-y-4">
                <Row gutter={16}>
                  <Col span={12}>
                    <div className="space-y-2">
                      <Text type="secondary" style={{ fontSize: 13 }}>First Name</Text>
                      <Input size="large" defaultValue="Neural" />
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="space-y-2">
                      <Text type="secondary" style={{ fontSize: 13 }}>Last Name</Text>
                      <Input size="large" defaultValue="Talent" />
                    </div>
                  </Col>
                </Row>
                <div className="space-y-2">
                  <Text type="secondary" style={{ fontSize: 13 }}>Email (Read Only)</Text>
                  <Input size="large" defaultValue="talent@neural.org" disabled />
                </div>
                <div className="space-y-2">
                  <Text type="secondary" style={{ fontSize: 13 }}>Professional Summary</Text>
                  <TextArea size="large" defaultValue="Passionate software engineer focused on building scalable web applications. AI and neural networks enthusiast." rows={4} />
                </div>
              </div>
              <Button type="primary" size="large" className="glow-cyan" style={{ marginTop: 24 }}>Save Changes</Button>
            </Card>

            {/* Skills Management */}
            <Card bordered={false} style={{ background: 'var(--surface)', borderColor: 'var(--secondary)', borderWidth: 1, borderStyle: 'solid', position: 'relative', overflow: 'hidden' }} bodyStyle={{ padding: 24 }}>
               <div className="absolute w-full h-1 bg-gradient-to-r from-primary to-secondary top-0 left-0" />
              <div className="flex justify-between items-center mb-6">
                 <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Skills</Title>
                 <Tag color="purple" bordered={false}>Auto-synced with CV</Tag>
              </div>
              
              <Space wrap size={[8, 8]}>
                {skills.map(skill => (
                  <Tag 
                    key={skill} 
                    closable 
                    onClose={() => setSkills(skills.filter(s => s !== skill))}
                    color="cyan"
                    style={{ padding: '4px 10px', fontSize: 14 }}
                  >
                    {skill}
                  </Tag>
                ))}
                <Input 
                  size="small"
                  placeholder="+ Add Skill" 
                  style={{ width: 100, borderRadius: 16, borderStyle: 'dashed' }}
                  onKeyDown={(e: any) => { if (e.key === 'Enter' && e.target.value) { setSkills([...skills, e.target.value]); e.target.value = ''; } }} 
                />
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
