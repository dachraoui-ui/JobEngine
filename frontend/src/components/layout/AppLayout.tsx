// Redesigned with Ant Design — logic unchanged
import { ReactNode } from "react";
import { Layout } from "antd";
import { AppSidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar />
      <Layout>
        <TopBar />
        <Layout.Content style={{ padding: '24px', overflowY: 'auto' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            {children}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
