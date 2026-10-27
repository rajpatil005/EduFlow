export type MarksStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'LOCKED';

export interface MarksEntryRow {
  studentId: string;
  examSeatNo: string;      
  studentRollNo: string;
  studentName: string;
  ut1: number;           
  ut2: number;             
  pa: number;           
  pb: number;             
  pc?: number;             
  pd?: number;            
  pf?: number;            
  status: MarksStatus;
}

export interface BulkMarksPayload {
  programmeId: string;
  semesterId: string;
  divisionId: string;
  subjectId: string;
  entries: {
    studentId: string;
    examSeatNo: string;     
    ut1: number;
    ut2: number;
    pa: number;
    pb: number;
    pc?: number;
    pd?: number;
    pf?: number;
  }[];
}