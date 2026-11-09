import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/common/LoadingState';
import { hodApi, HodDashboardStats, HodDepartment } from '@/services/hodApi';
import { mockHodStats, mockHodDepartment } from '@/mock/mockData';

export default function HodDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<HodDashboardStats | null>(null);
  const [dept, setDept] = useState<HodDepartment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, deptData] = await Promise.all([
          hodApi.getDashboardStats(),
          hodApi.getDepartment(),
        ]);
        setStats(statsData);
        setDept(deptData);
      } catch {
        setStats(mockHodStats);
        setDept(mockHodDepartment);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !stats) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const statCards = [
    { label: 'Total Teachers', value: stats.totalTeachers, color: 'from-indigo-500 to-purple-500', path: '/hod/teachers' },
    { label: 'Total Students', value: stats.totalStudents, color: 'from-emerald-500 to-teal-500', path: '/hod/students' },
    { label: 'Total Subjects', value: stats.totalSubjects, color: 'from-blue-500 to-indigo-500', path: '/hod/subjects' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, color: 'from-amber-500 to-orange-500', path: '/hod/marks-approval' },
  ];

  return (
    <div>
      <PageHeader
        title="Welcome, HOD"
        subtitle={dept ? `${dept.name} (${dept.code}) — Academic Overview` : "Here's an overview of your department activities"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((c) => (
          <Card key={c.label} hoverable>
            <div className="cursor-pointer" onClick={() => navigate(c.path)}>
              <CardBody>
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${c.color} mb-3`} />
                <p className="text-sm text-slate-500">{c.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{c.value}</p>
              </CardBody>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">Department Overview</h3>
              <Button size="sm" variant="outline" onClick={() => navigate('/hod/department')}>
                View Details
              </Button>
            </div>
            {dept && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Department Code</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{dept.code}</p>
                </div>
                <div>
                  <p className="text-slate-500">Head of Department</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{dept.hodName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Average Attendance</p>
                  <p className="font-semibold text-emerald-600 mt-0.5">{stats.avgAttendance}%</p>
                </div>
                <div>
                  <p className="text-slate-500">Programmes</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{dept.programmes.join(', ')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Active Semesters</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{dept.semesters.join(', ')}</p>
                </div>
                <div>
                  <p className="text-slate-500">Divisions</p>
                  <p className="font-semibold text-slate-800 mt-0.5">{dept.divisions.join(', ')}</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h3 className="text-base font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate('/hod/marks-approval')}>
                Review Marks Approval
                {stats.pendingApprovals > 0 && (
                  <Badge variant="warning" className="ml-auto">{stats.pendingApprovals} Pending</Badge>
                )}
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate('/hod/teacher-assignments')}>
                Manage Teacher Assignments
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate('/hod/attendance')}>
                Check Attendance Trends
              </Button>
              <Button variant="outline" className="w-full justify-start text-left" onClick={() => navigate('/hod/reports')}>
                Generate Reports
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}