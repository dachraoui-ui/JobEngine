// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { Modal, Button, Typography, Tag, Space, Dropdown, Row, Col } from "antd";
import { MailOutlined, CalendarOutlined, EyeOutlined, ArrowRightOutlined, FileTextOutlined, DownOutlined, ThunderboltOutlined, CloseOutlined } from "@ant-design/icons";
import { PulseOrb } from "@/components/ui/PulseOrb";

const { Title, Text } = Typography;

export default function Pipeline() {
  const [draggedCard, setDraggedCard] = useState<number | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  const columns = [
    { id: "applied", title: "Applied", count: 8, color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.5)" },
    { id: "shortlisted", title: "Shortlisted", count: 5, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.5)", glow: "shadow-[0_0_10px_rgba(245,158,11,0.5)]" },
    { id: "interview", title: "Interview", count: 3, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.5)", glow: "shadow-[0_0_10px_rgba(139,92,246,0.5)]" },
    { id: "rejected", title: "Rejected", count: 4, color: "#f43f5e", bg: "rgba(244,63,94,0.1)", border: "rgba(244,63,94,0.5)", glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]" },
    { id: "hired", title: "Hired", count: 1, color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.5)", glow: "shadow-[0_0_15px_rgba(16,185,129,0.6)]" },
  ];

  const handleDragStart = (e: React.DragEvent, cardId: number) => {
    setDraggedCard(cardId);
    e.dataTransfer.setData("cardId", cardId.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="animate-fade-in flex flex-col h-full overflow-hidden absolute inset-0 pt-6 px-6 pb-2">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 shrink-0">
        <Dropdown menu={{ items: [{ key: '1', label: 'Senior React Developer' }] }}>
          <div className="p-3 cursor-pointer hover:bg-foreground/10 flex items-center justify-between w-[300px] border border-foreground/10 rounded-lg bg-surface transition-colors">
            <span className="font-bold text-lg text-white">Senior React Developer</span>
            <DownOutlined className="text-muted-foreground" />
          </div>
        </Dropdown>
        <div className="flex gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><span className="text-white font-mono text-lg font-bold">23</span> Candidates</div>
          <div className="flex items-center gap-2 text-muted-foreground"><span className="text-cyan-400 font-mono text-lg font-bold">74%</span> Avg Score</div>
          <div className="flex items-center gap-2 text-muted-foreground"><span className="text-emerald-400 font-mono text-lg font-bold">5.2d</span> Pipeline Avg</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4 h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {columns.map(col => (
          <div key={col.id} className="min-w-[280px] w-[280px] flex flex-col h-full rounded-xl bg-foreground/[0.02] border border-foreground/5 relative overflow-hidden" onDragOver={handleDragOver}>
            {/* Accent Strip */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${col.glow || ''}`} style={{ backgroundColor: col.color }} />
            
            <div className="p-4 border-b border-foreground/5 flex justify-between items-center bg-foreground/[0.01]">
              <h3 className="font-semibold text-white">{col.title}</h3>
              <span className="bg-foreground/10 text-muted-foreground text-xs px-2 py-0.5 rounded-full font-mono">{col.count}</span>
            </div>

            <div className="p-3 flex-1 overflow-y-auto space-y-3">
              {[...Array(col.count)].map((_, i) => (
                <div 
                  key={`${col.id}-${i}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onClick={() => setSelectedCandidate({ name: "Alex Chen", score: 92, colId: col.id })}
                  className={`bg-surface border border-foreground/10 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:-translate-y-1 transition-all duration-200 group relative ${col.id === 'rejected' ? 'opacity-70' : ''}`}
                  style={{ '&:hover': { borderColor: col.color } } as any}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">AC</div>
                       <span className="text-sm font-bold text-white shrink-0">Alex Chen</span>
                    </div>
                    <PulseOrb score={92 - (i*5)} size="sm" />
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Tag bordered={false}>React</Tag>
                    <Tag bordered={false}>TS</Tag>
                  </div>

                  {col.id === 'interview' && (
                    <div className="mb-2 text-[11px] py-1 px-2 rounded-md flex items-center border" style={{ color: '#b37feb', backgroundColor: 'rgba(114,46,209,0.1)', borderColor: 'rgba(114,46,209,0.2)' }}>
                      📅 Mar 22, 2:00 PM
                    </div>
                  )}

                  <div className="text-[11px] text-muted-foreground/80 flex justify-between items-center">
                    Applied 3d ago
                    <div className="hidden group-hover:flex gap-1">
                       <Button type="text" size="small" icon={<EyeOutlined />} style={{ color: 'var(--muted-foreground)' }} />
                       <Button type="text" size="small" icon={<MailOutlined />} style={{ color: 'var(--muted-foreground)' }} />
                    </div>
                  </div>

                  {col.id === 'hired' && (
                     <div className="absolute inset-0 pointer-events-none rounded-lg border border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.3)] animate-pulse" />
                  )}
                </div>
              ))}

              {col.count === 0 && (
                <div className="h-32 border-2 border-dashed border-foreground/10 rounded-lg flex items-center justify-center text-muted-foreground/80 text-sm">
                  Drag candidates here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={!!selectedCandidate}
        onCancel={() => setSelectedCandidate(null)}
        footer={null}
        width={720}
        closeIcon={<CloseOutlined style={{ color: 'var(--muted-foreground)' }} />}
        style={{ top: 40 }}
        bodyStyle={{ padding: 0, overflow: 'hidden', background: 'var(--surface)' }}
      >
        {selectedCandidate && (
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-[60%] p-6 border-b md:border-b-0 md:border-r border-foreground/10 relative">
              <div className="flex gap-4 items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-bold border border-cyan-500/30">AC</div>
                <div>
                  <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Alex Chen</Title>
                  <Text type="secondary" style={{ fontSize: 13 }}>alex.chen@example.com</Text>
                </div>
              </div>

              <Button block icon={<FileTextOutlined />} style={{ marginBottom: 32 }}>
                Download Full CV
              </Button>

              <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 16 }}>Pipeline Status</Text>
              
              <div className="relative border-l border-foreground/10 ml-2 pl-6 space-y-6">
                <div className="relative">
                  <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-slate-500 shadow-[0_0_10px_currentColor] top-1" />
                  <div className="text-sm font-medium text-white mb-0.5">Applied</div>
                  <div className="text-xs text-muted-foreground/80">Mar 15, 2026</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-[31px] w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_currentColor] top-1" />
                  <div className="text-sm font-medium text-white mb-0.5">Shortlisted</div>
                  <div className="text-xs text-muted-foreground/80">Mar 18, 2026</div>
                </div>
                <div className="relative p-3 rounded-lg border" style={{ backgroundColor: 'rgba(139,92,246,0.1)', borderColor: 'rgba(139,92,246,0.2)', marginLeft: -8, marginTop: -8 }}>
                  <span className="absolute -left-[24px] w-3 h-3 rounded-full bg-violet-500 shadow-[0_0_10px_currentColor] top-4 animate-pulse" />
                  <div className="text-sm font-medium mb-0.5" style={{ color: '#d3adf7' }}>Interview</div>
                  <div className="text-xs" style={{ color: '#b37feb' }}>Action Required</div>
                </div>
              </div>

              <Row gutter={[12, 12]} style={{ marginTop: 32 }}>
                <Col span={24}>
                  <Button type="primary" block style={{ background: '#10b981', borderColor: '#10b981' }} icon={<ThunderboltOutlined />}>Move to Hired ✨</Button>
                </Col>
                <Col span={12}>
                  <Button block icon={<CalendarOutlined />}>Schedule</Button>
                </Col>
                <Col span={12}>
                  <Button danger block>Reject</Button>
                </Col>
              </Row>
            </div>

            <div className="w-full md:w-[40%] bg-foreground/[0.02] p-6 flex flex-col items-center">
              <div className="text-center mb-8">
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 16 }}>AI Match Analysis</Text>
                <PulseOrb score={92} size="lg" className="mx-auto" />
              </div>

              <div className="w-full space-y-4 mb-8">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Skills Match</span><span className="text-emerald-400">95%</span></div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[95%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Experience</span><span className="text-emerald-400">90%</span></div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[90%]" /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Culture Fit</span><span className="text-amber-400">82%</span></div>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden"><div className="h-full bg-amber-400 w-[82%]" /></div>
                </div>
              </div>

              <div className="w-full space-y-4 flex-1">
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Matched Skills</Text>
                  <Space wrap size={[4, 4]}>
                    <Tag color="success">React ✓</Tag>
                    <Tag color="success">TypeScript ✓</Tag>
                    <Tag color="success">Node.js ✓</Tag>
                  </Space>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Missing Skills</Text>
                  <Space wrap size={[4, 4]}>
                    <Tag color="error">GraphQL ✗</Tag>
                  </Space>
                </div>
              </div>

              <Button type="link" style={{ marginTop: 16 }}>View Full Profile <ArrowRightOutlined /></Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
