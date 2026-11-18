import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Input, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
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
  const [role, setRole] = useState<UserRole>('ADMIN');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      setLoading(false);
      return;
    }
    const savedUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
    
    const mockUsers: AuthUser[] = [
      { id: 'u1', name: 'Aryan Admin', email: 'admin@eduflow.com', role: 'ADMIN' },
      { id: 'u2', name: 'Dr. Priya Sharma', email: 'priya.hod@eduflow.com', role: 'HOD' },
      { id: 'u4', name: 'Prof. Rajesh Kumar', email: 'rajesh@eduflow.com', role: 'TEACHER' },
    ];

    const allUsers = [...mockUsers, ...savedUsers];
    const foundUser = allUsers.find(
      (u: any) => u.email === email.trim() && u.role === role
    );

    if (!foundUser) {
      const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      
      const demoUser: AuthUser = {
        id: crypto.randomUUID(),
        name: name || 'User',
        email: email.trim(),
        role: role,
      };

      login(demoUser, 'mock-token-123'); // Mock token
      navigate(dashboardPaths[role], { replace: true });
      setLoading(false);
      return;
    }

    login(foundUser, 'mock-token-123');
    navigate(dashboardPaths[foundUser.role], { replace: true });
    setLoading(false);
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
            <Input 
              label="Email" 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
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

            <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
              <strong>Demo Login:</strong>If any model you can login.
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}