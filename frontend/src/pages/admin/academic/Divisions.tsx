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

export default function Divisions() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [sems, setSems] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', semesterId: '' });

  useEffect(() => {
    setData(adminApi.getDivisions());
    setSems(adminApi.getSemesters());
  }, []);

  const handleSave = () => {
    if (!form.name || !form.semesterId) return showToast('Fill all fields', 'error');
    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
    }
    setData(updated); adminApi.saveDivisions(updated); setModalOpen(false); showToast('Division saved', 'success');
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated); adminApi.saveDivisions(updated); setDeleteId(null); showToast('Deleted', 'success');
  };

  const columns: Column<any>[] = [
    { key: 'name', header: 'Division Name', render: r => `Division ${r.name}` },
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
      <PageHeader title="Divisions" subtitle="Manage classes/divisions" actions={<Button onClick={() => { setEditingId(null); setForm({ name: '', semesterId: '' }); setModalOpen(true); }}>+ Add Division</Button>} />
      <DataTable columns={columns} data={data} keyField="id" emptyTitle="No divisions" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Division" footer={
        <><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>
      }>
        <div className="space-y-4">
          <Select label="Semester" value={form.semesterId} onChange={e => setForm({ ...form, semesterId: e.target.value })}>
            <option value="">Select Semester</option>
            {sems.map(s => <option key={s.id} value={s.id}>Sem {s.number}</option>)}
          </Select>
          <Input label="Division Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. A" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}