// Redesigned with Ant Design — logic unchanged
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, Input, Typography, Space, Select, Tag, Button, Row, Col, Slider as AntSlider } from "antd";
import { SearchOutlined, CloseOutlined, BookOutlined, RightOutlined, EnvironmentOutlined, ClockCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { PulseOrb } from "@/components/ui/PulseOrb";
import { exploreJobs } from "@/data/candidateJobsData";

const { Title, Text } = Typography;
const { CheckableTag } = Tag;

const jobTypes = ["Full-Time", "Part-Time", "Internship"];
const experienceLevels = ["Junior", "Mid", "Senior"];
const locationTypes = ["Remote", "On-site", "Hybrid"];
const sortOptions = ["Best Match", "Newest", "Highest Score"];

export default function ExploreJobs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<string[]>([]);
  const [activeExperience, setActiveExperience] = useState<string[]>([]);
  const [activeLocation, setActiveLocation] = useState<string[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("Best Match");
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [showAllCards, setShowAllCards] = useState(false);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) =>
    set(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const activeFilters = [
    ...activeTypes.map((t) => ({ label: t, clear: () => setActiveTypes((p) => p.filter((v) => v !== t)) })),
    ...activeExperience.map((t) => ({ label: t, clear: () => setActiveExperience((p) => p.filter((v) => v !== t)) })),
    ...activeLocation.map((t) => ({ label: t, clear: () => setActiveLocation((p) => p.filter((v) => v !== t)) })),
    ...(minScore > 0 ? [{ label: `Min Score: ${minScore}%`, clear: () => setMinScore(0) }] : []),
  ];

  const filtered = useMemo(() => {
    let result = exploreJobs.filter((j) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.company.toLowerCase().includes(q) &&
          !j.location.toLowerCase().includes(q) &&
          !j.skills.some((s) => s.toLowerCase().includes(q))
        ) return false;
      }
      if (activeTypes.length && !activeTypes.includes(j.type)) return false;
      if (activeExperience.length && !activeExperience.includes(j.experience)) return false;
      if (activeLocation.length && !activeLocation.includes(j.locationType)) return false;
      if (j.score < minScore) return false;
      return true;
    });

    if (sortBy === "Newest") result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    else if (sortBy === "Highest Score") result.sort((a, b) => b.score - a.score);
    else result.sort((a, b) => b.score - a.score);

    return result;
  }, [searchQuery, activeTypes, activeExperience, activeLocation, minScore, sortBy]);

  const displayedJobs = showAllCards ? filtered : filtered.slice(0, 6);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Search & Filters */}
      <Card bordered={false} style={{ background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 20 }}>
        <Input
          size="large"
          prefix={<SearchOutlined style={{ color: 'var(--muted-foreground)' }} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, skill, company, or location..."
          style={{ marginBottom: 16, background: 'rgba(0,0,0,0.2)', borderColor: 'var(--border)' }}
        />

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <FilterOutlined className="text-muted-foreground mr-1" />
          
          <Space wrap size={[8, 8]}>
            {jobTypes.map((t) => (
              <CheckableTag
                key={t}
                checked={activeTypes.includes(t)}
                onChange={() => toggle(activeTypes, t, setActiveTypes)}
              >
                {t}
              </CheckableTag>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            {experienceLevels.map((t) => (
              <CheckableTag
                key={t}
                checked={activeExperience.includes(t)}
                onChange={() => toggle(activeExperience, t, setActiveExperience)}
              >
                {t}
              </CheckableTag>
            ))}
            <div className="w-px h-5 bg-border mx-1" />
            {locationTypes.map((t) => (
              <CheckableTag
                key={t}
                checked={activeLocation.includes(t)}
                onChange={() => toggle(activeLocation, t, setActiveLocation)}
              >
                {t}
              </CheckableTag>
            ))}
          </Space>
        </div>

        {/* Score slider + Sort */}
        <Row gutter={[24, 16]} align="middle">
          <Col xs={24} sm={16} md={18}>
            <div className="flex items-center gap-3">
              <Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>Min Score: {minScore}%</Text>
              <AntSlider
                min={0} max={100} step={5}
                value={minScore} onChange={setMinScore}
                style={{ width: 160 }}
                trackStyle={{ backgroundColor: '#F97316' }}
              />
            </div>
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
              options={sortOptions.map(o => ({ value: o, label: o }))}
            />
          </Col>
        </Row>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            {activeFilters.map((f) => (
              <Tag key={f.label} closable onClose={f.clear} color="blue" bordered={false}>
                {f.label}
              </Tag>
            ))}
          </div>
        )}

        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: activeFilters.length > 0 ? 8 : 16 }}>
          Showing {filtered.length} jobs
        </Text>
      </Card>

      {/* Job Cards Grid */}
      <Row gutter={[16, 16]}>
        {displayedJobs.map((job) => (
          <Col xs={24} lg={12} key={job.id}>
            <Card bordered={false} hoverable style={{ background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-primary" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}>{job.companyLogo}</div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>{job.company}</Text>
                    <Text type="secondary" style={{ fontSize: 11, opacity: 0.7 }}>{job.postedAgo}</Text>
                  </div>
                </div>
                <PulseOrb score={job.score} size="md" />
              </div>

              {/* Title */}
              <Link to={`/candidate/job/${job.id}`} style={{ display: 'block', marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, color: 'var(--foreground)' }} className="hover:text-primary transition-colors tracking-tight">
                  {job.title}
                </Title>
              </Link>

              {/* Tags */}
              <Space wrap size={[0, 8]} style={{ marginBottom: 16 }}>
                <Tag icon={<EnvironmentOutlined />} color="blue" bordered={false}>{job.locationType}</Tag>
                <Tag icon={<ClockCircleOutlined />} color="purple" bordered={false}>{job.type}</Tag>
              </Space>

              {/* Skills */}
              <Space wrap size={[4, 8]} style={{ marginBottom: 16 }}>
                {job.skills.slice(0, 4).map((skill) => (
                  <Tag key={skill} color={job.matchedSkills.includes(skill) ? "cyan" : "default"} bordered={!job.matchedSkills.includes(skill)}>
                    {skill}
                  </Tag>
                ))}
                {job.skills.length > 4 && (
                  <Tag bordered={false} color="default">+{job.skills.length - 4} more</Tag>
                )}
              </Space>

              {/* Description */}
              <div className="relative mb-6" style={{ flex: 1 }}>
                <Text type="secondary" style={{ fontSize: 13, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{job.description}</Text>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <Tag bordered={false} color={job.experience === "Senior" ? "warning" : job.experience === "Mid" ? "purple" : "cyan"}>
                  {job.experience}
                </Tag>
                <div className="flex items-center gap-4">
                  <Link to={`/candidate/job/${job.id}`} className="text-xs text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    View Details <RightOutlined style={{ fontSize: 10 }} />
                  </Link>
                  <Button 
                    type="text" 
                    icon={<BookOutlined style={{ color: bookmarked.has(job.id) ? 'var(--primary)' : 'inherit' }} />} 
                    onClick={() => toggleBookmark(job.id)}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Load More */}
      {filtered.length > 6 && !showAllCards && (
        <div className="flex justify-center pt-4">
          <Button size="large" onClick={() => setShowAllCards(true)}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
