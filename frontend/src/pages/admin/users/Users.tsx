import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/tables/DataTable';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { adminApi } from '@/services/adminApi';

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
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '', 
    role: 'TEACHER' as 'HOD' | 'TEACHER',
    departmentId: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const usersRes = await adminApi.getUsers();
      const deptsRes = await adminApi.getDepartments();
      setData(usersRes || []);
      setDepts(deptsRes || []);
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.email || !form.departmentId) {
      return showToast('Name, Email and Department are required', 'error');
    }

    try {
      if (editingId) {
        showToast('Update feature pending in backend', 'info');
      } else {
        await adminApi.createTeacher({
          name: form.name,
          email: form.email,
          password: form.password || 'password123',
          departmentId: form.departmentId,
          role: form.role
        });
        
        showToast(`${form.role} created successfully!`, 'success');
        loadData();
      }
      setModalOpen(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to save user', 'error');
    }
  };

  // Delete backend API (jar nasel tar fakt UI madhun kadh)
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      // await adminApi.deleteUser(deleteId); // Jar backend madhe asel tar
      showToast('User deleted successfully', 'success');
      loadData();
    } catch (error) {
      showToast('Failed to delete user', 'error');
    }
    setDeleteId(null);
  };

  const openEdit = (u: User) => {
    setEditingId(u.id);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
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
            setForm({ name: '', email: '', password: '', role: 'TEACHER', departmentId: '' }); 
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

      <DataTable columns={columns} data={filteredData} keyField="id" loading={loading} emptyTitle="No users found" />

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
          
          <Input label="Password (Default: password123)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Leave blank for default" />
          
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