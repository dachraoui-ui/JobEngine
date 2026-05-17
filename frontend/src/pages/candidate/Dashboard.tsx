// Redesigned with Ant Design — logic unchanged
import { Card, Typography, Row, Col, Space } from "antd";
import { Briefcase, FileText, Target, BrainCircuit, ChevronRight } from "lucide-react";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-fade-in relative z-10 pb-10">
      <div className="flex flex-col gap-1">
        <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Welcome back, Neural Talent</Title>
        <Text type="secondary">Your AI profile is active. You have 3 new highly compatible job matches today.</Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]}>
        {[
          { label: "Profile Strength", value: "88/100", icon: <BrainCircuit className="w-5 h-5 text-primary" />, color: "var(--primary)", bg: "rgba(249, 115, 22, 0.05)" },
          { label: "Active Applications", value: "8", icon: <Briefcase className="w-5 h-5 text-secondary" />, color: "var(--secondary)", bg: "rgba(139, 92, 246, 0.05)" },
          { label: "Interviews", value: "2", icon: <Target className="w-5 h-5 text-emerald-400" />, color: "#34d399", bg: "rgba(52, 211, 153, 0.05)" },
          { label: "Profile Views", value: "45", icon: <FileText className="w-5 h-5 text-amber-400" />, color: "#fbbf24", bg: "rgba(251, 191, 36, 0.05)" },
        ].map((stat, i) => (
          <Col xs={24} md={12} lg={6} key={i}>
            <Card bordered={false} style={{ background: 'var(--surface)', borderColor: `${stat.color}33`, borderWidth: 1, borderStyle: 'solid' }}>
              <div className="flex justify-between items-start mb-2">
                <Text type="secondary" style={{ fontSize: 14 }}>{stat.label}</Text>
                <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: stat.bg }}>{stat.icon}</div>
              </div>
              <span className="text-3xl font-mono font-bold text-white">{stat.value}</span>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        {/* Recommended Matches */}
        <Col xs={24} lg={16}>
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <Title level={4} style={{ margin: 0, color: 'var(--foreground)' }}>Top Neural Matches</Title>
              <Link to="/candidate/explore" className="text-sm text-primary hover:underline flex items-center">View all <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </div>
            
            {[
              { id: 101, title: "Senior React Developer", company: "TechCorp", location: "Remote", score: 95 },
              { id: 102, title: "Frontend Lead", company: "DataSync", location: "New York, NY", score: 88 },
              { id: 103, title: "Full Stack Engineer", company: "Neurolab", location: "Remote", score: 84 },
            ].map((job) => (
              <Card key={job.id} bordered={false} hoverable style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 16 }}>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center font-bold text-xl text-primary shrink-0">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }} className="group-hover:text-primary transition-colors cursor-pointer">{job.title}</Title>
                      <Text type="secondary" style={{ fontSize: 13 }}>{job.company} • {job.location}</Text>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <PulseOrb score={job.score} size="md" />
                    <Link to={`/candidate/job/${job.id}`} className="hidden sm:flex text-sm text-muted-foreground hover:text-white transition-colors">View Details</Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Col>

        {/* Action Center */}
        <Col xs={24} lg={8}>
          <div className="space-y-4">
            <Title level={4} style={{ margin: 0, marginBottom: 8, color: 'var(--foreground)' }}>Action Center</Title>
            
            <Card bordered={false} style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)', borderWidth: 1, borderStyle: 'solid', position: 'relative', overflow: 'hidden' }} bodyStyle={{ padding: 20 }}>
              <div className="absolute top-0 right-0 w-2 h-full bg-amber-500" />
              <Text strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: 4 }}>Interview Scheduled</Text>
              <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>With DataFlow Systems</Text>
              <Text strong style={{ color: '#fbbf24', fontFamily: 'monospace' }}>Tomorrow, 10:00 AM</Text>
            </Card>

            <Card bordered={false} style={{ background: 'var(--surface)', borderColor: 'var(--secondary)', borderWidth: 1, borderStyle: 'solid', position: 'relative', overflow: 'hidden' }} bodyStyle={{ padding: 20 }}>
               <div className="absolute -right-6 -bottom-6 opacity-20">
                <BrainCircuit className="w-32 h-32 text-secondary" />
              </div>
              <Text strong style={{ display: 'block', color: 'var(--foreground)', marginBottom: 4, position: 'relative', zIndex: 10 }}>AI Pro Tip</Text>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16, position: 'relative', zIndex: 10, fontSize: 13 }}>Adding "GraphQL" to your skills can increase your match rate by 15% for current open roles.</Text>
              <Link to="/candidate/career-ai" className="text-sm text-secondary hover:underline relative z-10">Explore Career AI →</Link>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
