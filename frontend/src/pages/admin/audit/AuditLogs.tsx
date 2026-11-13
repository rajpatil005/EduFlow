import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { DataTable, Column } from '@/components/tables/DataTable';
import { adminApi } from '@/services/adminApi';
import { formatDate } from '@/utils/formatDate';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  entity: string;
  timestamp: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Load logs from localStorage
    // Jar kahi logs nasel tar demo sathi khali dilele logs load hoil
    let existingLogs = adminApi.getAuditLogs();
    
    if (existingLogs.length === 0) {
      // Demo Logs (Fakt pehila load kelyavar disel)
      existingLogs = [
        { id: '1', user: 'Admin', action: 'Assigned HOD', entity: 'Dr. Priya Sharma → Computer Science', timestamp: new Date().toISOString() },
        { id: '2', user: 'Admin', action: 'Added Teacher', entity: 'Prof. Rajesh Kumar', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', user: 'Admin', action: 'Created Department', entity: 'Information Technology', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: '4', user: 'Teacher (Rajesh)', action: 'Submitted Marks', entity: 'DBMS - Division A', timestamp: new Date(Date.now() - 259200000).toISOString() },
      ];
      localStorage.setItem('admin_audit_logs', JSON.stringify(existingLogs));
    }
    
    setLogs(existingLogs);
  }, []);

  // Search logic
  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.entity.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<AuditLog>[] = [
    { 
      key: 'timestamp', 
      header: 'Date & Time', 
      render: (r) => (
        <span className="text-xs text-slate-500 font-mono">
          {formatDate(r.timestamp, 'DD/MM/YYYY')} {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )
    },
    { 
      key: 'user', 
      header: 'User',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
            {r.user.charAt(0)}
          </div>
          <span className="font-medium text-slate-800">{r.user}</span>
        </div>
      )
    },
    { 
      key: 'action', 
      header: 'Action',
      render: (r) => (
        <Badge variant={
          r.action.includes('Created') ? 'success' :
          r.action.includes('Added') ? 'info' :
          r.action.includes('Deleted') ? 'danger' :
          r.action.includes('Assigned') ? 'purple' : 'default'
        }>
          {r.action}
        </Badge>
      )
    },
    { 
      key: 'entity', 
      header: 'Details',
      render: (r) => <span className="text-slate-600">{r.entity}</span>
    },
  ];

  return (
    <div>
      <PageHeader 
        title="Audit Logs" 
        subtitle="Track all system activities and changes" 
      />

      <Card className="mb-5">
        <CardBody>
          <div className="w-full max-w-md">
            <Input 
              placeholder="Search by user, action, or entity..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      <DataTable 
        columns={columns} 
        data={filteredLogs} 
        keyField="id" 
        emptyTitle="No activity logs found"
        emptyDescription="Actions performed by Admin, HOD, or Teachers will appear here."
      />
    </div>
  );
}