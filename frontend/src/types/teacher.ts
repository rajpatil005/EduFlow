export interface Teacher {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  employeeId?: string;
  departmentId?: string;
  departmentName?: string;
  phone?: string;
  isActive?: boolean;
}

export interface TeacherAssignment {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode?: string;
  divisionId: string;
  divisionName: string;
  studentCount?: number;
  academicYearId?: string;
}