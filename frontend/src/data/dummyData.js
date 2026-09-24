export const academicYears = ["2025-26", "2026-27"];

export const classes = ["FY CSE", "SY CSE", "TY CSE", "Final Year CSE"];

export const examinations = [
  "Unit Test",
  "Internal Assessment",
  "Semester Exam",
  "Final Exam",
];

export const subjects = [
  "Mathematics",
  "Computer Networks",
  "Database Management",
  "Operating Systems",
];

export const calculationPatterns = ["60 / 40", "50 / 50", "30 / 40 / 30"];

export const defaultComponents = [
  {
    id: 1,
    name: "Unit Test",
    key: "unitTest",
    maxMarks: 50,
    weightage: 60,
    included: true,
  },
  {
    id: 2,
    name: "CIE",
    key: "cie",
    maxMarks: 100,
    weightage: 40,
    included: true,
  },
  {
    id: 3,
    name: "External",
    key: "external",
    maxMarks: 100,
    weightage: 0,
    included: false,
  },
];

export const students = [
  {
    id: 1,
    rollNo: "101",
    name: "Aruna Patil",
    unitTest: 45,
    cie: 82,
    external: 76,
  },
  {
    id: 2,
    rollNo: "102",
    name: "Amit Sharma",
    unitTest: 42,
    cie: 76,
    external: 71,
  },
  {
    id: 3,
    rollNo: "103",
    name: "Sneha Patil",
    unitTest: 48,
    cie: 88,
    external: 84,
  },
  {
    id: 4,
    rollNo: "104",
    name: "Priya Joshi",
    unitTest: 39,
    cie: 74,
    external: 69,
  },
  {
    id: 5,
    rollNo: "105",
    name: "Akash More",
    unitTest: 44,
    cie: 79,
    external: 73,
  },
];
