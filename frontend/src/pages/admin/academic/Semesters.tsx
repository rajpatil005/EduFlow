import {useEffect, useState} from 'react';
import {PageHeader} from '@/components/layout/PageHeader';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {Modal } from '@/components/ui/Modal';
import {DataTable, Column } from '@/components/tables/DataTable';
import {ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {useToast } from '@/components/ui/Toast';
import {adminApi } from '@/services/adminApi';

export default function Semesters() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [years, setYears] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ number: '', yearId: '' });

  useEffect(() => {
    setData(adminApi.getSemesters());
    setYears(adminApi.getYears());
  }, []);

  const handleSave = () => {
    if (!form.number || !form.yearId) return showToast('Fill all fields', 'error');
    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
    }
    setData(updated); adminApi.saveSemesters(updated); setModalOpen(false); showToast('Semester saved', 'success');
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated); adminApi.saveSemesters(updated); setDeleteId(null); showToast('Deleted', 'success');
  };

  const columns: Column<any>[] = [
    { key: 'number', header: 'Semester No.', render: r => `Sem ${r.number}` },
    { key: 'yearId', header: 'Academic Year', render: (r) => years.find(y => y.id === r.yearId)?.label || 'N/A' },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setEditingId(r.id); setForm(r); setModalOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Semesters" subtitle="Manage semesters" actions={<Button onClick={() => { setEditingId(null); setForm({ number: '', yearId: '' }); setModalOpen(true); }}>+ Add Semester</Button>} />
      <DataTable columns={columns} data={data} keyField="id" emptyTitle="No semesters" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Semester" footer={
        <><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>
      }>
        <div className="space-y-4">
          <Select label="Academic Year" value={form.yearId} onChange={e => setForm({ ...form, yearId: e.target.value })}>
            <option value="">Select Year</option>
            {years.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
          </Select>
          <Input label="Semester Number" type="number" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} placeholder="e.g. 1" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}