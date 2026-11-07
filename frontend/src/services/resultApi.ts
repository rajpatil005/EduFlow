import api from './api';
import type { SubjectReport } from '@/types/result';

export const resultApi = {
  getSubjectReport: async (subjectId: string, divisionId: string): Promise<SubjectReport> => {
    const { data } = await api.get('/reports/subject', {
      params: { subjectId, divisionId },
    });
    return data.data ?? data;
  },
};