export const mockProgrammes = [
  { id: 'p1', name: 'BSC-CS', code: 'BSC-CS', departmentId: 'dept1' },
  { id: 'p2', name: 'BCA', code: 'BCA', departmentId: 'dept1' },
  { id: 'p3', name: 'MSC-CS', code: 'MSC-CS', departmentId: 'dept1' },
];

export const mockSemesters = [
  { id: 'sem1', number: 1, programmeId: 'p1' },
  { id: 'sem2', number: 2, programmeId: 'p1' },
  { id: 'sem3', number: 3, programmeId: 'p1' },
  { id: 'sem4', number: 4, programmeId: 'p1' },
  { id: 'sem5', number: 1, programmeId: 'p2' },
  { id: 'sem6', number: 2, programmeId: 'p2' },
];

export const mockDivisions = [
  { id: 'd1', name: 'A', semesterId: 'sem1', strength: 45 },
  { id: 'd2', name: 'B', semesterId: 'sem1', strength: 42 },
  { id: 'd3', name: 'C', semesterId: 'sem1', strength: 40 },
];

export const mockSubjectsData = [
  { id: 's1', name: 'DBMS', code: 'CS301', semesterId: 'sem1', credits: 4 },
  { id: 's2', name: 'AI', code: 'CS302', semesterId: 'sem1', credits: 4 },
  { id: 's3', name: 'Python', code: 'CS303', semesterId: 'sem1', credits: 3 },
];

export const mockStudents = [
  { id: '1', rollNo: '101', fullName: 'Aarav Sharma', attendancePercent: 92, marksStatus: 'DRAFT' },
  { id: '2', rollNo: '102', fullName: 'Diya Patel', attendancePercent: 88, marksStatus: 'SUBMITTED' },
  { id: '3', rollNo: '103', fullName: 'Rohan Verma', attendancePercent: 95, marksStatus: 'VERIFIED' },
  { id: '4', rollNo: '104', fullName: 'Priya Singh', attendancePercent: 78, marksStatus: 'DRAFT' },
  { id: '5', rollNo: '105', fullName: 'Karan Mehta', attendancePercent: 82, marksStatus: 'SUBMITTED' },
];

export const mockComponents = [
  // DBMS (s1)
  { id: 'c1', subjectId: 's1', name: 'UT1', maxMarks: 20, weightage: 10, type: 'UNIT_TEST' },
  { id: 'c2', subjectId: 's1', name: 'UT2', maxMarks: 20, weightage: 10, type: 'UNIT_TEST' },
  { id: 'c3', subjectId: 's1', name: 'CIE', maxMarks: 30, weightage: 40, type: 'PRACTICAL' }, // CIE add kela
  { id: 'c4', subjectId: 's1', name: 'FINAL', maxMarks: 50, weightage: 40, type: 'FINAL' },

  // AI (s2)
  { id: 'c5', subjectId: 's2', name: 'UT1', maxMarks: 30, weightage: 20, type: 'UNIT_TEST' },
  { id: 'c6', subjectId: 's2', name: 'UT2', maxMarks: 30, weightage: 20, type: 'UNIT_TEST' },
  { id: 'c7', subjectId: 's2', name: 'CIE', maxMarks: 50, weightage: 60, type: 'PRACTICAL' },
];


export const mockResults = [
  {
    studentId: '1',
    examSeatNo: 'E2025001',
    studentRollNo: '101',
    studentName: 'Aarav Sharma',
    divisionId: 'd1',
    divisionName: 'A',
    subjectId: 's1',
    subjectName: 'DBMS',
    utConvertedTo30: 25.5,
    utPercent60: 15.3,
    cieMarksOut30: 23,
    ciePercent40: 9.2,
    totalCieMarks: 24.5,
    finalEvaluation: 45,
    totalFinal: 69.5,
  },
  {
    studentId: '2',
    examSeatNo: 'E2025002',
    studentRollNo: '102',
    studentName: 'Diya Patel',
    divisionId: 'd1',
    divisionName: 'A',
    subjectId: 's1',
    subjectName: 'DBMS',
    utConvertedTo30: 21.75,
    utPercent60: 13.05,
    cieMarksOut30: 19,
    ciePercent40: 7.6,
    totalCieMarks: 20.65,
    finalEvaluation: 40,
    totalFinal: 60.65,
  },
  {
    studentId: '3',
    examSeatNo: 'E2025003',
    studentRollNo: '103',
    studentName: 'Rohan Verma',
    divisionId: 'd1',
    divisionName: 'A',
    subjectId: 's1',
    subjectName: 'DBMS',
    utConvertedTo30: 27.75,
    utPercent60: 16.65,
    cieMarksOut30: 27,
    ciePercent40: 10.8,
    totalCieMarks: 27.45,
    finalEvaluation: 48,
    totalFinal: 75.45,
  },
  {
    studentId: '4',
    examSeatNo: 'E2025011',
    studentRollNo: '201',
    studentName: 'Priya Singh',
    divisionId: 'd2',
    divisionName: 'B',
    subjectId: 's1',
    subjectName: 'DBMS',
    utConvertedTo30: 19.5,
    utPercent60: 11.7,
    cieMarksOut30: 16,
    ciePercent40: 6.4,
    totalCieMarks: 18.1,
    finalEvaluation: 35,
    totalFinal: 53.1,
  },
  {
    studentId: '5',
    examSeatNo: 'E2025012',
    studentRollNo: '202',
    studentName: 'Karan Mehta',
    divisionId: 'd2',
    divisionName: 'B',
    subjectId: 's1',
    subjectName: 'DBMS',
    utConvertedTo30: 24,
    utPercent60: 14.4,
    cieMarksOut30: 24,
    ciePercent40: 9.6,
    totalCieMarks: 24,
    finalEvaluation: 42,
    totalFinal: 66,
  },
];

// --- HOD Module Mock Data ---
import type {
  HodDashboardStats,
  HodDepartment,
  HodTeacher,
  HodStudent,
  HodSubject,
  HodTeacherAssignment,
  HodMarksSubmission,
  HodAttendanceRecord,
} from '@/types/hod';

export const mockHodStats: HodDashboardStats = {
  totalTeachers: 12,
  totalStudents: 180,
  totalSubjects: 8,
  pendingApprovals: 3,
  avgAttendance: 84.5,
};

export const mockHodDepartment: HodDepartment = {
  id: 'dept-1',
  name: 'Computer Science & Engineering',
  code: 'CSE',
  hodName: 'Dr. Rajesh Patil',
  hodEmail: 'rajesh.patil@eduflow.local',
  programmes: ['B.Tech CSE', 'BCA', 'M.Tech CSE'],
  semesters: [1, 2, 3, 4, 5, 6, 7, 8],
  divisions: ['A', 'B'],
  totalFaculty: 12,
  totalStudents: 180,
  totalSubjects: 8,
};

export const mockHodTeachers: HodTeacher[] = [
  { id: 't1', name: 'Dr. Rajesh Patil', employeeId: 'EMP001', email: 'rajesh.patil@eduflow.local', designation: 'Professor & HOD', assignedSubjects: ['DBMS', 'Data Structures'], workloadHours: 12, status: 'ACTIVE' },
  { id: 't2', name: 'Prof. Sneha Deshmukh', employeeId: 'EMP002', email: 'sneha.deshmukh@eduflow.local', designation: 'Associate Professor', assignedSubjects: ['AI', 'Machine Learning'], workloadHours: 14, status: 'ACTIVE' },
  { id: 't3', name: 'Prof. Amit Kulkarni', employeeId: 'EMP003', email: 'amit.kulkarni@eduflow.local', designation: 'Assistant Professor', assignedSubjects: ['Computer Networks', 'Cloud Computing'], workloadHours: 16, status: 'ACTIVE' },
  { id: 't4', name: 'Prof. Priya Shah', employeeId: 'EMP004', email: 'priya.shah@eduflow.local', designation: 'Assistant Professor', assignedSubjects: ['Operating Systems'], workloadHours: 10, status: 'ACTIVE' },
];

export const mockHodStudents: HodStudent[] = [
  { id: 's1', rollNo: '101', fullName: 'Aarav Sharma', prn: 'PRN2024001', email: 'aarav.sharma@eduflow.local', division: 'A', semester: 5, attendancePercent: 92, marksStatus: 'SUBMITTED' },
  { id: 's2', rollNo: '102', fullName: 'Diya Patel', prn: 'PRN2024002', email: 'diya.patel@eduflow.local', division: 'A', semester: 5, attendancePercent: 88, marksStatus: 'SUBMITTED' },
  { id: 's3', rollNo: '103', fullName: 'Rohan Verma', prn: 'PRN2024003', email: 'rohan.verma@eduflow.local', division: 'A', semester: 5, attendancePercent: 95, marksStatus: 'VERIFIED' },
  { id: 's4', rollNo: '104', fullName: 'Priya Singh', prn: 'PRN2024004', email: 'priya.singh@eduflow.local', division: 'B', semester: 5, attendancePercent: 78, marksStatus: 'DRAFT' },
  { id: 's5', rollNo: '105', fullName: 'Karan Mehta', prn: 'PRN2024005', email: 'karan.mehta@eduflow.local', division: 'B', semester: 5, attendancePercent: 82, marksStatus: 'SUBMITTED' },
];

export const mockHodSubjects: HodSubject[] = [
  { id: 'sub1', name: 'Database Management Systems', code: 'CS301', semester: 5, programme: 'B.Tech CSE', credits: 4, assignedTeacher: 'Dr. Rajesh Patil', studentCount: 45 },
  { id: 'sub2', name: 'Artificial Intelligence', code: 'CS302', semester: 5, programme: 'B.Tech CSE', credits: 4, assignedTeacher: 'Prof. Sneha Deshmukh', studentCount: 45 },
  { id: 'sub3', name: 'Computer Networks', code: 'CS303', semester: 5, programme: 'B.Tech CSE', credits: 3, assignedTeacher: 'Prof. Amit Kulkarni', studentCount: 45 },
  { id: 'sub4', name: 'Operating Systems', code: 'CS304', semester: 5, programme: 'B.Tech CSE', credits: 4, assignedTeacher: 'Prof. Priya Shah', studentCount: 42 },
];

export const mockHodAssignments: HodTeacherAssignment[] = [
  { id: 'as1', teacherId: 't1', teacherName: 'Dr. Rajesh Patil', employeeId: 'EMP001', subjectId: 'sub1', subjectName: 'DBMS', subjectCode: 'CS301', division: 'A', semester: 5, academicYear: '2026-2027' },
  { id: 'as2', teacherId: 't2', teacherName: 'Prof. Sneha Deshmukh', employeeId: 'EMP002', subjectId: 'sub2', subjectName: 'AI', subjectCode: 'CS302', division: 'A', semester: 5, academicYear: '2026-2027' },
  { id: 'as3', teacherId: 't3', teacherName: 'Prof. Amit Kulkarni', employeeId: 'EMP003', subjectId: 'sub3', subjectName: 'Computer Networks', subjectCode: 'CS303', division: 'B', semester: 5, academicYear: '2026-2027' },
];

export const mockHodSubmissions: HodMarksSubmission[] = [
  {
    id: 'ms1',
    assessmentName: 'Unit Test 1 (UT1)',
    subjectName: 'DBMS',
    subjectCode: 'CS301',
    teacherName: 'Dr. Rajesh Patil',
    semester: 5,
    division: 'A',
    submittedDate: '2026-11-05',
    status: 'PENDING',
    maxMarks: 20,
    studentMarks: [
      { studentId: 's1', rollNo: '101', studentName: 'Aarav Sharma', marksObtained: 18 },
      { studentId: 's2', rollNo: '102', studentName: 'Diya Patel', marksObtained: 16 },
      { studentId: 's3', rollNo: '103', studentName: 'Rohan Verma', marksObtained: 19 },
    ],
  },
  {
    id: 'ms2',
    assessmentName: 'Unit Test 1 (UT1)',
    subjectName: 'AI',
    subjectCode: 'CS302',
    teacherName: 'Prof. Sneha Deshmukh',
    semester: 5,
    division: 'A',
    submittedDate: '2026-11-04',
    status: 'APPROVED',
    maxMarks: 20,
    studentMarks: [
      { studentId: 's1', rollNo: '101', studentName: 'Aarav Sharma', marksObtained: 17 },
      { studentId: 's2', rollNo: '102', studentName: 'Diya Patel', marksObtained: 15 },
    ],
  },
  {
    id: 'ms3',
    assessmentName: 'Unit Test 2 (UT2)',
    subjectName: 'Computer Networks',
    subjectCode: 'CS303',
    teacherName: 'Prof. Amit Kulkarni',
    semester: 5,
    division: 'B',
    submittedDate: '2026-11-03',
    status: 'REJECTED',
    rejectionReason: 'Marks appear inconsistent with attendance records. Please review and resubmit.',
    maxMarks: 20,
    studentMarks: [
      { studentId: 's4', rollNo: '104', studentName: 'Priya Singh', marksObtained: 14 },
      { studentId: 's5', rollNo: '105', studentName: 'Karan Mehta', marksObtained: 11 },
    ],
  },
];

export const mockHodAttendance: HodAttendanceRecord[] = [
  { id: 'att1', rollNo: '101', studentName: 'Aarav Sharma', subject: 'DBMS', division: 'A', conductedClasses: 36, attendedClasses: 33, attendancePercent: 91.6, status: 'GOOD' },
  { id: 'att2', rollNo: '102', studentName: 'Diya Patel', subject: 'DBMS', division: 'A', conductedClasses: 36, attendedClasses: 32, attendancePercent: 88.8, status: 'GOOD' },
  { id: 'att3', rollNo: '103', studentName: 'Rohan Verma', subject: 'DBMS', division: 'A', conductedClasses: 36, attendedClasses: 34, attendancePercent: 94.4, status: 'GOOD' },
  { id: 'att4', rollNo: '104', studentName: 'Priya Singh', subject: 'DBMS', division: 'B', conductedClasses: 36, attendedClasses: 23, attendancePercent: 63.8, status: 'CRITICAL' },
  { id: 'att5', rollNo: '105', studentName: 'Karan Mehta', subject: 'DBMS', division: 'B', conductedClasses: 36, attendedClasses: 28, attendancePercent: 77.7, status: 'AVERAGE' },
];
