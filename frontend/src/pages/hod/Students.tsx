import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/common/LoadingState';
import { hodApi, HodStudent } from '@/services/hodApi';
import { mockHodStudents } from '@/mock/mockData';

export default function Students() {
  const [students, setStudents] = useState<HodStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<HodStudent | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await hodApi.getStudents(selectedDivision || undefined);
        setStudents(data);
      } catch {
        setStudents(
          selectedDivision
            ? mockHodStudents.filter((s) => s.division === selectedDivision)
            : mockHodStudents
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedDivision]);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.prn.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: HodStudent['marksStatus']) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge variant="success">Verified</Badge>;
      case 'SUBMITTED':
        return <Badge variant="info">Submitted</Badge>;
      case 'DRAFT':
        return <Badge variant="warning">Draft</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  return (
    <div>
      <PageHeader
        title="Department Students"
        subtitle="Academic directory, attendance progress, and marks verification status"
      />

      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Filter by Division"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <option value="">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
            </Select>

            <Input
              label="Search Student"
              placeholder="Search by name, roll no, or PRN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <LoadingState message="Loading students..." />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Roll No</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">PRN</th>
                  <th className="py-3 px-4 text-center">Division</th>
                  <th className="py-3 px-4 text-center">Semester</th>
                  <th className="py-3 px-4 text-center">Attendance</th>
                  <th className="py-3 px-4 text-center">Marks Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No students found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">{s.rollNo}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div>{s.fullName}</div>
                        <div className="text-xs text-slate-400">{s.email}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-slate-600">{s.prn}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="purple">{s.division}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-700 font-medium">Sem {s.semester}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-semibold ${s.attendancePercent < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {s.attendancePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(s.marksStatus)}</td>
                      <td className="py-3 px-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedStudent(s)}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Academic Record"
        footer={<Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>}
      >
        {selectedStudent && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <p className="text-xs text-slate-500 uppercase">Roll Number</p>
                <p className="font-semibold text-slate-900 font-mono text-base">{selectedStudent.rollNo}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">PRN</p>
                <p className="font-semibold text-slate-800 font-mono">{selectedStudent.prn}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Student Name</p>
              <p className="font-semibold text-slate-900 text-base">{selectedStudent.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Email</p>
              <p className="text-slate-700">{selectedStudent.email}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500 uppercase">Division</p>
                <p className="text-slate-800 font-medium">Division {selectedStudent.division}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Semester</p>
                <p className="text-slate-800 font-medium">Semester {selectedStudent.semester}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div>
                <p className="text-xs text-slate-500 uppercase">Attendance</p>
                <p className={`text-base font-bold ${selectedStudent.attendancePercent < 75 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {selectedStudent.attendancePercent}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Marks Submission</p>
                <div className="mt-1">{getStatusBadge(selectedStudent.marksStatus)}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

