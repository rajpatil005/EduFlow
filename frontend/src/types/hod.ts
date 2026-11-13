export interface HodDashboardStats {
  totalTeachers: number;
  totalStudents: number;
  totalSubjects: number;
  pendingApprovals: number;
  avgAttendance: number;
}

export interface HodDepartment {
  id: string;
  name: string;
  code: string;
  hodName: string;
  hodEmail: string;
  programmes: string[];
  semesters: number[];
  divisions: string[];
  totalFaculty: number;
  totalStudents: number;
  totalSubjects: number;
}

export interface HodTeacher {
  id: string;
  name: string;
  employeeId: string;
  email: string;
  designation: string;
  assignedSubjects: string[];
  workloadHours: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface HodStudent {
  id: string;
  rollNo: string;
  fullName: string;
  prn: string;
  email: string;
  division: string;
  semester: number;
  attendancePercent: number;
  marksStatus: 'PENDING' | 'DRAFT' | 'SUBMITTED' | 'VERIFIED';
}

export interface HodSubject {
  id: string;
  name: string;
  code: string;
  semester: number;
  programme: string;
  credits: number;
  assignedTeacher: string;
  studentCount: number;
}

export interface HodTeacherAssignment {
  id: string;
  teacherId: string;
  teacherName: string;
  employeeId: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  division: string;
  semester: number;
  academicYear: string;
}

export interface HodCreateAssignmentPayload {
  teacherId: string;
  subjectId: string;
  division: string;
  semester: number;
  academicYear: string;
}

export type MarksApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface HodMarksStudentRecord {
  studentId: string;
  rollNo: string;
  studentName: string;
  marksObtained: number;
}

export interface HodMarksSubmission {
  id: string;
  assessmentName: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  semester: number;
  division: string;
  submittedDate: string;
  status: MarksApprovalStatus;
  rejectionReason?: string;
  maxMarks: number;
  studentMarks: HodMarksStudentRecord[];
}

export interface HodAttendanceRecord {
  id: string;
  rollNo: string;
  studentName: string;
  subject: string;
  division: string;
  conductedClasses: number;
  attendedClasses: number;
  attendancePercent: number;
  status: 'GOOD' | 'AVERAGE' | 'CRITICAL';
}

