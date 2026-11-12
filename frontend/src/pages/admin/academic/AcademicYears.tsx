import {useEffect, useState} from 'react';
import {PageHeader} from '@/components/layout/PageHeader';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {Modal} from '@/components/ui/Modal';
import {DataTable, Column} from '@/components/tables/DataTable';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import{useToast} from '@/components/ui/Toast';
import {adminApi} from '@/services/adminApi';

export default function AcademicYears() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ label: '', programmeId: '' });

  useEffect(() => {
    setData (adminApi.getYears());
    setProgrammes(adminApi.getProgrammes());
  }, []);

  const handleSave = () => {
    if (!form.label || !form.programmeId) return showToast('Fill all fields', 'error');
    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
    }
    setData(updated);
    adminApi.saveYears(updated);
    setModalOpen(false);
    showToast('Academic Year saved', 'success');
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated); adminApi.saveYears(updated); setDeleteId(null); showToast('Deleted', 'success');
  };

  const columns: Column<any>[] = [
    { key: 'label', header: 'Year Label' },
    { key: 'programmeId', header: 'Programme', render: (r) => programmes.find(p => p.id === r.programmeId)?.name || 'N/A' },
    { key: 'actions', header: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setEditingId(r.id); setForm(r); setModalOpen(true); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
      </div>
    )}
  ];

  return (
    <div>
      <PageHeader title="Academic Years" subtitle="Manage academic sessions" actions={<Button onClick={() => { setEditingId(null); setForm({ label: '', programmeId: '' }); setModalOpen(true); }}>+ Add Year</Button>} />
      <DataTable columns={columns} data={data} keyField="id" emptyTitle="No years" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Academic Year" footer={
        <><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>
      }>
        <div className="space-y-4">
          <Select label="Programme" value={form.programmeId} onChange={e => setForm({ ...form, programmeId: e.target.value })}>
            <option value="">Select Programme</option>
            {programmes.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Input label="Year Label" value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. 2023-2024" />
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete" message="Are you sure?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}