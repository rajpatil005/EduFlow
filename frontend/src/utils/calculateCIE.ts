import type { StudentMarksEntry, MarkingScheme } from '@/types/assessment';

export const calculateMarks = (
  student: StudentMarksEntry, 
  scheme: MarkingScheme
): StudentMarksEntry => {
  
  const ut1 = Number(student.ut1) || 0;
  const ut1Imp = Number(student.ut1Improvement) || 0;
  const ut2 = Number(student.ut2) || 0;
  const ut2Imp = Number(student.ut2Improvement) || 0;

  const finalUt1 = Math.max(ut1, ut1Imp);
  const finalUt2 = Math.max(ut2, ut2Imp);
  const maxUt = Math.max(finalUt1, finalUt2);
  
  const convertedToScheme = scheme.utMaxMarks > 0 
    ? (maxUt / scheme.utMaxMarks) * scheme.utMaxMarks 
    : 0;

  let utWeighted = 0;
  let cieWeighted = 0;
  let totalCie = 0;

  if (scheme.isCieEnabled) {
    utWeighted = convertedToScheme * (scheme.utWeightagePercent / 100);
    const cieParams = Number(student.cieParameters) || 0;
    cieWeighted = cieParams * (scheme.cieWeightagePercent / 100);
    totalCie = utWeighted + cieWeighted;
  } else {
    totalCie = convertedToScheme;
  }

  const finalEval = Number(student.finalEvaluation) || 0;
  const totalFinal = totalCie + finalEval;

  return {
    ...student,
    finalUt1,
    finalUt2,
    maxUt,
    convertedTo30: Number(convertedToScheme.toFixed(2)),
    totalCie: Number(totalCie.toFixed(2)),
    totalFinal: Number(totalFinal.toFixed(2)),
  };
};