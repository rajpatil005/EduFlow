import {useEffect, useState} from 'react';
import {PageHeader} from '@/components/layout/PageHeader';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {Modal} from '@/components/ui/Modal';
import {DataTable, Column} from '@/components/tables/DataTable';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {useToast} from '@/components/ui/Toast';
import {adminApi} from '@/services/adminApi';

export default function Programmes() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '', departmentId: '' });

  useEffect(() => {
    setData(adminApi.getProgrammes());
    setDepts(adminApi.getDepartments());
  }, []);

  const handleSave = () => {
    if (!form.name || !form.departmentId) return showToast('Fill all fields', 'error');
    
    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
    }
    setData(updated);
    adminApi.saveProgrammes(updated);
    setModalOpen(false);
    showToast('Programme saved', 'success');
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated);
    adminApi.saveProgrammes(updated);
    setDeleteId(null);
    showToast('Deleted', 'success');
  };

  const columns: Column<any>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Programme Name' },
    { key: 'departmentId', header: 'Department', render: (r) => depts.find(d => d.id === r.departmentId)?.name || 'N/A' },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setEditingId(r.id); setForm(r); setModalOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Programmes" subtitle="Manage degree programmes" actions={<Button onClick={() => { setEditingId(null); setForm({ name: '', code: '', departmentId: '' }); setModalOpen(true); }}>+ Add Programme</Button>} />
      <DataTable columns={columns} data={data} keyField="id" emptyTitle="No programmes" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Programme" footer={
        <><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>
      }>
        <div className="space-y-4">
          <Select label="Department" value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
            <option value="">Select Department</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
          <Input label="Programme Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. BSC-CS" />
          <Input label="Programme Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. BSc Computer Science" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}