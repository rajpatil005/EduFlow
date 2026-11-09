import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { LoadingState } from '@/components/common/LoadingState';
import { hodApi, HodAttendanceRecord } from '@/services/hodApi';
import { mockHodAttendance } from '@/mock/mockData';

export default function Attendance() {
  const [records, setRecords] = useState<HodAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await hodApi.getAttendanceRecords(
          subjectFilter || undefined,
          divisionFilter || undefined
        );
        setRecords(data);
      } catch {
        let list = mockHodAttendance;
        if (subjectFilter) list = list.filter((r) => r.subject === subjectFilter);
        if (divisionFilter) list = list.filter((r) => r.division === divisionFilter);
        setRecords(list);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [subjectFilter, divisionFilter]);

  const totalStudents = records.length;
  const criticalCount = records.filter((r) => r.attendancePercent < 75).length;
  const avgAttendance = totalStudents
    ? (records.reduce((acc, r) => acc + r.attendancePercent, 0) / totalStudents).toFixed(1)
    : '0';

  return (
    <div>
      <PageHeader
        title="Attendance Monitoring"
        subtitle="Department-wide student attendance tracking, class conduction metrics, and critical attendance alerts"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <Card>
          <CardBody>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Average Attendance</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{avgAttendance}%</p>
            <p className="text-xs text-slate-400 mt-1">Across filtered students</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Total Monitored Students</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">{totalStudents}</p>
            <p className="text-xs text-slate-400 mt-1">Students enrolled in subject</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Low Attendance Alert (&lt;75%)</p>
            <p className={`text-2xl font-bold mt-1 ${criticalCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {criticalCount} Students
            </p>
            <p className="text-xs text-slate-400 mt-1">Requires academic follow-up</p>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">All Subjects</option>
              <option value="DBMS">Database Management Systems (DBMS)</option>
              <option value="AI">Artificial Intelligence (AI)</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="Operating Systems">Operating Systems</option>
            </Select>

            <Select
              label="Division"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
            >
              <option value="">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Records Table */}
      {loading ? (
        <LoadingState message="Loading attendance records..." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4 text-center">Division</th>
                  <th className="py-3 px-4 text-center">Conducted Classes</th>
                  <th className="py-3 px-4 text-center">Attended Classes</th>
                  <th className="py-3 px-4 text-center">Attendance %</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No attendance records found for this filter.
                    </td>
                  </tr>
                ) : (
                  records.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">{r.rollNo}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{r.studentName}</td>
                      <td className="py-3 px-4 text-slate-700">{r.subject}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="purple">{r.division}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600">{r.conductedClasses}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-800">{r.attendedClasses}</td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={r.attendancePercent < 75 ? 'text-red-600' : 'text-emerald-600'}>
                          {r.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge
                          variant={
                            r.status === 'GOOD'
                              ? 'success'
                              : r.status === 'AVERAGE'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

