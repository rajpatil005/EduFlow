import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DataTable, Column } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { adminApi } from '@/services/adminApi';

interface Department {
  id: string;
  name: string;
  code: string;
}

export default function Departments() {
  const { showToast } = useToast();
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', code: '' });

  // Load data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getDepartments();
      setData(res);
    } catch (err) {
      showToast('Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.code) {
      return showToast('Fill all fields', 'error');
    }
    try {
      await adminApi.createDepartment({ code: form.code, name: form.name });
      showToast('Department created successfully', 'success');
      setModalOpen(false);
      setForm({ name: '', code: '' });
      loadData(); // Refresh list
    } catch (err) {
      showToast('Failed to create department', 'error');
    }
  };

  const columns: Column<Department>[] = [
    { key: 'code', header: 'Code' },
    { key: 'name', header: 'Department Name' },
  ];

  return (
    <div>
      <PageHeader 
        title="Departments" 
        subtitle="Manage college departments" 
        actions={<Button onClick={() => setModalOpen(true)}>+ Add Department</Button>} 
      />
      
      <DataTable columns={columns} data={data} keyField="id" loading={loading} emptyTitle="No departments" />

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Department" 
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Department Code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS" />
          <Input label="Department Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Computer Science" />
        </div>
      </Modal>
    </div>
  );
}