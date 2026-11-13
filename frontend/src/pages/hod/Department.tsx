import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/common/LoadingState';
import { hodApi, HodDepartment } from '@/services/hodApi';
import { mockHodDepartment } from '@/mock/mockData';

export default function Department() {
  const [dept, setDept] = useState<HodDepartment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await hodApi.getDepartment();
        setDept(data);
      } catch {
        setDept(mockHodDepartment);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !dept) {
    return <LoadingState message="Loading department details..." />;
  }

  return (
    <div>
      <PageHeader
        title="My Department"
        subtitle="Department information, active programmes, and academic structure"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Profile</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Department Name</p>
                <p className="text-base font-semibold text-slate-900 mt-1">{dept.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Department Code</p>
                <Badge variant="info" className="mt-1 text-sm font-semibold">{dept.code}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Head of Department (HOD)</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{dept.hodName}</p>
                <p className="text-xs text-slate-500">{dept.hodEmail}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Affiliated College / System</p>
                <p className="text-sm font-medium text-slate-800 mt-1">EduFlow Academic Portal</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Statistics</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Total Faculty</span>
              <span className="text-lg font-bold text-slate-900">{dept.totalFaculty}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-sm text-slate-600">Enrolled Students</span>
              <span className="text-lg font-bold text-slate-900">{dept.totalStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Active Subjects</span>
              <span className="text-lg font-bold text-slate-900">{dept.totalSubjects}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Programmes Offered</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {dept.programmes.map((p) => (
                <Badge key={p} variant="default" className="text-xs py-1 px-3">
                  {p}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Semesters</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {dept.semesters.map((s) => (
                <Badge key={s} variant="info" className="text-xs py-1 px-3">
                  Semester {s}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Divisions</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {dept.divisions.map((d) => (
                <Badge key={d} variant="purple" className="text-xs py-1 px-3">
                  Division {d}
                </Badge>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

