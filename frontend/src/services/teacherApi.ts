import api from './api';

export const teacherApi = {
  getAll: async (params?: Record<string, unknown>) => {
    const { data } = await api.get('/teachers', { params });
    return data.data ?? data;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/teachers/${id}`);
    return data.data ?? data;
  },

  getMyAssignments: async () => {
    const { data } = await api.get('/teachers/me/assignments');
    return data.data ?? data;
  },

  getMySubjects: async () => {
    const { data } = await api.get('/teachers/me/subjects');
    return data.data ?? data;
  },

  getDashboardStats: async () => {
    const { data } = await api.get('/teachers/me/stats');
    return data.data ?? data;
  },
};