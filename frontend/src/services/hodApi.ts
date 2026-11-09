import api from './api';
import type {
  HodDashboardStats,
  HodDepartment,
  HodTeacher,
  HodStudent,
  HodSubject,
  HodTeacherAssignment,
  HodCreateAssignmentPayload,
  HodMarksSubmission,
  HodAttendanceRecord,
} from '@/types/hod';

export const hodApi = {
  getDashboardStats: async (): Promise<HodDashboardStats> => {
    const { data } = await api.get('/hod/stats');
    return data.data ?? data;
  },

  getDepartment: async (): Promise<HodDepartment> => {
    const { data } = await api.get('/departments/current');
    return data.data ?? data;
  },

  getTeachers: async (): Promise<HodTeacher[]> => {
    const { data } = await api.get('/teachers');
    return data.data ?? data;
  },

  getStudents: async (division?: string): Promise<HodStudent[]> => {
    const { data } = await api.get('/students', { params: { division } });
    return data.data ?? data;
  },

  getSubjects: async (): Promise<HodSubject[]> => {
    const { data } = await api.get('/subjects');
    return data.data ?? data;
  },

  getAssignments: async (): Promise<HodTeacherAssignment[]> => {
    const { data } = await api.get('/teacher-assignments');
    return data.data ?? data;
  },

  createAssignment: async (payload: HodCreateAssignmentPayload): Promise<HodTeacherAssignment> => {
    const { data } = await api.post('/teacher-assignments', payload);
    return data.data ?? data;
  },

  getMarksSubmissions: async (): Promise<HodMarksSubmission[]> => {
    const { data } = await api.get('/hod/marks-submissions');
    return data.data ?? data;
  },

  approveMarks: async (submissionId: string): Promise<void> => {
    await api.post(`/hod/marks-submissions/${submissionId}/approve`);
  },

  rejectMarks: async (submissionId: string, reason: string): Promise<void> => {
    await api.post(`/hod/marks-submissions/${submissionId}/reject`, { reason });
  },

  getAttendanceRecords: async (subject?: string, division?: string): Promise<HodAttendanceRecord[]> => {
    const { data } = await api.get('/hod/attendance', { params: { subject, division } });
    return data.data ?? data;
  },
};

// Re-export types so any existing imports from @/services/hodApi continue to work seamlessly
export * from '@/types/hod';
