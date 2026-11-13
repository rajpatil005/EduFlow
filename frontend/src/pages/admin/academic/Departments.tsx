import {useEffect, useState} from 'react';
import {PageHeader} from '@/components/layout/PageHeader';
import {Card, CardBody } from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Modal} from '@/components/ui/Modal';
import {DataTable, Column} from '@/components/tables/DataTable';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {useToast} from '@/components/ui/Toast';
import {adminApi} from '@/services/adminApi';

interface Department {
  id: string;
  name: string;
  code: string;
}

export default function Departments() {
  const {showToast} = useToast();
  const [data, setData] = useState<Department[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '' });

  useEffect(() => {
    setData(adminApi.getDepartments());
  }, []);

  const handleSave = () => {
    if (!form.name || !form.code) return showToast('Fill all fields', 'error');
    
    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
      showToast('Department updated', 'success');
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
      showToast('Department added', 'success');
    }
    setData(updated);
    adminApi.saveDepartments(updated);
    setModalOpen(false);
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated);
    adminApi.saveDepartments(updated);
    setDeleteId(null);
    showToast('Department deleted', 'success');
  };

  const columns: Column<Department>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Department Name' },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setEditingId(r.id); setForm({ name: r.name, code: r.code }); setModalOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Departments" subtitle="Manage college departments" actions={<Button onClick={() => { setEditingId(null); setForm({ name: '', code: '' }); setModalOpen(true); }}>+ Add Department</Button>} />
      
      <DataTable columns={columns} data={data} keyField="id" emptyTitle="No departments" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Department" footer={
        <><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>
      }>
        <div className="space-y-4">
          <Input label="Department Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS" />
          <Input label="Department Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Computer Science" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}