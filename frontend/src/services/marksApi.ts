import api from './api';
import type { BulkMarksPayload } from '@/types/assessment';

export const marksApi = {
  getBySubjectAndDivision: async (subjectId: string, divisionId: string) => {
    const { data } = await api.get('/marks', { params: { subjectId, divisionId } });
    return data.data ?? data;
  },

  saveDraft: async (payload: BulkMarksPayload) => {
    const { data } = await api.post('/marks/draft', payload);
    return data.data ?? data;
  },

  submit: async (payload: BulkMarksPayload) => {
    const { data } = await api.post('/marks/submit', payload);
    return data.data ?? data;
  },

  verify: async (assessmentIds: string[]) => {
    const { data } = await api.post('/marks/verify', { assessmentIds });
    return data.data ?? data;
  },

  lock: async (assessmentIds: string[]) => {
    const { data } = await api.post('/marks/lock', { assessmentIds });
    return data.data ?? data;
  },

  getPendingSubmissions: async (departmentId: string) => {
    const { data } = await api.get('/marks/pending', { params: { departmentId } });
    return data.data ?? data;
  },
};