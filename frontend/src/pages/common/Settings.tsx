import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/components/ui/Toast';
import {
  userApi,
  NotificationPreferences,
  ChangePasswordPayload,
} from '@/services/userApi';

export default function Settings() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification Preferences State
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    marksAlerts: true,
    attendanceAlerts: true,
    announcements: true,
    emailNotifications: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const notifData = await userApi.getNotificationPreferences();
        setPrefs(notifData);
      } catch {
        showToast('Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordForm.currentPassword) {
      showToast('Please enter your current password', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setUpdatingPassword(true);
    try {
      const payload: ChangePasswordPayload = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      };
      await userApi.changePassword(payload);
      showToast('Password updated successfully!', 'success');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch {
      showToast('Failed to update password', 'error');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handlePrefsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrefs(true);
    try {
      await userApi.updateNotificationPreferences(prefs);
      showToast('Notification preferences saved!', 'success');
    } catch {
      showToast('Failed to save notification preferences', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading settings..." />;
  }

  return (
    <div>
      <PageHeader
        title="Account Settings"
        subtitle="Manage your authentication security credentials and academic notification preferences"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Change Password & Security */}
        <Card>
          <CardBody>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-base font-bold text-slate-900">Change Password</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure your account is protected with a secure and unique password.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password *"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="Enter current password"
                required
              />

              <Input
                label="New Password *"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="Minimum 6 characters"
                required
              />

              <Input
                label="Confirm New Password *"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Re-enter new password"
                required
              />

              <p className="text-xs text-slate-400">
                Password must be at least 6 characters and should not match common phrases.
              </p>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" loading={updatingPassword}>
                  Update Password
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Card 2: Academic Notification Preferences */}
        <Card>
          <CardBody>
            <div className="border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-base font-bold text-slate-900">
                Academic & System Notifications
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the academic alerts you want to receive across the EduFlow system.
              </p>
            </div>

            <form onSubmit={handlePrefsSubmit} className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={prefs.marksAlerts}
                    onChange={(e) =>
                      setPrefs({ ...prefs, marksAlerts: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">
                      Marks Submission & Approval Alerts
                    </span>
                    <span className="text-xs text-slate-500">
                      Receive notifications when teachers submit marks or HOD approves/rejects them.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={prefs.attendanceAlerts}
                    onChange={(e) =>
                      setPrefs({ ...prefs, attendanceAlerts: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">
                      Attendance Warnings & Threshold Alerts
                    </span>
                    <span className="text-xs text-slate-500">
                      Notifications when student attendance falls below the minimum required 75%.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={prefs.announcements}
                    onChange={(e) =>
                      setPrefs({ ...prefs, announcements: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">
                      Department & Academic Circulars
                    </span>
                    <span className="text-xs text-slate-500">
                      Institutional announcements, exam schedules, and curriculum notices.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={prefs.emailNotifications}
                    onChange={(e) =>
                      setPrefs({ ...prefs, emailNotifications: e.target.checked })
                    }
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">
                      Send Copy to Registered Email
                    </span>
                    <span className="text-xs text-slate-500">
                      Also deliver high-priority academic notifications directly to your email inbox.
                    </span>
                  </div>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" loading={savingPrefs}>
                  Save Preferences
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

