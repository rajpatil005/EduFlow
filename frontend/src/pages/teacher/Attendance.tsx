import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/components/ui/Toast';
import { attendanceApi } from '@/services/attendanceApi';

type Status = 'P' | 'A' | 'L';

interface Student {
  id: string;
  rollNo: string;
  fullName: string;
  status: Status;
}

export default function Attendance() {
  const { showToast } = useToast();
  const [subjectId, setSubjectId] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!subjectId || !divisionId) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await attendanceApi.getStudents(subjectId, divisionId);
        setStudents(res.map((s: any) => ({ ...s, status: 'P' })));
      } catch {
        setStudents([
          { id: '1', rollNo: '101', fullName: 'Aarav Sharma', status: 'P' },
          { id: '2', rollNo: '102', fullName: 'Diya Patel', status: 'P' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [subjectId, divisionId]);

  const toggle = (id: string, status: Status) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await attendanceApi.mark({ subjectId, divisionId, date, records: students.map((s) => ({ studentId: s.id, status: s.status })) });
      showToast('Attendance saved successfully', 'success');
    } catch {
      showToast('Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Attendance" subtitle="Mark attendance for your class" />

      <Card className="mb-5">
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="">Select subject</option>
              <option value="s1">DBMS</option>
              <option value="s2">AI</option>
            </Select>
            <Select label="Division" value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
              <option value="">Select division</option>
              <option value="d1">A</option>
              <option value="d2">B</option>
            </Select>
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <LoadingState />
      ) : students.length > 0 && (
        <>
          <Card className="mb-4">
            <CardBody>
              <div className="space-y-2">
                {students.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.fullName}</p>
                      <p className="text-xs text-slate-500">Roll No: {s.rollNo}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant={s.status === 'P' ? 'success' : 'outline'} onClick={() => toggle(s.id, 'P')}>Present</Button>
                      <Button size="sm" variant={s.status === 'A' ? 'danger' : 'outline'} onClick={() => toggle(s.id, 'A')}>Absent</Button>
                      <Button size="sm" variant={s.status === 'L' ? 'secondary' : 'outline'} onClick={() => toggle(s.id, 'L')}>Leave</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} loading={saving}>Save Attendance</Button>
          </div>
        </>
      )}
    </div>
  );
}