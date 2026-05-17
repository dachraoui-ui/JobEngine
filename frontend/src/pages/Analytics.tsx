// Redesigned with Ant Design — logic unchanged
import { Card, Typography, Row, Col, Progress, Space, Avatar } from "antd";
import { Clock, DollarSign, ThumbsUp, Target } from "lucide-react";
import { analyticsData } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const { Title, Text } = Typography;

const metrics = [
  { label: "Time to Hire", value: `${analyticsData.timeToHire} days`, icon: Clock, color: "#F97316", change: "-2 days vs last quarter" },
  { label: "Cost per Hire", value: `$${analyticsData.costPerHire.toLocaleString()}`, icon: DollarSign, color: "#722ed1", change: "-$300 vs last quarter" },
  { label: "Offer Acceptance", value: `${analyticsData.offerAcceptance}%`, icon: ThumbsUp, color: "#52c41a", change: "+4% vs last quarter" },
  { label: "Source Effectiveness", value: `${analyticsData.sourceEffectiveness}%`, icon: Target, color: "#faad14", change: "+8% vs last quarter" },
];

const barColors = ["#F97316", "#8B5CF6", "#F59E0B", "#34D399", "#34D399"];

export default function Analytics() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Analytics</Title>
        <Text type="secondary">Recruitment performance insights</Text>
      </div>

      <Row gutter={[16, 16]}>
        {metrics.map((m) => (
          <Col xs={24} sm={12} lg={6} key={m.label}>
            <Card bordered={false} hoverable style={{ background: 'var(--surface)', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>{m.label}</Text>
                  <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: m.color, marginTop: 4 }}>{m.value}</div>
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>{m.change}</Text>
                </div>
                <Avatar style={{ backgroundColor: `${m.color}15`, color: m.color }} icon={<m.icon size={18} />} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ background: 'var(--surface)', height: '100%' }}>
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Hiring Funnel</Title>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Candidates at each stage</Text>
            
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.hiringFunnel} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="stage" width={80} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                    {analyticsData.hiringFunnel.map((_, i) => (
                      <Cell key={i} fill={barColors[i]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card bordered={false} style={{ background: 'var(--surface)', height: '100%' }}>
            <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Monthly Hires</Title>
            <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Hiring trend over the last 6 months</Text>
            
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.monthlyHires}>
                  <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Bar dataKey="hires" fill="#F97316" radius={[8, 8, 0, 0]} barSize={32} fillOpacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ background: 'var(--surface)' }}>
        <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }}>Source Breakdown</Title>
        <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 24 }}>Where your candidates are coming from</Text>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {analyticsData.sourceBreakdown.map((s) => (
            <div key={s.source} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 100 }}>
                <Text type="secondary" style={{ fontSize: 13 }}>{s.source}</Text>
              </div>
              <div style={{ flex: 1 }}>
                <Progress percent={s.percentage} showInfo={false} strokeColor="#F97316" />
              </div>
              <div style={{ width: 40, textAlign: 'right' }}>
                <Text strong style={{ fontFamily: 'monospace' }}>{s.percentage}%</Text>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
