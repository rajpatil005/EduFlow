import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/tables/DataTable';
import { useToast } from '@/components/ui/Toast';
import { adminApi } from '@/services/adminApi';

export default function AdminReports() {
  const { showToast } = useToast();
  const [depts, setDepts] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await adminApi.getDepartments();
      setDepts(res);
      setLoading(false);
    };
    loadData();
  }, []);

  // Mock Data (Backend yet na yet, he demo data disel)
  const mockStats = [
    { id: '1', deptName: 'Computer Science', programmeName: 'BSC-CS', students: 450, teachers: 15, avgAttendance: '85%' },
    { id: '2', deptName: 'Information Technology', programmeName: 'BSC-IT', students: 300, teachers: 10, avgAttendance: '78%' },
    { id: '3', deptName: 'Bachelor of Computer Applications', programmeName: 'BCA', students: 200, teachers: 8, avgAttendance: '82%' },
  ];

  // Filter logic
  const filteredData = selectedDept 
    ? mockStats.filter(s => s.deptName === depts.find(d => d.id === selectedDept)?.name)
    : mockStats;

  // Excel Export Logic
  const exportExcel = () => {
    if (filteredData.length === 0) return showToast('No data to export', 'error');

    const headers = ['Department', 'Programme', 'Total Students', 'Total Teachers', 'Avg Attendance'];
    const rows = filteredData.map(s => [s.deptName, s.programmeName, s.students, s.teachers, s.avgAttendance]);

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Global-Report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Excel downloaded successfully', 'success');
  };

  const columns: Column<any>[] = [
    { key: 'deptName', header: 'Department', render: r => <span className="font-semibold text-slate-900">{r.deptName}</span> },
    { key: 'programmeName', header: 'Programme', render: r => <Badge variant="info">{r.programmeName}</Badge> },
    { key: 'students', header: 'Students' },
    { key: 'teachers', header: 'Teachers' },
    { key: 'avgAttendance', header: 'Avg Attendance', render: r => <span className="font-semibold text-emerald-600">{r.avgAttendance}</span> },
  ];

  return (
    <div>
      <PageHeader 
        title="Global Reports" 
        subtitle="Overview of all departments and programmes"
        actions={<Button onClick={exportExcel}>📊 Download Excel</Button>}
      />

      <Card className="mb-5">
        <CardBody>
          <div className="w-64">
            <Select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}>
              <option value="">All Departments</option>
              {depts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
          </div>
        </CardBody>
      </Card>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        keyField="id" 
        loading={loading}
        emptyTitle="No records found" 
      />
    </div>
  );
}