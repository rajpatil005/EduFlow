import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Input, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import type { UserRole, AuthUser } from '../../types/auth';

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
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }

    try {
      // 1. Backend la call kar
      const { data } = await api.post('/auth/login', { email, password });

      // 2. Backend response flat ahe (tumcha response pramane)
      const token = data.token; // "eyJhbGc..."
      const backendRole = data.role; // "ADMIN"

      // 3. Role mismatch check kar
      if (backendRole !== role) {
        setError(`Invalid role. This account is registered as ${backendRole}.`);
        setLoading(false);
        return;
      }

      // 4. User object banav (backend data madhun)
      const user: AuthUser = {
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
      };

      // 5. Context madhe save kar
      login(user, token);

      // 6. Redirect to specific dashboard
      navigate(dashboardPaths[role as UserRole], { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
      <Card className="w-full max-w-md border border-slate-200 shadow-xl">
        <CardHeader>
          <div className="mb-3 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-md">E</div>
          </div>
          <CardTitle>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-800">Welcome to EduFlow</h1>
              <p className="mt-2 text-sm font-normal text-slate-500">Sign in to access your dashboard</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Login As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm outline-none"
              >
                <option value="ADMIN">Admin</option>
                <option value="HOD">HOD</option>
                <option value="TEACHER">Teacher</option>
              </select>
            </div>
            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" loading={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}