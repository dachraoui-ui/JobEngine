// Redesigned with Ant Design — logic unchanged
import { BrainCircuit, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, Typography, Button, Row, Col, Tag, Progress } from "antd";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip as RechartsTooltip, PolarRadiusAxis } from "recharts";

const { Title, Text } = Typography;

const skillData = [
  { subject: "Frontend", A: 85, B: 90, fullMark: 100 },
  { subject: "Backend", A: 65, B: 80, fullMark: 100 },
  { subject: "DevOps", A: 40, B: 60, fullMark: 100 },
  { subject: "Databases", A: 75, B: 85, fullMark: 100 },
  { subject: "AI/ML", A: 20, B: 50, fullMark: 100 },
  { subject: "Soft Skills", A: 90, B: 85, fullMark: 100 },
];

export default function CareerAI() {
  return (
    <div className="space-y-8 animate-fade-in relative z-10 pb-10">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-violet-400" />
          <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Lab</Title>
        </div>
        <Text type="secondary">AI-powered career intelligence and skill gap analysis.</Text>
      </div>

      {/* Ambient background effects */}
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <Row gutter={[24, 24]}>
        {/* SECTION 1: CV Neural Scan */}
        <Col span={24}>
          <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 0 }} className="border-violet-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 border-[2px] border-transparent transition-all duration-1000 group-hover:border-violet-500/30 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.1), rgba(27,45,79,0.1)) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }} />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>CV Neural Scan</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>Last scan: 2 hours ago</Text>
                </div>
                <Button style={{ color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.5)', background: 'transparent' }}>Re-scan</Button>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Main Visual */}
                <div className="flex flex-col items-center shrink-0">
                  <Progress type="circle" percent={74} strokeColor="#4ECDC4" format={(p) => <span style={{ color: 'white', fontWeight: 'bold' }}>{p}</span>} size={120} trailColor="rgba(255,255,255,0.05)" />
                  <Text strong style={{ marginTop: 16, color: '#34d399' }}>CV Strength: Good</Text>
                </div>

                {/* Strengths & Improvements */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-4">
                    <Tag color="success" style={{ textTransform: 'uppercase', letterSpacing: 1, border: 'none' }}>Strengths</Tag>
                    <ul className="space-y-3 m-0 p-0" style={{ listStyle: 'none' }}>
                      <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Strong technical skills — 12 relevant technologies</li>
                      <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Clear career progression — 4 years, 2 companies</li>
                      <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> Education matches target roles</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <Tag color="warning" style={{ textTransform: 'uppercase', letterSpacing: 1, border: 'none' }}>Improvements</Tag>
                    <ul className="space-y-3 m-0 p-0" style={{ listStyle: 'none' }}>
                      <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-rose-500/20"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Add quantifiable achievements (metrics, numbers)</li>
                      <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-amber-500/20"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Missing professional summary section</li>
                      <li className="flex gap-2 text-sm text-muted-foreground bg-foreground/5 p-3 rounded-lg border border-foreground/10"><AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> Consider adding relevant certifications</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* SECTION 2: Skill Galaxy */}
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ background: 'var(--surface)', height: '100%' }} bodyStyle={{ padding: 24, height: '100%' }}>
            <div className="mb-4">
              <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Skill Galaxy</Title>
              <Text type="secondary" style={{ fontSize: 13 }}>Your skills mapped against market demand</Text>
            </div>

            <div className="h-[280px] w-full mt-4 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ fontSize: 13 }}
                  />
                  {/* Market Demand (Outlined) */}
                  <Radar name="Market Demand" dataKey="B" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="4 4" fill="transparent" />
                  {/* You (Filled) */}
                  <Radar name="You" dataKey="A" stroke="#F97316" strokeWidth={2} fill="#F97316" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { skill: "Docker", current: "Beginner", needed: "Advanced", gap: "HIGH GAP", color: "error" },
                { skill: "Kubernetes", current: "None", needed: "Intermediate", gap: "CRITICAL", color: "error" },
                { skill: "GraphQL", current: "Beginner", needed: "Intermediate", gap: "MEDIUM", color: "warning" },
              ].map((gap, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex-1">
                    <Text strong style={{ color: 'var(--foreground)', display: 'block', mb: 4 }}>{gap.skill}</Text>
                    <div className="flex gap-2 items-center text-xs text-muted-foreground w-full sm:w-48">
                      <div className="flex-1 h-1.5 bg-foreground/10 rounded-full relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 bg-cyan-400" style={{ width: gap.current === 'None' ? '5%' : '30%' }} />
                      </div>
                      <span>vs</span>
                      <div className="flex-1 h-1.5 bg-foreground/10 rounded-full relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 bg-violet-400" style={{ width: gap.needed === 'Advanced' ? '85%' : '50%' }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 justify-between sm:justify-end">
                    <Tag color={gap.color} bordered={false}>{gap.gap}</Tag>
                    <a href="#" className="flex items-center text-sm text-cyan-400 hover:text-cyan-300">📚 Learn</a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* SECTION 3: Neural Pathways */}
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ background: 'var(--surface)', height: '100%' }} bodyStyle={{ padding: 24 }}>
            <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Pathways</Title>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>AI-generated career trajectories</Text>

            <div className="space-y-4">
              {/* Path 1 */}
              <div className="border-t-2 border-t-cyan-400 bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white group-hover:text-cyan-400 transition-colors">Full Stack → Tech Lead</h3>
                    <p className="text-sm text-cyan-500 mt-0.5">~2-3 years journey • $130k—$180k</p>
                  </div>
                  <PulseOrb score={72} size="md" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Tag bordered={false}>Leadership</Tag>
                  <Tag bordered={false}>System Design</Tag>
                  <Tag bordered={false}>Architecture</Tag>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-sm text-cyan-400 group-hover:underline flex items-center gap-1">Explore Path <ExternalLink className="w-3 h-3" /></span>
                </div>
              </div>

              {/* Path 2 */}
              <div className="border-t-2 border-t-violet-400 bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white group-hover:text-violet-400 transition-colors">Full Stack → DevOps Engineer</h3>
                    <p className="text-sm text-violet-400 mt-0.5">~1-2 years journey • $120k—$170k</p>
                  </div>
                  <PulseOrb score={68} size="md" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Tag bordered={false}>Docker</Tag>
                  <Tag bordered={false}>Kubernetes</Tag>
                  <Tag bordered={false}>CI/CD</Tag>
                  <Tag bordered={false}>AWS</Tag>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-sm text-violet-400 group-hover:underline flex items-center gap-1">Explore Path <ExternalLink className="w-3 h-3" /></span>
                </div>
              </div>

              {/* Path 3 */}
              <div className="border-t-2 border-t-emerald-400 bg-foreground/5 rounded-b-xl p-5 hover:bg-foreground/10 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-white group-hover:text-emerald-400 transition-colors">Full Stack → Solutions Architect</h3>
                    <p className="text-sm text-emerald-400 mt-0.5">~3-5 years journey • $150k—$200k</p>
                  </div>
                  <PulseOrb score={55} size="md" />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Tag bordered={false}>Cloud Architecture</Tag>
                  <Tag bordered={false}>Microservices</Tag>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-sm text-emerald-400 group-hover:underline flex items-center gap-1">Explore Path <ExternalLink className="w-3 h-3" /></span>
                </div>
              </div>

            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
