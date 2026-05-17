// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Typography, Button, Tag, Space, Modal, Select, Input, Progress, Row, Col } from "antd";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { exploreJobs } from "@/data/candidateJobsData";
import { cn } from "@/lib/utils";
import {
  MapPin, DollarSign, Calendar, Clock, Bookmark, BookmarkCheck, CheckCircle, XCircle,
  ShieldCheck, Lightbulb, Sparkles, ChevronRight, Upload,
} from "lucide-react";

const { Title, Text } = Typography;
const { TextArea } = Input;

function SkillConstellation({ matched, missing }: { matched: string[]; missing: string[] }) {
  return (
    <div className="space-y-4">
      <div>
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Matched Skills</Text>
        <Space wrap size={[8, 8]}>
          {matched.map((s) => (
            <Tag key={s} color="cyan" bordered={false} icon={<CheckCircle className="w-3 h-3" style={{ marginRight: 4 }} />}>
              {s}
            </Tag>
          ))}
        </Space>
      </div>
      {missing.length > 0 && (
        <div>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Missing Skills</Text>
          <Space wrap size={[8, 8]}>
            <Tag key={missing[0]} color="error" bordered={false} icon={<XCircle className="w-3 h-3" style={{ marginRight: 4 }} />}>
              {missing[0]}
            </Tag>
            {missing.slice(1).map((s) => (
              <Tag key={s} color="error" bordered={false} icon={<XCircle className="w-3 h-3" style={{ marginRight: 4 }} />}>
                {s}
              </Tag>
            ))}
          </Space>
        </div>
      )}
    </div>
  );
}

function ApplyModalContent({ job, onCancel, onSubmitted, submitted, loading }: any) {
  const [coverNote, setCoverNote] = useState("");

  if (submitted) {
    return (
      <div className="text-center py-6 animate-scale-in">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center glow-mint">
            <svg viewBox="0 0 52 52" className="w-8 h-8">
              <circle cx="26" cy="26" r="24" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" className="animate-draw-circle" />
              <path fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l8 8 16-16" className="animate-draw-check" />
            </svg>
          </div>
        </div>
        <Title level={4} style={{ color: 'var(--foreground)' }}>Application Sent! 🚀</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>We'll notify you when {job.company} reviews your profile.</Text>
        <Link to="/candidate/applications" className="text-sm text-primary font-medium flex items-center justify-center gap-1 hover:gap-2 transition-all" onClick={onCancel}>
          View My Applications <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Apply to {job.title}</Title>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-primary" style={{ background: 'rgba(255,255,255,0.05)' }}>{job.companyLogo}</div>
            <Text type="secondary">{job.company}</Text>
          </div>
        </div>
        <PulseOrb score={job.score} size="sm" />
      </div>

      {/* CV selection */}
      <div className="space-y-2 mb-6">
        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Select your CV</Text>
        <Select
          defaultValue="cv1"
          style={{ width: '100%' }}
          size="large"
          options={[
            { value: 'cv1', label: 'resume_john_doe_2026.pdf — Apr 1, 2026' },
            { value: 'cv2', label: 'cv_fullstack_v3.pdf — Mar 20, 2026' },
          ]}
        />
        <Button type="link" icon={<Upload className="w-3 h-3" />} style={{ padding: 0, marginTop: 4 }}>
          Upload New
        </Button>
      </div>

      {/* Cover note */}
      <div className="space-y-2 mb-8">
        <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Cover Note <span style={{ textTransform: 'none', opacity: 0.5 }}>(optional)</span></Text>
        <TextArea
          value={coverNote}
          onChange={(e) => setCoverNote(e.target.value)}
          placeholder="Add a personal note..."
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        <Button size="large" onClick={onCancel}>Cancel</Button>
        <Button type="primary" size="large" loading={loading} onClick={onSubmitted} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {!loading && <Sparkles className="w-4 h-4" />} Submit Application
        </Button>
      </div>
    </>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const job = exploreJobs.find((j) => j.id === id);
  const [saved, setSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [modalSubmitted, setModalSubmitted] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const handleApplySubmit = async () => {
    setModalLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setModalLoading(false);
    setModalSubmitted(true);
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card bordered={false} style={{ background: 'var(--surface)', textAlign: 'center', padding: 24 }}>
          <Text strong style={{ display: 'block', color: 'var(--foreground)' }}>Job not found.</Text>
          <Link to="/candidate/explore" className="text-sm text-primary mt-4 block">← Back to Explore</Link>
        </Card>
      </div>
    );
  }

  const { scoreBreakdown } = job;

  return (
    <div className="space-y-6 max-w-[860px] mx-auto animate-fade-in pb-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/candidate/explore" className="hover:text-foreground transition-colors">Explore Jobs</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{job.title}</span>
      </div>

      {/* Hero Card */}
      <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 32 }}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-primary glow-cyan" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{job.companyLogo}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Text type="secondary">{job.company}</Text>
              {job.verified && (
                <Tag color="cyan" bordered={false} icon={<ShieldCheck className="w-3 h-3" />}>
                  Verified
                </Tag>
              )}
            </div>
            <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>{job.title}</Title>
          </div>
        </div>

        <Space wrap size={[8, 8]} style={{ marginBottom: 16 }}>
          <Tag color="blue" bordered={false}>{job.type}</Tag>
          <Tag color="purple" bordered={false}>{job.locationType}</Tag>
          <Tag color="warning" bordered={false}>{job.experience}</Tag>
        </Space>

        <div className="flex flex-wrap gap-6 mb-6">
          <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin className="w-4 h-4" /> {job.location}</Text>
          <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><DollarSign className="w-4 h-4" /> {job.salary}</Text>
          <Text type="secondary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar className="w-4 h-4" /> Posted {job.postedAgo}</Text>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <Clock className="w-4 h-4 text-warning" />
          <Text style={{ color: 'var(--warning)', fontWeight: 500 }}>Closes in {job.closesIn} days</Text>
        </div>

        <Space size="middle">
          <Button type="primary" size="large" className="glow-cyan" onClick={() => { setModalSubmitted(false); setShowApplyModal(true); }}>
            Apply Now
          </Button>
          <Button size="large" onClick={() => setSaved(!saved)} icon={saved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}>
            {saved ? "Saved" : "Save"}
          </Button>
        </Space>
      </Card>

      {/* Neural Match Card */}
      <div className="relative rounded-2xl p-[1px] overflow-hidden glow-border-animated">
        <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 32 }}>
          <Title level={4} style={{ color: 'var(--foreground)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>🧠 Your Neural Match</Title>

          <div className="flex flex-col items-center mb-8">
            <PulseOrb score={job.score} size="lg" />
          </div>

          {/* Score bars */}
          <div className="space-y-4 mb-8">
            {[
              { label: "Skills", value: scoreBreakdown.skills },
              { label: "Experience", value: scoreBreakdown.experience },
              { label: "Culture Fit", value: scoreBreakdown.cultureFit },
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-1">
                  <Text type="secondary">{bar.label}</Text>
                  <Text strong>{bar.value}%</Text>
                </div>
                <Progress percent={bar.value} showInfo={false} strokeColor={bar.value >= 75 ? '#F97316' : bar.value >= 50 ? '#4ECDC4' : '#ff4d4f'} trailColor="rgba(255,255,255,0.05)" />
              </div>
            ))}
          </div>

          {/* Skill constellation */}
          <SkillConstellation matched={job.matchedSkills} missing={job.missingSkills} />

          {/* Pro tip */}
          {job.missingSkills.length > 0 && (
            <div className="mt-8 px-4 py-3 rounded-xl border flex items-start gap-3" style={{ background: 'rgba(249,115,22,0.05)', borderColor: 'rgba(249,115,22,0.1)' }}>
              <Lightbulb className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <Text type="secondary" style={{ fontSize: 13 }}>
                Picking up <Text strong style={{ color: 'var(--primary)' }}>{job.missingSkills.join(" and ")}</Text> could boost your score to <Text strong style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>95%</Text>
              </Text>
            </div>
          )}
        </Card>
      </div>

      {/* Job Description */}
      <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 32 }}>
        <div className="space-y-8">
          <div>
            <Title level={5} style={{ color: 'var(--foreground)', marginBottom: 12 }}>About This Role</Title>
            <Text type="secondary" style={{ lineHeight: 1.6 }}>{job.aboutRole}</Text>
          </div>

          <div>
            <Title level={5} style={{ color: 'var(--foreground)', marginBottom: 12 }}>What You'll Do</Title>
            <ul className="space-y-3 m-0 p-0" style={{ listStyle: 'none' }}>
              {job.whatYoullDo.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <Text style={{ color: 'var(--foreground)' }}>{item}</Text>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Title level={5} style={{ color: 'var(--foreground)', marginBottom: 12 }}>What We Need</Title>
            <ul className="space-y-3 m-0 p-0" style={{ listStyle: 'none' }}>
              {job.whatWeNeed.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  {item.matched ? (
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                  )}
                  <span className={item.matched ? "text-foreground" : "text-muted-foreground"}>
                    {item.skill}
                    {item.matched && <span className="text-xs text-primary ml-2">You have this</span>}
                    {!item.matched && <span className="text-xs text-destructive ml-2">Gap</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Title level={5} style={{ color: 'var(--foreground)', marginBottom: 12 }}>Nice to Have</Title>
            <ul className="space-y-3 m-0 p-0" style={{ listStyle: 'none' }}>
              {job.niceToHave.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-border mt-2 shrink-0" />
                  <Text type="secondary">{item}</Text>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Culture & Values */}
      <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 32 }}>
        <Title level={5} style={{ color: 'var(--foreground)', marginBottom: 16 }}>Culture & Values</Title>
        <Space wrap size={[8, 8]} style={{ marginBottom: 16 }}>
          {job.cultureValues.map((val) => {
            const isMatch = job.matchingValues.includes(val);
            return (
              <Tag key={val} color={isMatch ? "cyan" : "default"} bordered={!isMatch}>
                {val}
              </Tag>
            );
          })}
        </Space>
        <Text style={{ color: 'var(--primary)', fontWeight: 500, display: 'block', fontSize: 12 }}>{job.matchingValues.length}/{job.cultureValues.length} values align</Text>
      </Card>

      <Modal
        open={showApplyModal}
        onCancel={() => setShowApplyModal(false)}
        footer={null}
        closable={false}
        width={480}
        styles={{ body: { padding: 32 } }}
      >
        <ApplyModalContent
          job={job}
          onCancel={() => setShowApplyModal(false)}
          onSubmitted={handleApplySubmit}
          submitted={modalSubmitted}
          loading={modalLoading}
        />
      </Modal>
    </div>
  );
}
