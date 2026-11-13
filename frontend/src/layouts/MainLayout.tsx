import { useAuth } from '@/hooks/useAuth';
import { HodLayout } from './HodLayout';
import { TeacherLayout } from './TeacherLayout';
import { AdminLayout } from './AdminLayout';

export const MainLayout = () => {
  const { user } = useAuth();

  if (user?.role === 'ADMIN') {
    return <AdminLayout />;
  }
  if (user?.role === 'TEACHER') {
    return <TeacherLayout />;
  }
  // Default to HodLayout for HOD and other roles
  return <HodLayout />;
};

