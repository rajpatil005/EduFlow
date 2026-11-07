import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { teacherApi } from '@/services/teacherApi';

interface AssignedSubject {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  divisionId: string;
  divisionName: string;
  studentCount: number;
}

export default function MySubjects() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<AssignedSubject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await teacherApi.getMySubjects();
        setSubjects(res);
      } catch {
        setSubjects([
          { id: '1', subjectId: 's1', subjectName: 'DBMS', subjectCode: 'CS301', divisionId: 'd1', divisionName: 'A', studentCount: 45 },
          { id: '2', subjectId: 's2', subjectName: 'AI', subjectCode: 'CS302', divisionId: 'd1', divisionName: 'A', studentCount: 45 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingState message="Loading subjects..." />;

  return (
    <div>
      <PageHeader
        title="My Subjects"
        subtitle="Subjects assigned to you by HOD"
      />

      {!subjects.length ? (
        <Card><CardBody><EmptyState title="No subjects assigned" description="Contact your HOD for subject assignment." /></CardBody></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {subjects.map((s) => (
            <Card key={s.id} hoverable>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{s.subjectName}</h3>
                    <p className="text-xs text-slate-500">{s.subjectCode}</p>
                  </div>
                  <Badge variant="info">{s.divisionName}</Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                  <span>👥 {s.studentCount} students</span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => navigate(`/teacher/marks-entry?subject=${s.subjectId}&division=${s.divisionId}`)}>
                    Enter Marks
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => navigate(`/teacher/attendance?subject=${s.subjectId}&division=${s.divisionId}`)}>
                    Attendance
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}