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