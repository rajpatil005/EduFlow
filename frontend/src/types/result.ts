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
  components: ResultComponent[];
  totalObtained: number;
  totalMax: number;
  percentage: number;
  grade: string;
  
  utConvertedTo30: number;    
  utPercent60: number;      
  cieMarksOut30: number;      
  ciePercent40: number;     
  totalCieMarks: number;    
}