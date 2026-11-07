export interface ResultComponent {
  name: string;
  marksObtained: number;
  maxMarks: number;
}

export interface StudentResult {
  studentId: string;
  examSeatNo: string;
  studentRollNo: string;
  studentName: string;
  divisionId: string;
  divisionName: string;
  subjectId: string;
  subjectName: string;
  utConvertedTo30: number;
  utPercent60: number;
  cieMarksOut30: number;
  ciePercent40: number;
  totalCieMarks: number;
  finalEvaluation: number;
  totalFinal: number;
}

export interface SubjectReport {
  subjectId: string;
  subjectName: string;
  students: StudentResult[];
}