import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PageHeader} from '@/components/layout/PageHeader';
import {Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import {Button} from '@/components/ui/Button';

interface Stats {
  subjects: number;
  students: number;
  pendingMarks: number;
  completedMarks: number;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  
  const [stats] = useState<Stats>({
    subjects: 4,
    students: 174,
    pendingMarks: 45,
    completedMarks: 129,
  });

  const cards = [
    { label: 'My Subjects', value: stats.subjects, color: 'from-indigo-500 to-purple-500',  link: '/teacher/subjects' },
    { label: 'Total Students', value: stats.students, color: 'from-emerald-500 to-teal-500',  link: '/teacher/students' },
    { label: 'Pending Marks', value: stats.pendingMarks, color: 'from-amber-500 to-orange-500',  link: '/teacher/marks-entry' },
    { label: 'Completed Marks', value: stats.completedMarks, color: 'from-blue-500 to-indigo-500',  link: '/teacher/reports' },
  ];

  return (
    <div>
      <PageHeader
        title="Teacher Dashboard"
        subtitle="Here's an overview of your teaching activities"
        actions={
          <Button onClick={() => navigate('/teacher/marks-entry')}>+ Enter New Marks</Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((c) => (
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
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle> Quick Actions</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            <div 
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" 
              onClick={() => navigate('/teacher/marks-entry')}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center"></div>
                <p className="font-medium text-slate-700">Enter Marks</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>

            <div 
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" 
              onClick={() => navigate('/teacher/attendance')}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center"></div>
                <p className="font-medium text-slate-700">Mark Attendance</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>

            <div 
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" 
              onClick={() => navigate('/teacher/reports')}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-amber-100 text-amber-600 flex items-center justify-center"></div>
                <p className="font-medium text-slate-700">Download Reports</p>
              </div>
              <span className="text-slate-400">→</span>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle> Recent Activity</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Marks submitted for DBMS</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Attendance marked for Division A</p>
                  <p className="text-xs text-slate-500">Yesterday</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5"></div>
                <div>
                  <p className="text-sm font-medium text-slate-800">New subject assigned: AI</p>
                  <p className="text-xs text-slate-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
    </div>
  );
}