import api from './api';

export const adminApi = {
  // DEPARTMENTS 
  getDepartments: async () => {
    const { data } = await api.get('/departments');
    return data;
  },
  createDepartment: async (payload: { code: string; name: string }) => {
    // Backend: POST /api/admin/departments
    const { data } = await api.post('/admin/departments', payload);
    return data;
  },

  

  //  USERS / TEACHERS 
  getUsers: async () => {
    const { data } = await api.get('/users');
    return data.content || data; // Spring Boot pagination support
  },
  createTeacher: async (payload: { name: string; email: string; password?: string; departmentId?: string; role?: string }) => {
    const { data } = await api.post('/admin/teachers', payload);
    return data;
  },

  // HOD ASSIGNMENT
  assignHod: async (departmentId: string, teacherId: string) => {
    // Backend: POST /api/admin/departments/{departmentId}/hod
    const { data } = await api.post(`/admin/departments/${departmentId}/hod`, { teacherId });
    return data;
  },
};