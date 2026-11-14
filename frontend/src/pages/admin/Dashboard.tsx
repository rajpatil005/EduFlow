import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { adminApi } from '@/services/adminApi';

interface Stats {
  departments: number;
  programmes: number;
  teachers: number;
  hods: number;
  subjects: number;
  divisions: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    departments: 0,
    programmes: 0,
    teachers: 0,
    hods: 0,
    subjects: 0,
    divisions: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Departments (Backend madhe ahe)
        const depts = await adminApi.getDepartments();
        
        // 2. Users (Backend madhe ahe - Teachers aani HODs sathi)
        const users = await adminApi.getUsers();
        const teachersList = users.filter((u: any) => u.role === 'TEACHER');
        const hodsList = users.filter((u: any) => u.role === 'HOD');

        // 3. Baki data (Backend madhe nahit tar 0 thev)
        // Jar frd ne APIs banavle asel tar ya khali aslele uncomment kar
        // const programmes = await adminApi.getProgrammes();
        // const subjects = await adminApi.getSubjects();
        // const divisions = await adminApi.getDivisions();

        setStats({
          departments: depts.length || 0,
          programmes: 0, // Tyavar backend APIs nasel tar 0
          teachers: teachersList.length || 0,
          hods: hodsList.length || 0,
          subjects: 0,
          divisions: 0,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Departments', value: stats.departments, color: 'from-blue-500 to-indigo-500', link: '/admin/departments' },
    { label: 'Total Programmes', value: stats.programmes, color: 'from-purple-500 to-pink-500', link: '/admin/programmes' },
    { label: 'Total Subjects', value: stats.subjects, color: 'from-emerald-500 to-teal-500',  link: '/admin/subjects' },
    { label: 'Total Divisions', value: stats.divisions, color: 'from-amber-500 to-orange-500', link: '/admin/divisions' },
    { label: 'Total Teachers', value: stats.teachers, color: 'from-cyan-500 to-blue-500',  link: '/admin/users' },
    { label: 'Total HODs', value: stats.hods, color: 'from-rose-500 to-red-500', link: '/admin/hod' },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Overview of the entire EduFlow System"
        actions={
          <Button onClick={() => navigate('/admin/users')}>+ Add New User</Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {statCards.map((c) => (
          <Card 
            key={c.label} 
            hoverable 
            className="cursor-pointer"
            onClick={() => navigate(c.link)}
          >
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{c.label}</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{c.value}</p>
                </div>
                <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl shadow-sm opacity-90`}>
                  {c.icon}
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <Card>
          <CardHeader>
            <CardTitle> Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/admin/users')}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center"></div>
                <p className="font-medium text-slate-700">Add New Teacher or HOD</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/admin/departments')}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-purple-100 text-purple-600 flex items-center justify-center"></div>
                <p className="font-medium text-slate-700">Create New Department</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => navigate('/admin/hod')}>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-rose-100 text-rose-600 flex items-center justify-center"></div>
                <p className="font-medium text-slate-700">Manage HOD Assignments</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> System Information</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Application</p>
                <p className="text-sm font-medium text-slate-800">EduFlow - Examination Portal</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Version</p>
                <p className="text-sm font-medium text-slate-800">v1.0.0</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Database Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-sm font-medium text-emerald-600">Connected to Backend API</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Academic Year</p>
                <p className="text-sm font-medium text-slate-800">2023 - 2024</p>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}