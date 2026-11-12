import {useEffect, useState} from 'react';
import {PageHeader} from '@/components/layout/PageHeader';
import {Card, CardBody} from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';
import {Select} from '@/components/ui/Select';
import {Modal} from '@/components/ui/Modal';
import {DataTable, Column} from '@/components/tables/DataTable';
import {useToast} from '@/components/ui/Toast';
import {adminApi} from '@/services/adminApi';

interface Department {
  id: string;
  name: string;
  code: string;
  hodId?: string;
}

interface User {
  id: string;
  name: string;
  role: string;
  departmentId: string;
}

export default function HodManagement() {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedHodId, setSelectedHodId] = useState('');

  useEffect(() => {
    setDepartments(adminApi.getDepartments());
    setUsers(adminApi.getUsers());
  }, []);

  const openAssignModal = (dept: Department) => {
    setSelectedDept(dept);
    setSelectedHodId(dept.hodId || '');
    setModalOpen(true);
  };

  const handleAssign = () => {
    if (!selectedDept) return;
    if (!selectedHodId) {
      return showToast('Please select an HOD', 'error');
    }

    const updatedDepts = departments.map(d => 
      d.id === selectedDept.id ? { ...d, hodId: selectedHodId } : d
    );
    
    setDepartments(updatedDepts);
    adminApi.saveDepartments(updatedDepts);
    
    setModalOpen(false);
    showToast('HOD assigned successfully', 'success');
  };

  const availableHods = users.filter(u => u.role === 'HOD');

  const columns: Column<Department>[] = [
    { key: 'code', header: 'Dept Code' },
    { key: 'name', header: 'Department Name' },
    { 
      key: 'hodId', 
      header: 'Current HOD',
      render: (r) => {
        if (!r.hodId) return <span className="text-slate-400 italic">Not Assigned</span>;
        const hod = users.find(u => u.id === r.hodId);
        return hod ? <span className="font-semibold text-indigo-700">{hod.name}</span> : 'Unknown';
      }
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      render: (r) => (
        <Button size="sm" variant="outline" onClick={() => openAssignModal(r)}>
          {r.hodId ? 'Change HOD' : 'Assign HOD'}
        </Button>
      )
    }
  ];

  return (
    <div>
      <PageHeader 
        title="HOD Management" 
        subtitle="Assign or change Head of Department for each department" 
      />

      <Card className="mb-5">
        <CardBody>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4">
            <strong>Note:</strong> You can only assign users who have the <strong>HOD</strong> role. 
            If a teacher is not in the list, go to User Management and change their role to HOD first.
          </div>

          <DataTable 
            columns={columns} 
            data={departments} 
            keyField="id" 
            emptyTitle="No departments found" 
            emptyDescription="Please add departments first in Academic Structure."
          />
        </CardBody>
      </Card>

      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={`Assign HOD to ${selectedDept?.name}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign}>Save Assignment</Button>
          </>
        }
      >
        <div className="space-y-4">
          {availableHods.length === 0 ? (
            <div className="text-red-600 text-sm">
              No HOD users found. Please create a user with role "HOD" first.
            </div>
          ) : (
            <Select 
              label="Select HOD" 
              value={selectedHodId} 
              onChange={e => setSelectedHodId(e.target.value)}
            >
              <option value="">Select HOD</option>
              {availableHods.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </Select>
          )}
        </div>
      </Modal>
    </div>
  );
}