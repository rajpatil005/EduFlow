import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';

interface Stats {
  subjects: number;
  students: number;
  pendingMarks: number;
  completedMarks: number;
}

const stats: Stats = {
  subjects: 4,
  students: 174,
  pendingMarks: 45,
  completedMarks: 129,
};

export default function TeacherDashboard() {
  const cards = [
    { label: 'My Subjects', value: stats.subjects, color: 'from-indigo-500 to-purple-500' },
    { label: 'Total Students', value: stats.students, color: 'from-emerald-500 to-teal-500' },
    { label: 'Pending Marks', value: stats.pendingMarks, color: 'from-amber-500 to-orange-500' },
    { label: 'Completed', value: stats.completedMarks, color: 'from-blue-500 to-indigo-500' },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome, Teacher"
        subtitle="Here's an overview of your teaching activities"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
          <Card key={c.label} hoverable>
            <CardBody>
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${c.color} mb-3`} />
              <p className="text-sm text-slate-500">{c.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardBody>
          <h3 className="text-base font-semibold text-slate-900 mb-3">Recent Activity</h3>
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        </CardBody>
      </Card>
    </div>
  );
}