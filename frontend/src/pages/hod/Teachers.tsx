import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/components/ui/Toast';
import { hodApi, HodTeacher } from '@/services/hodApi';
import { mockHodTeachers } from '@/mock/mockData';

const DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Lecturer',
];

export default function Teachers() {
  const { showToast } = useToast();
  const [teachers, setTeachers] = useState<HodTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<HodTeacher | null>(null);

  // Add Teacher Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    designation: 'Assistant Professor',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await hodApi.getTeachers();
        setTeachers(data);
      } catch {
        setTeachers(mockHodTeachers);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openAddModal = () => {
    setAddForm({ name: '', email: '', employeeId: '', designation: 'Assistant Professor' });
    setAddModalOpen(true);
  };

  const handleAddTeacher = () => {
    if (!addForm.name.trim() || !addForm.email.trim() || !addForm.employeeId.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const newTeacher: HodTeacher = {
      id: `t-${Date.now()}`,
      name: addForm.name.trim(),
      email: addForm.email.trim(),
      employeeId: addForm.employeeId.trim(),
      designation: addForm.designation,
      assignedSubjects: [],
      workloadHours: 0,
      status: 'ACTIVE',
    };

    setTeachers((prev) => [newTeacher, ...prev]);
    showToast('Teacher added successfully', 'success');
    setAddModalOpen(false);
  };

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.employeeId.toLowerCase().includes(q) ||
      t.designation.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return <LoadingState message="Loading teachers..." />;
  }

  return (
    <div>
      <PageHeader
        title="Department Teachers"
        subtitle="View and monitor faculty members, designations, and teaching workloads"
        actions={
          <Button onClick={openAddModal}>+ Add Teacher</Button>
        }
      />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-md">
            <Input
              placeholder="Search by name, employee ID, or designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee ID</th>
                <th className="py-3 px-4">Faculty Name</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4">Assigned Subjects</th>
                <th className="py-3 px-4 text-center">Workload</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No faculty found matching your search.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-600">{t.employeeId}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      <div>{t.name}</div>
                      <div className="text-xs text-slate-400">{t.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{t.designation}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {t.assignedSubjects.map((s) => (
                          <Badge key={s} variant="info" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-700">
                      {t.workloadHours} hrs/wk
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant={t.status === 'ACTIVE' ? 'success' : 'default'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelectedTeacher(t)}>
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

      {/* Add Teacher Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Teacher"
        footer={
          <>
            <Button variant="outline" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTeacher}>Save Teacher</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name *"
            value={addForm.name}
            onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
            placeholder="e.g. Dr. Rajesh Kumar"
          />
          <Input
            label="Email Address *"
            type="email"
            value={addForm.email}
            onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
            placeholder="e.g. rajesh@eduflow.local"
          />
          <Input
            label="Employee ID *"
            value={addForm.employeeId}
            onChange={(e) => setAddForm({ ...addForm, employeeId: e.target.value })}
            placeholder="e.g. EMP015"
          />
          <Select
            label="Designation *"
            value={addForm.designation}
            onChange={(e) => setAddForm({ ...addForm, designation: e.target.value })}
          >
            {DESIGNATIONS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </div>
      </Modal>

      {/* View Teacher Details Modal */}
      <Modal
        open={!!selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        title="Teacher Profile"
        footer={<Button variant="outline" onClick={() => setSelectedTeacher(null)}>Close</Button>}
      >
        {selectedTeacher && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <p className="text-xs text-slate-500 uppercase">Employee ID</p>
                <p className="font-semibold text-slate-800">{selectedTeacher.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Status</p>
                <Badge variant={selectedTeacher.status === 'ACTIVE' ? 'success' : 'default'}>
                  {selectedTeacher.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Full Name</p>
              <p className="font-semibold text-slate-900 text-base">{selectedTeacher.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Email Address</p>
              <p className="text-slate-700">{selectedTeacher.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Designation</p>
              <p className="text-slate-700">{selectedTeacher.designation}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Weekly Teaching Workload</p>
              <p className="text-slate-800 font-medium">{selectedTeacher.workloadHours} Hours / Week</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase mb-1">Assigned Subjects</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedTeacher.assignedSubjects.map((s) => (
                  <Badge key={s} variant="info">{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

