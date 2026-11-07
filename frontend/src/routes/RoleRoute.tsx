import {Navigate, Outlet} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth';
import type {UserRole} from '../types/auth';

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

const getDashboardPath = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';

    case 'HOD':
      return '/hod/dashboard';

    case 'TEACHER':
      return '/teacher/dashboard';

    case 'STUDENT':
      return '/student/dashboard';

    default:
      return '/login';
  }
};

export const RoleRoute = ({
  allowedRoles,
}: RoleRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-600">
          Checking permissions...
        </p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={getDashboardPath(user.role)}
        replace
      />
    );
  }

  return <Outlet />;
};
