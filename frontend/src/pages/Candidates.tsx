// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Card, Button, Typography, Tag, Space, Input, Segmented, Row, Col, Checkbox, Slider, Drawer, Progress } from "antd";
import { SearchOutlined, CloseOutlined, DownloadOutlined, PlusOutlined, LayoutOutlined, UnorderedListOutlined, GlobalOutlined, LockOutlined, MailOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { PulseOrb } from "@/components/ui/PulseOrb";

const { Title, Text } = Typography;

// ─── Mock Data ──────────────────────────────────────────────────────────────
const SKILL_COLORS: Record<string, string> = {
  React: "cyan",
  TypeScript: "cyan",
  "Node.js": "cyan",
  Python: "purple",
  Docker: "green",
  AWS: "green",
  GraphQL: "orange",
};

const mockCandidates = [
  {
    id: "c1", initials: "AC", avatarColor: "bg-cyan-500/20 text-cyan-400", name: "Alex Chen",
    role: "Full Stack Developer", experience: "4 years", education: "BS Computer Science, MIT",
    score: 92, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript", "Next.js"], Backend: ["Node.js", "Python"], DevOps: ["Docker", "AWS"] },
    values: ["Remote-First", "Innovation", "Growth"],
  },
  {
    id: "c2", initials: "MR", avatarColor: "bg-violet-500/20 text-violet-400", name: "Maya Rodriguez",
    role: "Frontend Engineer", experience: "3 years", education: "BS Software Engineering, Stanford",
    score: 87, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript", "Vue.js"], Backend: ["Node.js"], DevOps: [] },
    values: ["Teamwork", "Innovation"],
  },
  {
    id: "c3", initials: "JB", avatarColor: "bg-amber-500/20 text-amber-400", name: "James Boateng",
    role: "Backend Engineer", experience: "6 years", education: "BS Computer Engineering, UC Berkeley",
    score: 84, visibility: "Verified Only",
    skills: { Frontend: [], Backend: ["Python", "Node.js", "Go"], DevOps: ["Docker", "AWS", "Kubernetes"] },
    values: ["Transparency", "Remote-First"],
  },
  {
    id: "c4", initials: "SL", avatarColor: "bg-emerald-500/20 text-emerald-400", name: "Sara Liu",
    role: "DevOps Engineer", experience: "5 years", education: "BS Systems Engineering, Carnegie Mellon",
    score: 79, visibility: "Public",
    skills: { Frontend: [], Backend: ["Python"], DevOps: ["AWS", "Docker", "Terraform", "CI/CD"] },
    values: ["Fast-Paced", "Innovation"],
  },
  {
    id: "c5", initials: "KA", avatarColor: "bg-rose-500/20 text-rose-400", name: "Kenji Aizawa",
    role: "Mobile Developer", experience: "2 years", education: "BS Computer Science, Tokyo University",
    score: 72, visibility: "Public",
    skills: { Frontend: ["React", "React Native"], Backend: ["Node.js"], DevOps: [] },
    values: ["Growth", "Mentorship"],
  },
  {
    id: "c6", initials: "NN", avatarColor: "bg-indigo-500/20 text-indigo-400", name: "Nina Novak",
    role: "Data Scientist", experience: "4 years", education: "MSc Data Science, ETH Zurich",
    score: 76, visibility: "Verified Only",
    skills: { Frontend: [], Backend: ["Python", "R"], DevOps: ["Docker"] },
    values: ["Innovation", "Growth"],
  },
  {
    id: "c7", initials: "TP", avatarColor: "bg-teal-500/20 text-teal-400", name: "Tom Park",
    role: "Solutions Architect", experience: "8 years", education: "BS Computer Science, KAIST",
    score: 95, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript"], Backend: ["Node.js", "Python", "Java"], DevOps: ["AWS", "Docker"] },
    values: ["Remote-First", "Transparency", "Innovation"],
  },
  {
    id: "c8", initials: "ZM", avatarColor: "bg-pink-500/20 text-pink-400", name: "Zoe Martin",
    role: "UI/UX + Frontend Developer", experience: "3 years", education: "BS HCI, Carnegie Mellon",
    score: 81, visibility: "Public",
    skills: { Frontend: ["React", "TypeScript", "CSS"], Backend: [], DevOps: [] },
    values: ["Teamwork", "Work-Life Balance"],
  },
];

const MATCHED_SKILLS = ["React", "TypeScript", "Node.js"];

// ─── Sub-components ──────────────────────────────────────────────────────────
function DetailPanel({ candidate, onClose }: { candidate: typeof mockCandidates[0]; onClose: () => void }) {
  return (
    <div className="w-full h-full flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-20 h-20 rounded-full ${candidate.avatarColor} flex items-center justify-center text-2xl font-bold border border-foreground/10 shrink-0`}>
            {candidate.initials}
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'var(--foreground)' }}>{candidate.name}</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>{candidate.role}</Text>
            {candidate.visibility === "Public"
              ? <Tag icon={<GlobalOutlined />} color="success" bordered={false}>Public</Tag>
              : <Tag icon={<LockOutlined />} color="warning" bordered={false}>Verified Only</Tag>
            }
          </div>
        </div>
      </div>

      {/* Score */}
      <Card bordered={false} style={{ background: 'rgba(0,0,0,0.02)', marginBottom: 24 }}>
        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 16 }}>AI Match Score</Text>
        <div className="flex items-center gap-4">
          <PulseOrb score={candidate.score} size="lg" />
          <div className="flex-1 space-y-3">
            {[["Skills Match", 95], ["Experience", 88], ["Culture Fit", 80]].map(([label, pct]) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs mb-1">
                  <Text type="secondary">{label as string}</Text>
                  <span style={{ color: (pct as number) >= 75 ? '#F97316' : (pct as number) >= 50 ? '#4ECDC4' : '#ff4d4f' }}>{pct}%</span>
                </div>
                <Progress percent={pct as number} showInfo={false} strokeColor={(pct as number) >= 75 ? '#F97316' : (pct as number) >= 50 ? '#4ECDC4' : '#ff4d4f'} trailColor="rgba(0,0,0,0.2)" size="small" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Skills by Category */}
      <div className="space-y-4 mb-6">
        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Skills</Text>
        {Object.entries(candidate.skills).map(([category, skills]) => skills.length > 0 && (
          <div key={category}>
            <Text strong style={{ display: 'block', marginBottom: 8, color: category === "Frontend" ? '#F97316' : category === "Backend" ? '#8B5CF6' : '#10b981' }}>
              {category}
            </Text>
            <Space wrap size={[0, 8]}>
              {skills.map(s => (
                <Tag key={s} color={MATCHED_SKILLS.includes(s) ? SKILL_COLORS[s] || 'blue' : 'default'} bordered={!MATCHED_SKILLS.includes(s)}>
                  {s}
                </Tag>
              ))}
            </Space>
          </div>
        ))}
      </div>

      {/* Experience & Education */}
      <Card bordered={false} style={{ background: 'rgba(0,0,0,0.02)', marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Experience</Text>
          <Text strong style={{ fontFamily: 'monospace' }}>{candidate.experience}</Text>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>Education</Text>
          <Text type="secondary">{candidate.education}</Text>
        </div>
      </Card>

      {/* Culture Values */}
      <div className="mb-8">
        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 12 }}>Culture Values</Text>
        <Space wrap>
          {candidate.values.map(v => (
            <Tag key={v} color="purple" bordered={false}>{v}</Tag>
          ))}
        </Space>
      </div>

      {/* Actions */}
      <div className="space-y-3 mt-auto">
        <Button block icon={<DownloadOutlined />}>
          Download CV
        </Button>
        <Button block type="primary" icon={<ThunderboltOutlined />}>
          Invite to Apply
        </Button>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Candidates() {
  const [searchSkills, setSearchSkills] = useState(["React", "TypeScript", "Node.js"]);
  const [minScore, setMinScore] = useState(70);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Best Match");
  const [scanned, setScanned] = useState(true);

  const selectedCandidate = mockCandidates.find(c => c.id === selectedId);

  const sorted = [...mockCandidates]
    .filter(c => c.score >= minScore)
    .sort((a, b) => sort === "Best Match" ? b.score - a.score : a.name.localeCompare(b.name));

  return (
    <div className="flex gap-0 h-full animate-fade-in relative">
      {/* Main Content */}
      <div className={`flex-1 min-w-0 space-y-6 pb-10 transition-all duration-300 ${selectedCandidate ? "pr-4" : ""}`}>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SearchOutlined className="text-3xl text-cyan-400" />
            <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Scanner</Title>
          </div>
          <Text type="secondary" style={{ marginLeft: 36 }}>Discover and connect with top talent</Text>
        </div>

        {/* Search Panel */}
        <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 24 }}>
          <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 16 }}>Scan for candidates matching...</Text>

          {/* Skills Tag Input */}
          <div className="flex flex-wrap gap-2 mb-6 p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'rgba(0,0,0,0.02)' }}>
            {searchSkills.map(skill => (
              <Tag key={skill} closable onClose={() => setSearchSkills(searchSkills.filter(s => s !== skill))} color="cyan" bordered={false} style={{ padding: '4px 12px', fontSize: 14 }}>
                {skill}
              </Tag>
            ))}
            <Input
              variant="borderless"
              placeholder="+ Add skill..."
              style={{ width: 120 }}
            />
          </div>

          {/* Filters Row */}
          <Row gutter={[24, 24]} align="middle">
            <Col>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Experience</Text>
              <Space size="large">
                <Checkbox>Junior</Checkbox>
                <Checkbox defaultChecked>Mid</Checkbox>
                <Checkbox defaultChecked>Senior</Checkbox>
              </Space>
            </Col>

            <Col flex="auto" style={{ minWidth: 200 }}>
              <div className="flex justify-between mb-1">
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Min Score</Text>
                <Text strong style={{ color: '#F97316', fontFamily: 'monospace' }}>{minScore}</Text>
              </div>
              <Slider min={0} max={100} value={minScore} onChange={setMinScore} trackStyle={{ background: '#F97316' }} />
            </Col>

            <Col>
              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>Availability</Text>
              <Segmented options={['All', 'Active', 'Open']} defaultValue="Open" />
            </Col>
          </Row>

          {/* Scan Actions */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', gap: 12 }}>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => setScanned(true)}>
              Scan
            </Button>
            <Button type="text">Clear</Button>
          </div>
        </Card>

        {/* Results Bar */}
        {scanned && (
          <div className="flex items-center justify-between flex-wrap gap-4">
            <Text type="secondary">
              <Text strong style={{ color: 'var(--foreground)', fontFamily: 'monospace' }}>{sorted.length}</Text> candidates found
            </Text>
            <Space>
              <Segmented options={['Best Match', 'Experience', 'Recent']} value={sort} onChange={setSort} />
              <Segmented options={[
                { value: 'grid', icon: <LayoutOutlined /> },
                { value: 'list', icon: <UnorderedListOutlined /> }
              ]} value={view} onChange={setView as any} />
            </Space>
          </div>
        )}

        {/* Candidate Grid */}
        {scanned && (
          <div className={view === "grid" ? "grid grid-cols-1 xl:grid-cols-2 gap-4" : "space-y-3"}>
            {sorted.map(candidate => {
              const allSkills = Object.values(candidate.skills).flat().slice(0, 5);
              const isSelected = selectedId === candidate.id;
              
              return (
                <Card
                  key={candidate.id}
                  bordered={false}
                  hoverable
                  style={{ 
                    background: 'var(--surface)', 
                    borderColor: isSelected ? '#F97316' : 'transparent',
                    borderWidth: 1,
                    borderStyle: 'solid'
                  }}
                  bodyStyle={{ padding: 20 }}
                  onClick={() => setSelectedId(isSelected ? null : candidate.id)}
                >
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-full ${candidate.avatarColor} flex items-center justify-center text-xl font-bold border border-foreground/10 shrink-0`}>
                      {candidate.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <div>
                          <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>{candidate.name}</Title>
                          <Text type="secondary" style={{ fontSize: 13 }}>{candidate.role}</Text>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <PulseOrb score={candidate.score} size="md" />
                          {candidate.visibility === "Public"
                            ? <Tag icon={<GlobalOutlined />} color="success" bordered={false} style={{ margin: 0, fontSize: 10 }}>Public</Tag>
                            : <Tag icon={<LockOutlined />} color="warning" bordered={false} style={{ margin: 0, fontSize: 10 }}>Verified</Tag>
                          }
                        </div>
                      </div>

                      <Text strong style={{ color: '#F97316', fontFamily: 'monospace', fontSize: 13, display: 'block', marginBottom: 4 }}>{candidate.experience} experience</Text>
                      <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 12 }}>{candidate.education}</Text>

                      <Space wrap size={[0, 8]} style={{ marginBottom: 16 }}>
                        {allSkills.map(skill => (
                          <Tag key={skill} color={MATCHED_SKILLS.includes(skill) ? SKILL_COLORS[skill] || 'blue' : 'default'} bordered={!MATCHED_SKILLS.includes(skill)}>
                            {skill}
                          </Tag>
                        ))}
                      </Space>

                      <Space>
                        <Button size="small">View Profile</Button>
                        <Button size="small" type="primary" ghost icon={<MailOutlined />}>Invite to Apply</Button>
                      </Space>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Slide Panel */}
      <div className={`shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${selectedCandidate ? "w-[440px] opacity-100 pl-6" : "w-0 opacity-0"}`}>
        {selectedCandidate && (
          <div className="w-[440px] sticky top-0 h-[calc(100vh-6rem)] overflow-y-auto">
            <Card bordered={false} style={{ background: 'var(--surface)', height: '100%', boxShadow: '-20px 0 60px rgba(0,0,0,0.3)' }} bodyStyle={{ padding: 24, height: '100%' }}>
              <DetailPanel candidate={selectedCandidate} onClose={() => setSelectedId(null)} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
