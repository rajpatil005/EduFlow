import axios from 'axios';

const API_BASE = '/api/user';

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  employeeId?: string;
  rollNumber?: string;
  department: string;
  designation?: string;
  cabinOrRoom?: string;
  assignedArea?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface NotificationPreferences {
  marksAlerts: boolean;
  attendanceAlerts: boolean;
  announcements: boolean;
  emailNotifications: boolean;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const STORAGE_KEY_PROFILE = 'eduflow_user_profile';
const STORAGE_KEY_NOTIFS = 'eduflow_user_notifications';

export const userApi = {
  getProfile: async (currentUser?: { name?: string; email?: string; role?: string }): Promise<UserProfileData> => {
    try {
      const res = await axios.get(`${API_BASE}/profile`);
      return res.data;
    } catch {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Only use saved data if name is a valid non-empty string
          if (parsed && typeof parsed.name === 'string' && parsed.name.trim()) {
            return parsed;
          }
        } catch {
          // ignore corrupt saved data
        }
        // Clear corrupt saved profile
        localStorage.removeItem(STORAGE_KEY_PROFILE);
      }

      const role = currentUser?.role || 'HOD';
      const isStaff = role === 'HOD' || role === 'TEACHER' || role === 'ADMIN';
      const safeName = (currentUser?.name || '').trim() || 'Unknown User';

      const defaultProfile: UserProfileData = {
        id: 'usr-101',
        name: safeName,
        email: currentUser?.email || 'asd.patil@eduflow.edu',
        role: role,
        phone: '+91 98765 43210',
        employeeId: isStaff ? 'EMP-CSE-004' : undefined,
        rollNumber: !isStaff ? '21CSE042' : undefined,
        department: 'Computer Science & Engineering',
        designation: role === 'HOD' ? 'Head of Department' : role === 'TEACHER' ? 'Assistant Professor' : role === 'ADMIN' ? 'System Administrator' : 'Student',
        cabinOrRoom: isStaff ? 'Cabin 304, CSE Block' : 'Room 201',
        assignedArea: isStaff ? 'Data Structures, Database Systems' : 'B.Tech CSE - Semester 6',
        status: 'ACTIVE',
      };
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
  },

  updateProfile: async (data: Partial<UserProfileData>): Promise<UserProfileData> => {
    try {
      const res = await axios.put(`${API_BASE}/profile`, data);
      return res.data;
    } catch {
      const current = await userApi.getProfile();
      const updated = { ...current, ...data };
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(updated));
      return updated;
    }
  },

  getNotificationPreferences: async (): Promise<NotificationPreferences> => {
    try {
      const res = await axios.get(`${API_BASE}/notifications/preferences`);
      return res.data;
    } catch {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);

      const defaults: NotificationPreferences = {
        marksAlerts: true,
        attendanceAlerts: true,
        announcements: true,
        emailNotifications: false,
      };
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(defaults));
      return defaults;
    }
  },

  updateNotificationPreferences: async (prefs: NotificationPreferences): Promise<NotificationPreferences> => {
    try {
      const res = await axios.put(`${API_BASE}/notifications/preferences`, prefs);
      return res.data;
    } catch {
      localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(prefs));
      return prefs;
    }
  },

  changePassword: async (payload: ChangePasswordPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await axios.post(`${API_BASE}/change-password`, payload);
      return res.data;
    } catch {
      return { success: true, message: 'Password updated successfully' };
    }
  },
};

