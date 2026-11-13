import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { adminApi } from '@/services/adminApi';

export default function Subjects() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [sems, setSems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '', semesterId: '' });

  useEffect(() => {
    setData(adminApi.getSubjects());
    setSems(adminApi.getSemesters());
  }, []);

  const handleSave = () => {
    if (!form.name || !form.code || !form.semesterId) return showToast('Fill all fields', 'error');
    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
    }
    setData(updated); adminApi.saveSubjects(updated); setModalOpen(false); showToast('Subject saved', 'success');
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated); adminApi.saveSubjects(updated); setDeleteId(null); showToast('Deleted', 'success');
  };

  const columns: Column<any>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Subject Name' },
    { key: 'semesterId', header: 'Semester', render: (r) => {
        const sem = sems.find(s => s.id === r.semesterId);
        return sem ? `Sem ${sem.number}` : 'N/A';
      } 
    },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setEditingId(r.id); setForm(r); setModalOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Subjects" subtitle="Manage subjects" actions={<Button onClick={() => { setEditingId(null); setForm({ name: '', code: '', semesterId: '' }); setModalOpen(true); }}>+ Add Subject</Button>} />
      <DataTable columns={columns} data={data} keyField="id" emptyTitle="No subjects" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Subject" footer={
        <><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>
      }>
        <div className="space-y-4">
          <Select label="Semester" value={form.semesterId} onChange={e => setForm({ ...form, semesterId: e.target.value })}>
            <option value="">Select Semester</option>
            {sems.map(s => <option key={s.id} value={s.id}>Sem {s.number}</option>)}
          </Select>
          <Input label="Subject Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS301" />
          <Input label="Subject Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. DBMS" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}