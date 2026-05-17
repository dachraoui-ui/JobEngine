// Redesigned with Ant Design — logic unchanged
import { ReactNode } from "react";
import { Layout } from "antd";
import { CandidateSidebar } from "./CandidateSidebar";
import { CandidateTopBar } from "./CandidateTopBar";

export function CandidateLayout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <CandidateSidebar />
      <Layout>
        <CandidateTopBar title={title} />
        <Layout.Content style={{ padding: '24px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
