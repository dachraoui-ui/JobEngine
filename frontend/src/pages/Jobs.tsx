// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Button, Card, Typography, Space, Row, Col, Segmented, Tag, Switch, Tooltip, Modal, Steps, Input, Select, Checkbox } from "antd";
import { PlusOutlined, TeamOutlined, EyeOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined, CheckOutlined } from "@ant-design/icons";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { MapPin, Briefcase } from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

const mockJobs = [
  { id: 1, title: "Senior React Developer", type: "Full-Time", location: "Remote", level: "Senior", skills: ["React", "TypeScript", "Node.js", "+2 more"], posted: "5 days ago", closes: "10 days", applicants: 23, status: "Active" },
  { id: 2, title: "Backend Engineer (Go)", type: "Full-Time", location: "New York", level: "Mid", skills: ["Go", "PostgreSQL", "Docker", "+1 more"], posted: "2 days ago", closes: "15 days", applicants: 45, status: "Active" },
  { id: 3, title: "Frontend Intern", type: "Internship", location: "Remote", level: "Junior", skills: ["CSS", "HTML", "JS"], posted: "1 day ago", closes: "20 days", applicants: 12, status: "Draft" },
  { id: 4, title: "Data Scientist", type: "Full-Time", location: "London", level: "Senior", skills: ["Python", "PyTorch", "SQL"], posted: "30 days ago", closes: "Closed", applicants: 89, status: "Closed" },
  { id: 5, title: "Product Designer", type: "Full-Time", location: "Remote", level: "Mid", skills: ["Figma", "UI/UX", "Prototyping"], posted: "4 days ago", closes: "11 days", applicants: 34, status: "Active" },
];

export default function Jobs() {
  const [filter, setFilter] = useState("Active");
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  
  const filteredJobs = mockJobs.filter(j => j.status === filter);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Command Center</Title>
          <Text type="secondary">5 Active Missions</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setCreateModalOpen(true)}
        >
          New Job
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={12} md={6}>
          <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <PulseOrb score={80} size="sm" />
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--foreground)' }}>8</div>
              <Text type="secondary" style={{ fontSize: 12 }}>Total Jobs</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="relative">
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              <PulseOrb score={90} size="sm" />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--foreground)' }}>5</div>
              <Text type="secondary" style={{ fontSize: 12 }}>Active</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(114,46,209,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TeamOutlined style={{ fontSize: 20, color: '#722ed1' }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--foreground)' }}>127</div>
              <Text type="secondary" style={{ fontSize: 12 }}>Total Applicants</Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
            <PulseOrb score={74} size="sm" />
            <div>
              <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--foreground)' }}>74%</div>
              <Text type="secondary" style={{ fontSize: 12 }}>Avg Match Score</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <div>
        <Segmented 
          options={['Active', 'Draft', 'Closed']} 
          value={filter} 
          onChange={(val) => setFilter(val as string)} 
          size="large"
        />
      </div>

      <div className="space-y-4">
        {filteredJobs.map(job => (
          <Card key={job.id} bordered={false} hoverable style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 20 }}>
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              {/* Left Section */}
              <div className="flex-1 space-y-3">
                <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>{job.title}</Title>
                <Space wrap size={[0, 8]}>
                  <Tag color="cyan" bordered={false}>{job.location}</Tag>
                  <Tag color="purple" bordered={false}>{job.type}</Tag>
                  <Tag color="orange" bordered={false}>{job.level}</Tag>
                </Space>
                <div style={{ marginTop: 8 }}>
                  <Space wrap size={[4, 4]}>
                    {job.skills.map(s => <Tag key={s}>{s}</Tag>)}
                  </Space>
                </div>
                <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                  Posted {job.posted} • Closes in {job.closes}
                </Text>
              </div>

              {/* Center Metrics */}
              <div className="flex flex-col items-center justify-center px-4 lg:border-x lg:border-foreground/10" style={{ borderColor: 'var(--border)' }}>
                <Space align="center" style={{ marginBottom: 8 }}>
                  <TeamOutlined style={{ color: 'var(--muted-foreground)' }} />
                  <span style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--foreground)' }}>{job.applicants}</span>
                </Space>
                <div className="flex items-end gap-1 h-6 shrink-0">
                  <Tooltip title="0-20 score"><div className="w-1.5 bg-rose-500/50 rounded-t h-[20%]" /></Tooltip>
                  <Tooltip title="20-40 score"><div className="w-1.5 bg-amber-500/50 rounded-t h-[40%]" /></Tooltip>
                  <Tooltip title="40-60 score"><div className="w-1.5 bg-emerald-500/50 rounded-t h-[80%]" /></Tooltip>
                  <Tooltip title="60-80 score"><div className="w-1.5 bg-cyan-500/50 rounded-t h-[60%]" /></Tooltip>
                  <Tooltip title="80-100 score"><div className="w-1.5 bg-violet-500/80 rounded-t h-[100%] shadow-[0_0_5px_rgba(139,92,246,0.5)]" /></Tooltip>
                </div>
                <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>Score Dist</Text>
              </div>

              {/* Right Actions */}
              <div className="flex flex-col items-end gap-4 min-w-[200px]">
                <Space align="center">
                  <Text type="secondary" style={{ fontSize: 12 }}>{job.status}</Text>
                  <Switch checked={job.status === 'Active'} />
                </Space>
                <Space>
                  <Button type="text" icon={<EyeOutlined />} shape="circle" />
                  <Button type="text" icon={<EditOutlined />} shape="circle" />
                  <Button type="text" danger icon={<DeleteOutlined />} shape="circle" />
                </Space>
                {job.status !== 'Draft' && (
                  <Button block type="primary" ghost style={{ marginTop: 8 }}>
                    Open Pipeline <ArrowRightOutlined />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Text type="secondary">No {filter.toLowerCase()} jobs found.</Text>
          </div>
        )}
      </div>

      <CreateJobModal open={isCreateModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
}

function CreateJobModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const steps = [
    { title: 'Basics' },
    { title: 'Skills' },
    { title: 'Culture' },
    { title: 'Review' }
  ];

  return (
    <Modal
      open={open}
      onCancel={() => { onOpenChange(false); setTimeout(() => setCurrent(0), 300); }}
      footer={null}
      width={640}
      destroyOnClose
      style={{ top: 40 }}
    >
      <div style={{ padding: '16px 0 24px 0' }}>
        <Steps current={current} items={steps} size="small" style={{ marginBottom: 32 }} />

        <div style={{ minHeight: 300 }}>
          {current === 0 && (
            <div className="animate-in slide-in-from-right-4">
              <Title level={4} style={{ marginTop: 0 }}>The Basics</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Core details about the position.</Text>
              
              <div className="space-y-4">
                <Input size="large" placeholder="Job Title (e.g. Senior Frontend Engineer)" />
                <TextArea rows={4} placeholder="Job Description..." />
                <Row gutter={16}>
                  <Col span={16}>
                    <Input size="large" prefix={<MapPin size={16} />} placeholder="Location" />
                  </Col>
                  <Col span={8}>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 8 }}>
                      <Checkbox defaultChecked>Remote OK</Checkbox>
                    </div>
                  </Col>
                </Row>
                <Segmented block options={['Part-Time', 'Full-Time', 'Internship']} defaultValue="Full-Time" size="large" />
              </div>
            </div>
          )}

          {current === 1 && (
            <div className="animate-in slide-in-from-right-4">
              <Title level={4} style={{ marginTop: 0 }}>Required Skills</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Define what makes a great candidate.</Text>
              
              <div className="space-y-6">
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Must-Have Skills</Text>
                  <Select mode="tags" style={{ width: '100%' }} size="large" placeholder="Start typing a skill..." defaultValue={['React', 'TypeScript']} />
                </div>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>Nice-to-Have</Text>
                  <Select mode="tags" style={{ width: '100%' }} size="large" placeholder="Optional skills..." defaultValue={['GraphQL']} />
                </div>
              </div>
            </div>
          )}

          {current === 2 && (
            <div className="animate-in slide-in-from-right-4">
              <Title level={4} style={{ marginTop: 0 }}>Culture & Values</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Select the traits that fit your team. (Max 6)</Text>
              
              <Row gutter={[12, 12]}>
                {["Innovation", "Teamwork", "Diversity", "Work-Life Balance", "Growth", "Transparency", "Remote-First", "Fast-Paced", "Mentorship"].map((v, i) => {
                  const isSelected = i === 0 || i === 1 || i === 6;
                  return (
                    <Col span={8} key={v}>
                      <Card 
                        size="small" 
                        hoverable 
                        style={{ 
                          textAlign: 'center', 
                          borderColor: isSelected ? '#F97316' : undefined,
                          background: isSelected ? 'rgba(249,115,22,0.05)' : undefined 
                        }}
                      >
                        <Text strong={isSelected} style={{ color: isSelected ? '#F97316' : undefined }}>{v}</Text>
                        {isSelected && <CheckOutlined style={{ color: '#F97316', marginLeft: 8 }} />}
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}

          {current === 3 && (
            <div className="animate-in slide-in-from-right-4">
              <Title level={4} style={{ marginTop: 0 }}>Review & Publish</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>Final check before going live.</Text>
              
              <Card style={{ background: 'rgba(0,0,0,0.02)' }}>
                <Title level={5}>Senior Frontend Engineer</Title>
                <Space style={{ marginBottom: 16 }}>
                  <Tag icon={<MapPin size={12} />} bordered={false}>Remote</Tag>
                  <Tag icon={<Briefcase size={12} />} bordered={false}>Full-Time</Tag>
                </Space>
                
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Skills Required</Text>
                  <Space><Tag color="blue">React</Tag><Tag color="blue">TypeScript</Tag></Space>
                </div>
                
                <div>
                  <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Culture Match</Text>
                  <Text type="secondary" style={{ fontSize: 13 }}>Innovation • Teamwork • Remote-First</Text>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          {current > 0 ? <Button onClick={prev}>Back</Button> : <div />}
          <Space>
            {current === 3 && <Button>Save as Draft</Button>}
            {current < steps.length - 1 && <Button type="primary" onClick={next}>Next <ArrowRightOutlined /></Button>}
            {current === steps.length - 1 && <Button type="primary" onClick={() => onOpenChange(false)}>Publish Job ✨</Button>}
          </Space>
        </div>
      </div>
    </Modal>
  );
}
