import api from './api';
import type { StudentPayload } from '@/types/student';

export const studentApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const { data } = await api.get('/students', { params });
    return data.data ?? data;
  },

  getByDivision: async (divisionId: string) => {
    const { data } = await api.get('/students', { params: { divisionId } });
    return data.data ?? data;
  },

  getBySubjectAndDivision: async (subjectId: string, divisionId: string) => {
    const { data } = await api.get('/students', { params: { subjectId, divisionId } });
    return data.data ?? data;
  },

  create: async (payload: StudentPayload) => {
    const { data } = await api.post('/students', payload);
    return data.data ?? data;
  },

  update: async (id: string, payload: Partial<StudentPayload>) => {
    const { data } = await api.put(`/students/${id}`, payload);
    return data.data ?? data;
  },

  remove: async (id: string) => {
    await api.delete(`/students/${id}`);
  },
};