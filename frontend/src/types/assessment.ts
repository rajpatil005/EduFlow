// ... existing types ...

export interface MarkingScheme {
  utMaxMarks: number;        // Ex: 30
  utWeightagePercent: number; // Ex: 60 (For UT conversion)
  cieMaxMarks: number;       // Ex: 30
  cieWeightagePercent: number;// Ex: 40
  finalMaxMarks: number;     // Ex: 50
  isCieEnabled: boolean;     // Jar CIE nasel tar false
}

export interface StudentMarksEntry {
  studentId: string;
  rollNo: string;
  studentName: string;
  examSeatNo: string;

  // Proforma-C (Unit Test)
  ut1: number;
  ut1Improvement: number;
  finalUt1: number;
  ut2: number;
  ut2Improvement: number;
  finalUt2: number;
  maxUt: number;
  convertedTo30: number; // (Or converted to utMaxMarks)

  // Proforma-E (CIE)
  cieParameters: number;
  totalCie: number;

  // Final Evaluation
  finalEvaluation: number;
  totalFinal: number;
}