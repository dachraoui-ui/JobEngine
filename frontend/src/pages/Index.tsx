// Redesigned with Ant Design — logic unchanged
import { Card, Typography, Space, Row, Col, Progress, List, Avatar } from "antd";
import { Briefcase, Users, CalendarDays, TrendingUp, UserPlus, Calendar, ArrowRight, CheckCircle } from "lucide-react";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { candidates, activities, pipelineStages } from "@/data/mockData";

const { Title, Text } = Typography;

const stats = [
  { label: "Open Positions", value: "12", icon: Briefcase, change: "+3 this week", color: "#F97316" },
  { label: "Active Candidates", value: "156", icon: Users, change: "+24 this week", color: "#722ed1" },
  { label: "Interviews Today", value: "8", icon: CalendarDays, change: "3 remaining", color: "#faad14" },
  { label: "Hire Rate", value: "68%", icon: TrendingUp, change: "+5% vs last month", color: "#52c41a" },
];

const activityIcons: Record<string, typeof UserPlus> = {
  "user-plus": UserPlus,
  calendar: Calendar,
  "arrow-right": ArrowRight,
  "check-circle": CheckCircle,
};

export default function Dashboard() {
  const topCandidates = candidates.filter(c => c.score >= 80).slice(0, 4);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Dashboard</Title>
        <Text type="secondary">Welcome back. Here's your hiring overview.</Text>
      </div>

      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.label}>
            <Card bordered={false} hoverable style={{ background: 'var(--surface)', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{stat.label}</Text>
                  <div style={{ fontSize: 28, fontWeight: 'bold', fontFamily: 'monospace', color: stat.color, marginTop: 4 }}>{stat.value}</div>
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>{stat.change}</Text>
                </div>
                <Avatar style={{ backgroundColor: `${stat.color}15`, color: stat.color }} icon={<stat.icon size={18} />} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card bordered={false} style={{ background: 'var(--surface)', height: '100%' }}>
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Top AI Matches</Title>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Highest-scoring candidates across all open roles</Text>
            
            <Row gutter={[16, 16]}>
              {topCandidates.map((c) => (
                <Col xs={24} sm={12} key={c.id}>
                  <Card bordered size="small" hoverable style={{ background: 'rgba(0,0,0,0.02)', borderColor: 'var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <PulseOrb score={c.score} size="md" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text strong style={{ color: 'var(--foreground)', display: 'block' }} ellipsis>{c.name}</Text>
                        <Text type="secondary" style={{ fontSize: 13, display: 'block' }} ellipsis>{c.role}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text style={{ fontSize: 11, background: 'rgba(249,115,22,0.1)', color: '#F97316', padding: '2px 8px', borderRadius: 12 }}>{c.status}</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ background: 'var(--surface)', height: '100%' }}>
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Pipeline</Title>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Candidates per stage</Text>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pipelineStages.map((stage, i) => {
                const maxCount = pipelineStages[0].count;
                const percent = (stage.count / maxCount) * 100;
                const colors = ['#F97316', '#722ed1', '#faad14', '#52c41a'];
                
                return (
                  <div key={stage.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                      <Text type="secondary">{stage.label}</Text>
                      <Text strong style={{ fontFamily: 'monospace' }}>{stage.count}</Text>
                    </div>
                    <Progress 
                      percent={percent} 
                      showInfo={false} 
                      strokeColor={colors[i] || '#F97316'} 
                      trailColor="rgba(255,255,255,0.05)"
                      size="small"
                    />
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ background: 'var(--surface)' }}>
        <Title level={5} style={{ margin: 0, marginBottom: 16, color: 'var(--foreground)' }}>Recent Activity</Title>
        <List
          itemLayout="horizontal"
          dataSource={activities}
          renderItem={(activity) => {
            const Icon = activityIcons[activity.icon] || ArrowRight;
            let color = '#F97316';
            if (activity.type === 'hired') color = '#52c41a';
            if (activity.type === 'interview') color = '#faad14';

            return (
              <List.Item style={{ borderBottomColor: 'var(--border)' }}>
                <List.Item.Meta
                  avatar={
                    <Avatar style={{ backgroundColor: `${color}15`, color: color }} icon={<Icon size={16} />} shape="square" />
                  }
                  title={<Text style={{ color: 'var(--foreground)', fontSize: 14 }}>{activity.message}</Text>}
                  description={<Text type="secondary" style={{ fontSize: 12 }}>{activity.time}</Text>}
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
}
