
import api from './api';

export interface TeacherSubject {
  id: number;
  code: string;
  name: string;
  semester: string;
  division: string;
  students: number;
}

export const subjectApi = {
  async getAll(): Promise<TeacherSubject[]> {
    const response = await api.get('/teacher/subjects');
    return response.data;
  },
};
