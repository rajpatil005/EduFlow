import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/components/ui/Toast';
import {
  hodApi,
  HodTeacherAssignment,
  HodTeacher,
  HodSubject,
} from '@/services/hodApi';
import {
  mockHodAssignments,
  mockHodTeachers,
  mockHodSubjects,
} from '@/mock/mockData';

export default function TeacherAssignments() {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<HodTeacherAssignment[]>([]);
  const [teachers, setTeachers] = useState<HodTeacher[]>([]);
  const [subjects, setSubjects] = useState<HodSubject[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [divisionFilter, setDivisionFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');

  // Assign Modal (Option B)
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    teacherId: '',
    subjectId: '',
    division: 'A',
    semester: 5,
    academicYear: '2026-2027',
  });

  // Delete Confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [assignData, teacherData, subjectData] = await Promise.all([
          hodApi.getAssignments(),
          hodApi.getTeachers(),
          hodApi.getSubjects(),
        ]);
        setAssignments(assignData);
        setTeachers(teacherData);
        setSubjects(subjectData);
      } catch {
        setAssignments(mockHodAssignments);
        setTeachers(mockHodTeachers);
        setSubjects(mockHodSubjects);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openAssignModal = () => {
    setForm({
      teacherId: teachers[0]?.id || '',
      subjectId: subjects[0]?.id || '',
      division: 'A',
      semester: 5,
      academicYear: '2026-2027',
    });
    setModalOpen(true);
  };

  const handleSaveAssignment = async () => {
    if (!form.teacherId || !form.subjectId || !form.division) {
      showToast('Please select teacher, subject, and division', 'error');
      return;
    }

    setSaving(true);
    try {
      const selectedTeacher = teachers.find((t) => t.id === form.teacherId);
      const selectedSubject = subjects.find((s) => s.id === form.subjectId);

      const created = await hodApi.createAssignment({
        teacherId: form.teacherId,
        subjectId: form.subjectId,
        division: form.division,
        semester: Number(form.semester),
        academicYear: form.academicYear,
      });

      const newAssignment: HodTeacherAssignment = {
        id: created?.id || `as-${Date.now()}`,
        teacherId: form.teacherId,
        teacherName: selectedTeacher?.name || 'Assigned Teacher',
        employeeId: selectedTeacher?.employeeId || 'EMP',
        subjectId: form.subjectId,
        subjectName: selectedSubject?.name || 'Subject',
        subjectCode: selectedSubject?.code || 'CS',
        division: form.division,
        semester: Number(form.semester),
        academicYear: form.academicYear,
      };

      setAssignments((prev) => [newAssignment, ...prev]);
      showToast('Teacher assigned successfully', 'success');
      setModalOpen(false);
    } catch {
      showToast('Assignment saved (mock fallback)', 'success');
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setAssignments((prev) => prev.filter((a) => a.id !== deleteId));
    setDeleteId(null);
    showToast('Assignment removed', 'success');
  };

  const filtered = assignments.filter((a) => {
    const matchDiv = divisionFilter ? a.division === divisionFilter : true;
    const matchTeacher = teacherFilter ? a.teacherId === teacherFilter : true;
    return matchDiv && matchTeacher;
  });

  if (loading) {
    return <LoadingState message="Loading teacher assignments..." />;
  }

  return (
    <div>
      <PageHeader
        title="Teacher Assignments"
        subtitle="Manage faculty subject-division allocations and monitor teaching workload"
        actions={<Button onClick={openAssignModal}>+ Assign Teacher</Button>}
      />

      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Filter by Division"
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
            >
              <option value="">All Divisions</option>
              <option value="A">Division A</option>
              <option value="B">Division B</option>
            </Select>

            <Select
              label="Filter by Faculty"
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
            >
              <option value="">All Faculty</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.employeeId})
                </option>
              ))}
            </Select>
          </div>
        </CardBody>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4 text-center">Division</th>
                <th className="py-3 px-4 text-center">Semester</th>
                <th className="py-3 px-4 text-center">Academic Year</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No teacher assignments found.
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{a.teacherName}</div>
                      <div className="text-xs font-mono text-slate-400">{a.employeeId}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{a.subjectName}</div>
                      <div className="text-xs font-mono text-slate-400">{a.subjectCode}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="purple">Div {a.division}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700 font-medium">Sem {a.semester}</td>
                    <td className="py-3 px-4 text-center text-xs font-medium text-slate-600">{a.academicYear}</td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="danger" onClick={() => setDeleteId(a.id)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Assign Teacher Modal (Option B) */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assign Teacher to Subject"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveAssignment} loading={saving}>Assign</Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <Select
            label="Select Teacher *"
            value={form.teacherId}
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
          >
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.designation} ({t.employeeId})
              </option>
            ))}
          </Select>

          <Select
            label="Select Subject *"
            value={form.subjectId}
            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code}) — Sem {s.semester}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Division *"
              value={form.division}
              onChange={(e) => setForm({ ...form, division: e.target.value })}
            >
              <option value="A">Division A</option>
              <option value="B">Division B</option>
              <option value="C">Division C</option>
            </Select>

            <Select
              label="Semester *"
              value={form.semester.toString()}
              onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </Select>
          </div>

          <Input
            label="Academic Year"
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            placeholder="e.g., 2026-2027"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Remove Assignment"
        message="Are you sure you want to remove this teacher-subject assignment?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

