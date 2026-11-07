import { PageHeader } from '@/components/layout/PageHeader';

export default function HodDashboard() {
  return (
    <div>
      <PageHeader title="HOD Dashboard" subtitle="Welcome to Department Panel" />
      <div className="p-4 bg-white rounded-lg border border-slate-200">
        <p>HOD data will appear here.</p>
      </div>
    </div>
  );
}