import {useEffect, useState} from 'react';
import {PageHeader} from '@/components/layout/PageHeader';
import {Button} from '@/components/ui/Button';
import {Input} from '@/components/ui/Input';
import {Select} from '@/components/ui/Select';
import {Modal} from '@/components/ui/Modal';
import {Badge} from '@/components/ui/Badge';
import {DataTable, Column} from '@/components/tables/DataTable';
import {ConfirmDialog} from '@/components/ui/ConfirmDialog';
import {useToast} from '@/components/ui/Toast';
import {adminApi} from '@/services/adminApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'HOD' | 'TEACHER'; 
  departmentId?: string;
}

export default function Users() {
  const { showToast } = useToast();
  const [data, setData] = useState<User[]>([]);
  const [depts, setDepts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'TEACHER' as 'HOD' | 'TEACHER',
    departmentId: '',
  });

  useEffect(() => {
    setData(adminApi.getUsers());
    setDepts(adminApi.getDepartments());
  }, []);

  const handleSave = () => {
    if (!form.name || !form.email || !form.role || !form.departmentId) {
      return showToast('All fields are required', 'error');
    }

    let updated;
    if (editingId) {
      updated = data.map(d => d.id === editingId ? { ...d, ...form } : d);
      showToast('User updated', 'success');
    } else {
      updated = [...data, { id: Date.now().toString(), ...form }];
      showToast('User added', 'success');
    }
    
    setData(updated);
    adminApi.saveUsers(updated);
    setModalOpen(false);
  };

  const handleDelete = () => {
    const updated = data.filter(d => d.id !== deleteId);
    setData(updated);
    adminApi.saveUsers(updated);
    setDeleteId(null);
    showToast('User deleted', 'success');
  };

  const openEdit = (u: User) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      role: u.role === 'HOD' ? 'HOD' : 'TEACHER',
      departmentId: u.departmentId || '',
    });
    setModalOpen(true);
  };

  const filteredData = filterRole ? data.filter(u => u.role === filterRole) : data;

  const columns: Column<User>[] = [
    { key: 'name', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (r) => (
        <Badge variant={r.role === 'HOD' ? 'purple' : r.role === 'TEACHER' ? 'info' : 'danger'}>
          {r.role}
        </Badge>
      )
    },
    { 
      key: 'departmentId', 
      header: 'Department',
      render: (r) => {
        const dept = depts.find(d => d.id === r.departmentId);
        return dept ? dept.name : 'N/A';
      }
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
          <Button size="sm" variant="danger" onClick={() => setDeleteId(r.id)}>Delete</Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Manage Users" 
        subtitle="Add or edit Teachers and HODs"
        actions={
          <Button onClick={() => { 
            setEditingId(null); 
            setForm({ name: '', email: '', role: 'TEACHER', departmentId: '' }); 
            setModalOpen(true); 
          }}>
            + Add User
          </Button>
        } 
      />
      
      <div className="mb-4 w-64">
        <Select value={filterRole} onChange={e => setFilterRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="TEACHER">Teachers</option>
          <option value="HOD">HODs</option>
        </Select>
      </div>

      <DataTable columns={columns} data={filteredData} keyField="id" emptyTitle="No users found" />

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingId ? 'Edit User' : 'Add New User'}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save User</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rajesh Kumar" />
          <Input label="Email Address *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. rajesh@college.edu" />
          
          <Select label="Role *" value={form.role} onChange={e => setForm({ ...form, role: e.target.value as 'HOD' | 'TEACHER' })}>
            <option value="TEACHER">Teacher</option>
            <option value="HOD">Head of Department (HOD)</option>
          </Select>

          <Select label="Department *" value={form.departmentId} onChange={e => setForm({ ...form, departmentId: e.target.value })}>
            <option value="">Select Department</option>
            {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </Select>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} title="Delete User" message="Are you sure you want to delete this user?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}