import api from './api';
import type { AttendancePayload } from '@/types/attendance';

export const attendanceApi = {
  getBySubjectAndDivision: async (subjectId: string, divisionId: string, date?: string) => {
    const { data } = await api.get('/attendance', {
      params: { subjectId, divisionId, date },
    });
    return data.data ?? data;
  },

  getStudents: async (subjectId: string, divisionId: string) => {
    const { data } = await api.get('/students', { params: { subjectId, divisionId } });
    return data.data ?? data;
  },

  mark: async (payload: AttendancePayload) => {
    const { data } = await api.post('/attendance', payload);
    return data.data ?? data;
  },
};