import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Input,
  Button,
} from '../../components/ui';
import {useAuth} from '../../hooks/useAuth';
import type {UserRole} from '../../types/auth';

const dashboardPaths: Record<UserRole, string> = {
  ADMIN: '/admin/dashboard',
  HOD: '/hod/dashboard',
  TEACHER: '/teacher/dashboard',
  STUDENT: '/student/dashboard',
};

export default function Login() {
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [role, setRole] = useState<UserRole>('TEACHER');
 const [error, setError] = useState('');

 const { login } = useAuth();
 const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    const name =
      email.split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase()) || 'User';

    login({
      id: crypto.randomUUID(),
      name,
      email: email.trim(),
      role,
    });

    navigate(dashboardPaths[role], { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
      <Card className="w-full max-w-md border border-slate-200 shadow-xl">
        <CardHeader>
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-md">
              E
            </div>
          </div>

          <CardTitle>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome to EduFlow
              </h1>
              <p className="mt-2 text-sm font-normal text-slate-500">
                Sign in to access your dashboard
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address" type="email"placeholder="you@example.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password" type="password" placeholder="Enter your password" value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div>
              <label
                htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700"
              >
                Login As
              </label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="TEACHER">Teacher</option>
                <option value="HOD">Head of Department (HOD)</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-center text-xs text-slate-400">
              EduFlow Management System
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}