import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/hooks/useAuth';

const PROFILE_EXTRAS_KEY = 'eduflow_profile_extras';

interface ProfileExtras {
  displayName: string;
  phone: string;
  location: string;
}

function getStoredExtras(): ProfileExtras {
  try {
    const raw = localStorage.getItem(PROFILE_EXTRAS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        displayName: parsed.displayName || '',
        phone: parsed.phone || '',
        location: parsed.location || '',
      };
    }
  } catch { /* ignore */ }
  return { displayName: '', phone: '', location: '' };
}

function saveExtras(extras: ProfileExtras) {
  localStorage.setItem(PROFILE_EXTRAS_KEY, JSON.stringify(extras));
}

const ROLE_CONFIG: Record<string, {
  badgeColor: 'info' | 'warning' | 'success' | 'default';
  label: string;
  locationLabel: string;
  locationPlaceholder: string;
}> = {
  HOD: {
    badgeColor: 'warning',
    label: 'Head of Department',
    locationLabel: 'Office / Cabin Location',
    locationPlaceholder: 'e.g. Cabin 101, CSE Block',
  },
  TEACHER: {
    badgeColor: 'info',
    label: 'Faculty Member',
    locationLabel: 'Office / Cabin Location',
    locationPlaceholder: 'e.g. Cabin 304, CSE Block',
  },
  ADMIN: {
    badgeColor: 'default',
    label: 'System Administrator',
    locationLabel: 'Office Location',
    locationPlaceholder: 'e.g. Admin Block, Room 001',
  },
  STUDENT: {
    badgeColor: 'success',
    label: 'Student',
    locationLabel: 'Division / Section',
    locationPlaceholder: 'e.g. Division A, Room 201',
  },
};

export default function Profile() {
  const { user, login } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [extras, setExtras] = useState<ProfileExtras>(getStoredExtras);
  const [form, setForm] = useState<ProfileExtras>({
    displayName: getStoredExtras().displayName || '',
    phone: getStoredExtras().phone || '',
    location: getStoredExtras().location || '',
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        You are not logged in. Please{' '}
        <a href="/login" className="ml-1 text-indigo-600 underline">sign in</a>.
      </div>
    );
  }

  const role = user.role || 'TEACHER';
  const config = ROLE_CONFIG[role] || ROLE_CONFIG['TEACHER'];

  // Use saved display name if set, otherwise fall back to auth name
  const displayName = (extras.displayName || user.name || '').trim() || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || '?';

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      saveExtras(form);
      setExtras({ ...form });
      // If user changed their display name, update auth context too
      if (form.displayName && form.displayName.trim()) {
        login({ ...user, name: form.displayName.trim() });
      }
      showToast('Profile saved successfully!', 'success');
      setSaving(false);
    }, 400);
  };

  const handleReset = () => {
    setForm({ ...extras });
  };

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="View your account details and update contact information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Identity card ── */}
        <div>
          <Card>
            <CardBody className="text-center pt-7 pb-6">
              {/* Avatar */}
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg mb-4 select-none">
                {initials}
              </div>

              <h2 className="text-lg font-bold text-slate-900 break-words">{displayName}</h2>
              <p className="text-xs text-slate-500 mt-0.5 break-all">{user.email || '—'}</p>

              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <Badge variant={config.badgeColor}>{role}</Badge>
                <Badge variant="success">Active</Badge>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-3 text-left text-sm">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Role</p>
                  <p className="text-slate-700 mt-0.5">{config.label}</p>
                </div>
                {extras.location && (
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                      {config.locationLabel}
                    </p>
                    <p className="text-slate-700 mt-0.5">{extras.location}</p>
                  </div>
                )}
                {extras.phone && (
                  <div>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Phone</p>
                    <p className="text-slate-700 mt-0.5">{extras.phone}</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* ── Right: Account info + editable form ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Account Information */}
          <Card>
            <CardBody>
              <div className="border-b border-slate-100 pb-3 mb-5">
                <h3 className="text-base font-bold text-slate-900">Account Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Managed by your institution's administrator. Contact Admin to make changes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Full Name</p>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-medium text-slate-800">
                    {displayName}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">Role</p>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 flex items-center gap-2">
                    <Badge variant={config.badgeColor}>{role}</Badge>
                    <span className="text-slate-500">{config.label}</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1.5">
                    Institutional Email
                  </p>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-700">
                    {user.email || '—'}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Editable: Contact & Location */}
          <Card>
            <CardBody>
              <div className="border-b border-slate-100 pb-3 mb-5">
                <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details and display name visible to colleagues and department administrators.
                </p>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    value={form.displayName}
                    onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                  <Input
                    label="Contact Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label={config.locationLabel}
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder={config.locationPlaceholder}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                  <Button type="submit" loading={saving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

        </div>
      </div>
    </div>
  );
}
