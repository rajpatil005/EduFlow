import api from './api';

export const assessmentApi = {
  getComponentsBySubject: async (subjectId: string) => {
    const { data } = await api.get('/assessments/components', {
      params: { subjectId },
    });
    return data.data ?? data;
  },

  getAssessments: async (subjectId: string, divisionId: string) => {
    const { data } = await api.get('/assessments', {
      params: { subjectId, divisionId },
    });
    return data.data ?? data;
  },
};