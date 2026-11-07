import { PageHeader } from '@/components/layout/PageHeader';

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Welcome to Admin Panel" />
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <p>Admin data will appear here.</p>
      </div>
    </div>
  );
}