export type AttendanceStatus = 'P' | 'A' | 'L';

export interface Attendance {
  id: string;
  studentId: string;
  studentName?: string;
  studentRollNo?: string;
  subjectId: string;
  divisionId: string;
  date: string;
  status: AttendanceStatus;
  teacherAssignmentId: string;
}

export interface AttendancePayload {
  subjectId: string;
  divisionId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus }[];
}