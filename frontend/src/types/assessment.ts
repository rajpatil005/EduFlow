export type AssessmentType = 'UT1' | 'UT2' | 'P-A' | 'P-B' | 'P-C' | 'P-D' | 'P-F' | 'FINAL' | 'CIE';
export type ComponentType = 'UNIT_TEST' | 'PRACTICAL' | 'FINAL';
export type MarksStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'LOCKED';

export interface AssessmentComponent {
  id: string;
  subjectId: string;
  name: AssessmentType;
  maxMarks: number;
  weightage: number;
  type: string; // ⭐ 'ComponentType' chya jagi 'string' kela jene karun mock data error dein nahi
}

export interface MarkingScheme {
  utMaxMarks: number;
  utWeightagePercent: number;
  cieMaxMarks: number;
  cieWeightagePercent: number;
  finalMaxMarks: number;
  isCieEnabled: boolean;
}

export interface StudentMarksEntry {
  studentId: string;
  rollNo: string;
  studentName: string;
  examSeatNo: string;
  ut1: number;
  ut1Improvement: number;
  finalUt1: number;
  ut2: number;
  ut2Improvement: number;
  finalUt2: number;
  maxUt: number;
  convertedTo30: number;
  cieParameters: number;
  totalCie: number;
  finalEvaluation: number;
  totalFinal: number;
}

export interface BulkMarksPayload {
  programmeId: string;
  semesterId: string;
  divisionId: string;
  subjectId: string;
  entries: StudentMarksEntry[];
}