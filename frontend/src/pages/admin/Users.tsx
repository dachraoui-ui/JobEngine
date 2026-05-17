// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { DownloadOutlined as Download, MoreOutlined as MoreVertical, SearchOutlined as Search, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, MailOutlined, CalendarOutlined, AppstoreOutlined as BriefcaseOutlined, FileTextOutlined, GlobalOutlined } from "@ant-design/icons";
import { Button, Card, Input, Select, Table, Modal, Typography, Space, Tag, Dropdown, Menu, Badge, Avatar } from "antd";
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

const mockUsers = [
  { id: 1, name: "Neural Talent", email: "talent@neural.org", role: "Candidate", status: "Active 🟢", joined: "Mar 10, 2026", lastActive: "2h ago", skills: ["React", "TypeScript", "Node.js"], cv: "Uploaded", apps: 12 },
  { id: 2, name: "TechCorp Labs", email: "hr@techcorp.com", role: "Recruiter", status: "Active 🟢", joined: "Feb 28, 2026", lastActive: "1d ago", company: "TechCorp Labs", companyUrl: "techcorp.com" },
  { id: 3, name: "John Doe", email: "john@example.com", role: "Recruiter", status: "Pending Verification 🟡", joined: "Mar 15, 2026", lastActive: "5h ago", company: "NextGen Software", companyUrl: "nextgen.io" },
  { id: 4, name: "System Admin", email: "admin@jobengine.io", role: "Admin", status: "Active 🟢", joined: "Jan 01, 2026", lastActive: "Now" },
  { id: 5, name: "Jane Smith", email: "jane.smith@dev.net", role: "Candidate", status: "Inactive 🔴", joined: "Jan 20, 2026", lastActive: "1mo ago", skills: ["Product Management"], cv: "Outdated", apps: 0 },
  { id: 6, name: "CloudWorks Info", email: "careers@cloudworks.io", role: "Recruiter", status: "Active 🟢", joined: "Mar 01, 2026", lastActive: "2d ago", company: "CloudWorks", companyUrl: "cloudworks.io" },
  { id: 7, name: "Sarah Connor", email: "s.connor@sky.net", role: "Candidate", status: "Active 🟢", joined: "Feb 10, 2026", lastActive: "10m ago", skills: ["AI", "Robotics", "Python"], cv: "Uploaded", apps: 3 },
  { id: 8, name: "Felix Wagner", email: "felix.w@design.co", role: "Candidate", status: "Active 🟢", joined: "Mar 22, 2026", lastActive: "1h ago", skills: ["UI/UX", "Figma", "CSS"], cv: "Uploaded", apps: 7 },
  { id: 9, name: "DataFlow Ltd.", email: "hr@dataflow.com", role: "Recruiter", status: "Inactive 🔴", joined: "Oct 15, 2025", lastActive: "6mo ago", company: "DataFlow", companyUrl: "dataflow.com" },
  { id: 10, name: "Omar Nabil", email: "omar@data-science.org", role: "Candidate", status: "Pending Verification 🟡", joined: "Mar 25, 2026", lastActive: "30m ago", skills: ["Python", "Machine Learning"], cv: "Uploaded", apps: 1 },
];

export default function Users() {
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [viewUser, setViewUser] = useState<typeof mockUsers[0] | null>(null);

  const getStatusBadge = (statusStr: string) => {
     const text = statusStr.slice(0, -2).trim();
     const icon = statusStr.slice(-1);
     if (icon === '🟢') return <Badge status="success" text={<Text style={{ color: 'var(--foreground)' }}>{text}</Text>} />;
     if (icon === '🟡') return <Badge status="warning" text={<Text style={{ color: 'var(--foreground)' }}>{text}</Text>} />;
     return <Badge status="error" text={<Text style={{ color: 'var(--foreground)' }}>{text}</Text>} />;
  };

  const getRoleTag = (role: string) => {
     if (role === 'Admin') return <Tag color="orange">Admin</Tag>;
     if (role === 'Recruiter') return <Tag color="purple">Recruiter</Tag>;
     return <Tag color="cyan">Candidate</Tag>;
  };

  const filteredUsers = mockUsers.filter(u => {
     const textMatch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
     const roleMatch = filterRole === "All" || u.role === filterRole;
     const stStatus = u.status.slice(0, -2).trim();
     const reqStatus = filterStatus === "All" ? "All" : filterStatus === "Pending" ? "Pending Verification" : filterStatus;
     const statusMatch = filterStatus === "All" || stStatus === reqStatus;
     return textMatch && roleMatch && statusMatch;
  });

  const columns: ColumnsType<typeof mockUsers[0]> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#F97316' }}>
            {record.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
          </Avatar>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ color: 'var(--foreground)' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => getRoleTag(role),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusBadge(status),
    },
    {
      title: 'Joined',
      dataIndex: 'joined',
      key: 'joined',
      responsive: ['md'],
      render: (text) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      responsive: ['lg'],
      render: (text) => <Text type="secondary">{text}</Text>
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              { key: 'view', label: 'View Details', onClick: () => setViewUser(record) },
              { key: 'edit', label: 'Edit' },
              { key: 'toggle', label: 'Toggle Status' },
              { type: 'divider' },
              { key: 'delete', label: 'Delete', danger: true },
            ]
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreVertical />} />
        </Dropdown>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>User Registry</Title>
          <Text type="secondary">1,247 users</Text>
        </div>
        <Button icon={<DownloadOutlined />}>Export</Button>
      </div>

      <Card bordered={false} style={{ background: 'var(--surface)', marginBottom: 24 }}>
        <Space wrap size="middle" style={{ width: '100%' }}>
          <Input 
            prefix={<SearchOutlined />} 
            placeholder="Search by name or email... (⌘K)" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ minWidth: 240 }}
          />
          <Select 
            value={filterRole} 
            onChange={setFilterRole}
            style={{ minWidth: 150 }}
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Recruiter', label: 'Recruiter' },
              { value: 'Candidate', label: 'Candidate' },
            ]}
          />
          <Select 
            value={filterStatus} 
            onChange={setFilterStatus}
            style={{ minWidth: 150 }}
            options={[
              { value: 'All', label: 'Status: All' },
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
              { value: 'Pending', label: 'Pending' },
            ]}
          />
          <Button type="primary">Filter</Button>
        </Space>
      </Card>

      <Card bordered={false} style={{ background: 'var(--surface)', padding: 0 }} bodyStyle={{ padding: 0 }}>
        <Table 
          rowSelection={rowSelection} 
          columns={columns} 
          dataSource={filteredUsers.map(u => ({ ...u, key: u.id }))} 
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: 'No users found' }}
        />
      </Card>

      {selectedRowKeys.length > 0 && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <Card bordered size="small" style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
             <Space size="large">
               <Text strong>{selectedRowKeys.length} selected</Text>
               <Space>
                  <Button size="small" type="primary" ghost>Activate</Button>
                  <Button size="small" danger ghost>Deactivate</Button>
                  <Button size="small" danger>Delete</Button>
               </Space>
             </Space>
          </Card>
        </div>
      )}

      <Modal
        open={!!viewUser}
        onCancel={() => setViewUser(null)}
        footer={null}
        width={480}
        destroyOnClose
      >
        {viewUser && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <Avatar size={80} style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: '#F97316', fontSize: 32, marginBottom: 16 }}>
                {viewUser.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
              </Avatar>
              <Title level={4} style={{ margin: 0 }}>{viewUser.name}</Title>
              <Space style={{ margin: '8px 0' }}>
                {getRoleTag(viewUser.role)}
                {getStatusBadge(viewUser.status)}
              </Space>
              <Text type="secondary"><MailOutlined /> {viewUser.email}</Text>
            </div>

            <Card size="small" style={{ background: 'var(--background)', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                 <Text type="secondary" style={{ fontSize: 12 }}><CalendarOutlined /> Joined {viewUser.joined}</Text>
                 <Text type="secondary" style={{ fontSize: 12 }}>Last active {viewUser.lastActive}</Text>
              </div>

              {viewUser.role === 'Recruiter' && (
                <div>
                   <Text strong style={{ fontSize: 12, textTransform: 'uppercase' }}>Company Information</Text>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                      <BriefcaseOutlined style={{ fontSize: 24, color: '#8B5CF6' }} />
                      <div>
                         <Text strong style={{ display: 'block' }}>{viewUser.company}</Text>
                         <a href="#" style={{ fontSize: 12 }}><GlobalOutlined /> {viewUser.companyUrl}</a>
                      </div>
                   </div>
                   {viewUser.status.includes("Pending") && (
                      <Space style={{ marginTop: 16, width: '100%' }}>
                         <Button type="primary" style={{ background: '#10b981' }} icon={<CheckCircleOutlined />} block>Verify</Button>
                         <Button danger icon={<CloseCircleOutlined />} block>Reject</Button>
                      </Space>
                   )}
                </div>
              )}

              {viewUser.role === 'Candidate' && (
                <div>
                   <Text strong style={{ fontSize: 12, textTransform: 'uppercase' }}>Candidate Profile</Text>
                   <div style={{ display: 'flex', gap: 16, margin: '12px 0' }}>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
                         <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>Applications</Text>
                         <Text strong style={{ fontSize: 20 }}>{viewUser.apps}</Text>
                      </div>
                      <div style={{ flex: 1, background: 'rgba(0,0,0,0.02)', padding: 12, borderRadius: 8 }}>
                         <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>CV Status</Text>
                         <Text strong style={{ color: '#F97316' }}><FileTextOutlined /> {viewUser.cv}</Text>
                      </div>
                   </div>
                   {viewUser.skills && (
                      <div>
                         <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Detected Skills</Text>
                         <Space wrap>
                            {viewUser.skills.map(s => <Tag key={s}>{s}</Tag>)}
                         </Space>
                      </div>
                   )}
                </div>
              )}
            </Card>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
               <Space>
                 <Button icon={<EditOutlined />}>Edit</Button>
                 <Button>Reset Pwd</Button>
               </Space>
               <Button danger icon={<DeleteOutlined />}>Delete User</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
