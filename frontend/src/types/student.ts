export interface Student {
  id: string;
  userId?: string;
  rollNo: string;
  prn: string;
  fullName: string;
  email: string;
  divisionId: string;
  divisionName?: string;
  admissionYear?: string;
  isActive?: boolean;
}

export interface StudentPayload {
  fullName: string;
  email: string;
  password?: string;
  rollNo: string;
  prn: string;
  divisionId: string;
  admissionYear?: string;
}