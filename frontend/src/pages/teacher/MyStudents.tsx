import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { studentApi } from '@/services/studentApi';
import { teacherApi } from '@/services/teacherApi';
import type { Student } from '@/types/student';
import type { TeacherAssignment } from '@/types/teacher';

const emptyForm = {
  fullName: '',
  email: '',
  rollNo: '',
  prn: '',
  divisionId: '',
  admissionYear: new Date().getFullYear().toString(),
};

export default function MyStudents() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [divisions, setDivisions] = useState<TeacherAssignment[]>([]);
  const [selectedDivision, setSelectedDivision] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadDivisions = async () => {
    setLoading(true);
    try {
      const assignments: TeacherAssignment[] = await teacherApi.getMyAssignments();
      setDivisions(assignments);
      if (assignments.length > 0) setSelectedDivision(assignments[0].divisionId);
    } catch {
      const mockAssignments: TeacherAssignment[] = [
        { id: 'a1', subjectId: 's1', subjectName: 'DBMS', divisionId: 'd1', divisionName: 'A', studentCount: 2 },
        { id: 'a2', subjectId: 's2', subjectName: 'AI', divisionId: 'd2', divisionName: 'B', studentCount: 1 },
      ];
      setDivisions(mockAssignments);
      setSelectedDivision('d1');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (divisionId: string) => {
    if (!divisionId) {
      setStudents([]);
      return;
    }
    try {
      const res = await studentApi.getByDivision(divisionId);
      setStudents(res);
    } catch {
      const mockStudents: Record<string, Student[]> = {
        d1: [
          { id: '1', rollNo: '101', prn: 'PRN101', fullName: 'Aarav Sharma', email: 'aarav@edu.com', divisionId: 'd1', divisionName: 'A', admissionYear: '2023' },
          { id: '2', rollNo: '102', prn: 'PRN102', fullName: 'Diya Patel', email: 'diya@edu.com', divisionId: 'd1', divisionName: 'A', admissionYear: '2023' },
        ],
        d2: [
          { id: '3', rollNo: '201', prn: 'PRN201', fullName: 'Rohan Verma', email: 'rohan@edu.com', divisionId: 'd2', divisionName: 'B', admissionYear: '2023' },
        ],
      };
      setStudents(mockStudents[divisionId] || []);
    }
  };

  useEffect(() => {
    loadDivisions();
  }, []);

  useEffect(() => {
    if (selectedDivision) loadStudents(selectedDivision);
  }, [selectedDivision]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm, divisionId: selectedDivision });
    setModalOpen(true);
  };

  const openEdit = (s: Student) => {
    setEditingId(s.id);
    setForm({
      fullName: s.fullName,
      email: s.email,
      rollNo: s.rollNo,
      prn: s.prn,
      divisionId: s.divisionId,
      admissionYear: s.admissionYear || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.fullName || !form.rollNo || !form.prn || !form.divisionId) {
      showToast('Please fill all required fields', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await studentApi.update(editingId, form);
        setStudents((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
        showToast('Student updated', 'success');
      } else {
        await studentApi.create(form);
        showToast('Student added', 'success');
        await loadStudents(selectedDivision);
      }
      setModalOpen(false);
    } catch {
      // Mock fallback
      if (editingId) {
        setStudents((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)));
        showToast('Student updated (mock)', 'success');
      } else {
        setStudents((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            ...form,
            divisionName: divisions.find((d) => d.divisionId === form.divisionId)?.divisionName || '',
          },
        ]);
        showToast('Student added (mock)', 'success');
      }
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await studentApi.remove(deleteId);
    } catch {
      /* mock */
    }
    setStudents((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
    showToast('Student deleted', 'success');
  };

  const columns: Column<Student>[] = [
    { key: 'rollNo', header: 'Roll No' },
    { key: 'fullName', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'prn', header: 'PRN' },
    {
      key: 'divisionName',
      header: 'Division',
      render: (r) => <Badge variant="info">{r.divisionName || '—'}</Badge>,
    },
    { key: 'admissionYear', header: 'Year' },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Students"
        subtitle="Manage students in your assigned divisions"
        actions={<Button onClick={openAdd}>+ Add Student</Button>}
      />

      <Card className="mb-5">
        <CardBody>
          <Select
            label="Select Division"
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
          >
            <option value="">Select division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.divisionId}>
                Division {d.divisionName} — {d.subjectName}
              </option>
            ))}
          </Select>
        </CardBody>
      </Card>

      <DataTable
        columns={columns}
        data={students}
        keyField="id"
        loading={loading}
        emptyTitle="No students"
        emptyDescription="Add your first student to this division."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Student' : 'Add New Student'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name *"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="e.g., Aarav Sharma"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="e.g., aarav@college.edu"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Roll No *"
              value={form.rollNo}
              onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
              placeholder="e.g., 101"
            />
            <Input
              label="PRN *"
              value={form.prn}
              onChange={(e) => setForm({ ...form, prn: e.target.value })}
              placeholder="e.g., 2023001"
            />
          </div>
          <Select
            label="Division *"
            value={form.divisionId}
            onChange={(e) => setForm({ ...form, divisionId: e.target.value })}
          >
            <option value="">Select division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.divisionId}>
                Division {d.divisionName} — {d.subjectName}
              </option>
            ))}
          </Select>
          <Input
            label="Admission Year"
            type="number"
            value={form.admissionYear}
            onChange={(e) => setForm({ ...form, admissionYear: e.target.value })}
            placeholder="e.g., 2023"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Student"
        message="Are you sure? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}