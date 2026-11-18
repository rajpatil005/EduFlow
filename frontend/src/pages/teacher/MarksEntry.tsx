import { useEffect, useState, useRef } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/components/ui/Toast';
import { calculateMarks } from '@/utils/calculateCIE';
import { 
  mockStudents, mockProgrammes, mockSemesters, mockDivisions, mockSubjectsData, mockComponents
} from '@/mock/mockData';
import type { StudentMarksEntry, AssessmentComponent, MarkingScheme } from '@/types/assessment';

export default function MarksEntry() {
  const { showToast } = useToast();
  const [programmeId, setProgrammeId] = useState('p1');
  const [semesterId, setSemesterId] = useState('sem1');
  const [divisionId, setDivisionId] = useState('d1');
  const [subjectId, setSubjectId] = useState('s1');
  const [activeTab, setActiveTab] = useState<'UT' | 'CIE'>('UT');

  const [components, setComponents] = useState<AssessmentComponent[]>([]);
  const [students, setStudents] = useState<StudentMarksEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  const availableSemesters = mockSemesters.filter((s) => s.programmeId === programmeId);
  const availableDivisions = mockDivisions.filter((d) => d.semesterId === semesterId);
  const availableSubjects = mockSubjectsData.filter((s) => s.semesterId === semesterId);

  useEffect(() => {
    const saved = localStorage.getItem(`assessment_components_${subjectId}`);
    if (saved) {
      setComponents(JSON.parse(saved));
    } else {
      const subsComponents = mockComponents.filter(c => c.subjectId === subjectId);
      setComponents(subsComponents.length > 0 ? subsComponents as AssessmentComponent[] : [
        { id: `c1-${subjectId}`, subjectId, name: 'UT1', maxMarks: 20, weightage: 10, type: 'UNIT_TEST' },
        { id: `c2-${subjectId}`, subjectId, name: 'UT2', maxMarks: 20, weightage: 10, type: 'UNIT_TEST' },
        { id: `c3-${subjectId}`, subjectId, name: 'CIE', maxMarks: 30, weightage: 40, type: 'PRACTICAL' },
        { id: `c4-${subjectId}`, subjectId, name: 'FINAL', maxMarks: 50, weightage: 40, type: 'FINAL' },
      ] as AssessmentComponent[]);
    }
  }, [subjectId]);

  useEffect(() => {
    if (!availableSemesters.find((s) => s.id === semesterId)) setSemesterId(availableSemesters[0]?.id ?? '');
  }, [programmeId]);

  useEffect(() => {
    if (!availableDivisions.find((d) => d.id === divisionId)) setDivisionId(availableDivisions[0]?.id ?? '');
    if (!availableSubjects.find((s) => s.id === subjectId)) setSubjectId(availableSubjects[0]?.id ?? '');
  }, [semesterId]);

  useEffect(() => {
    if (!programmeId || !semesterId || !divisionId || !subjectId) return;
    setLoading(true);
    setTimeout(() => {
      setStudents(
        mockStudents.map((s, i) => ({
          studentId: s.id,
          rollNo: s.rollNo,
          studentName: s.fullName,
          examSeatNo: `E20250${i + 1}${i + 10}`,
          ut1: 0, ut1Improvement: 0, finalUt1: 0,
          ut2: 0, ut2Improvement: 0, finalUt2: 0,
          maxUt: 0, convertedTo30: 0,
          cieParameters: 0, totalCie: 0,
          finalEvaluation: 0, totalFinal: 0,
        }))
      );
      setLoading(false);
    }, 300);
  }, [programmeId, semesterId, divisionId, subjectId]);

  const getScheme = (): MarkingScheme => {
    const utComp = components.find(c => c.name.includes('UT'));
    const cieComp = components.find(c => c.name === 'CIE' || c.name.includes('P-A'));
    const finalComp = components.find(c => c.name === 'FINAL');
    return { 
      utMaxMarks: utComp?.maxMarks || 20, 
      utWeightagePercent: utComp?.weightage || 60, 
      cieMaxMarks: cieComp?.maxMarks || 30, 
      cieWeightagePercent: cieComp?.weightage || 40, 
      finalMaxMarks: finalComp?.maxMarks || 50, 
      isCieEnabled: !!cieComp 
    };
  };

  const scheme = getScheme();

  const setField = (rowIndex: number, field: keyof StudentMarksEntry, value: string) => {
    setStudents((prev) => prev.map((s, i) => {
      if (i === rowIndex) {
        const numValue = value === '' ? 0 : Number(value);
        const updated = { ...s, [field]: field === 'examSeatNo' ? value : numValue };
        return calculateMarks(updated as StudentMarksEntry, scheme);
      }
      return s;
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, rowIndex: number, colIndex: number, maxCols: number) => {
    let nextRow = rowIndex;
    let nextCol = colIndex;

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      nextRow = rowIndex + 1;
      e.preventDefault();
    } else if (e.key === 'ArrowUp') {
      nextRow = rowIndex - 1;
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      nextCol = colIndex + 1;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      nextCol = colIndex - 1;
      e.preventDefault();
    }

    if (nextRow >= 0 && nextRow < students.length && nextCol >= 0 && nextCol < maxCols) {
      inputRefs.current[nextRow]?.[nextCol]?.focus();
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      showToast('Marks saved as draft', 'success');
    } finally {
      setSaving(false);
    }
  };

  // ⭐ EXCEL STYLE INPUT CLASS
  // Border hataun fakt focus kelyavar highlight hoil asa kela ahe
  const excelInputClass = "w-full h-full min-h-[32px] px-2 py-1 text-center bg-transparent outline-none border-2 border-transparent focus:border-indigo-600 focus:bg-indigo-50/30 transition-colors m-0";

  return (
    <div>
      <PageHeader title="Marks Entry" />

      <Card className="mb-5">
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select label="Class" value={programmeId} onChange={(e) => setProgrammeId(e.target.value)}>
              {mockProgrammes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <Select label="Semester" value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
              {availableSemesters.map((s) => <option key={s.id} value={s.id}>Sem {s.number}</option>)}
            </Select>
            <Select label="Division" value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
              {availableDivisions.map((d) => <option key={d.id} value={d.id}>Div {d.name}</option>)}
            </Select>
            <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {availableSubjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </div>
        </CardBody>
      </Card>

      {loading ? <LoadingState /> : (
        <>
          <div className="flex border-b border-slate-200 mb-4 overflow-x-auto whitespace-nowrap bg-slate-100 p-1 rounded-t-lg">
            <button
              onClick={() => setActiveTab('UT')}
              className={`px-4 sm:px-6 py-2 font-semibold text-sm transition-colors rounded-md ${
                activeTab === 'UT' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              PROFORMA-C (Unit Test)
            </button>
            <button
              onClick={() => setActiveTab('CIE')}
              className={`px-4 sm:px-6 py-2 font-semibold text-sm transition-colors rounded-md ${
                activeTab === 'CIE' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              PROFORMA-E (CIE + Final)
            </button>
          </div>

          {/* ⭐ EXCEL SHEET STYLE TABLE */}
          <Card className="overflow-hidden mb-4 shadow-sm border border-slate-300">
            <div className="overflow-x-auto w-full">
              
              {activeTab === 'UT' && (
                <table className="w-full text-sm min-w-[800px] border-collapse bg-white">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 px-2 py-2 text-left text-xs font-bold text-slate-700">Roll No</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700">UT-1 Marks<br/><span className="text-[10px] text-slate-500 font-normal">(Max: {scheme.utMaxMarks})</span></th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700">UT-1 Improve</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700 bg-slate-200">Final UT-1</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700">UT-2 Marks<br/><span className="text-[10px] text-slate-500 font-normal">(Max: {scheme.utMaxMarks})</span></th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700">UT-2 Improve</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700 bg-slate-200">Final UT-2</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700 bg-slate-200">Max of Two</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-indigo-800 bg-indigo-100">Marks to {scheme.utMaxMarks}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, rowIndex) => {
                      if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                      return (
                        <tr key={s.studentId} className="hover:bg-slate-50">
                          <td className="border border-slate-300 px-2 py-0 text-left font-medium text-slate-700 bg-slate-50">{s.rollNo}</td>
                          
                          <td className="border border-slate-300 p-0">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][0] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut1 === 0 ? '' : s.ut1}
                              onChange={(e) => setField(rowIndex, 'ut1', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 4)} 
                              className={excelInputClass} 
                            />
                          </td>

                          <td className="border border-slate-300 p-0">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][1] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut1Improvement === 0 ? '' : s.ut1Improvement}
                              onChange={(e) => setField(rowIndex, 'ut1Improvement', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 4)} 
                              className={excelInputClass} 
                            />
                          </td>
                          
                          <td className="border border-slate-300 px-2 py-0 text-center font-semibold bg-slate-100 text-slate-700">{s.finalUt1}</td>
                          
                          <td className="border border-slate-300 p-0">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][2] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut2 === 0 ? '' : s.ut2}
                              onChange={(e) => setField(rowIndex, 'ut2', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 2, 4)} 
                              className={excelInputClass} 
                            />
                          </td>

                          <td className="border border-slate-300 p-0">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][3] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut2Improvement === 0 ? '' : s.ut2Improvement}
                              onChange={(e) => setField(rowIndex, 'ut2Improvement', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 3, 4)} 
                              className={excelInputClass} 
                            />
                          </td>
                          
                          <td className="border border-slate-300 px-2 py-0 text-center font-semibold bg-slate-100 text-slate-700">{s.finalUt2}</td>
                          <td className="border border-slate-300 px-2 py-0 text-center font-semibold bg-slate-100 text-slate-700">{s.maxUt}</td>
                          <td className="border border-slate-300 px-2 py-0 text-center font-bold text-indigo-700 bg-indigo-50">{s.convertedTo30}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeTab === 'CIE' && (
                <table className="w-full text-sm min-w-[800px] border-collapse bg-white">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-300 px-2 py-2 text-left text-xs font-bold text-slate-700">Exam Seat</th>
                      <th className="border border-slate-300 px-2 py-2 text-left text-xs font-bold text-slate-700">Name</th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700 bg-slate-200">UT to {scheme.utMaxMarks}</th>
                      
                      {scheme.isCieEnabled && (
                        <>
                          <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700 bg-slate-200">{scheme.utWeightagePercent}% UT</th>
                          <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700">CIE Param<br/><span className="text-[10px] text-slate-500 font-normal">(Max: {scheme.cieMaxMarks})</span></th>
                          <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-slate-700 bg-slate-200">{scheme.cieWeightagePercent}% CIE</th>
                          <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-indigo-800 bg-indigo-100">Total CIE</th>
                        </>
                      )}
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-emerald-800 bg-emerald-100">Final Eval<br/><span className="text-[10px] font-normal">(Max: {scheme.finalMaxMarks})</span></th>
                      <th className="border border-slate-300 px-2 py-2 text-xs font-bold text-emerald-900 bg-emerald-200">Total Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, rowIndex) => {
                      if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                      return (
                        <tr key={s.studentId} className="hover:bg-slate-50">
                          <td className="border border-slate-300 p-0 bg-slate-50">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][0] = el; }}
                              type="text" value={s.examSeatNo} 
                              onChange={(e) => setField(rowIndex, 'examSeatNo', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 2)}
                              className={`${excelInputClass} text-left px-2`} 
                            />
                          </td>
                          <td className="border border-slate-300 px-2 py-0 text-left font-medium text-slate-700">{s.studentName}</td>
                          <td className="border border-slate-300 px-2 py-0 text-center bg-slate-100 text-slate-700">{s.convertedTo30}</td>
                          
                          {scheme.isCieEnabled && (
                            <>
                              <td className="border border-slate-300 px-2 py-0 text-center font-semibold text-slate-700 bg-slate-100">{(s.convertedTo30 * (scheme.utWeightagePercent/100)).toFixed(2)}</td>
                              <td className="border border-slate-300 p-0">
                                <input 
                                  ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][1] = el; }}
                                  type="number" min={0} max={scheme.cieMaxMarks} 
                                  value={s.cieParameters === 0 ? '' : s.cieParameters}
                                  onChange={(e) => setField(rowIndex, 'cieParameters', e.target.value)} 
                                  onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 2)}
                                  className={excelInputClass} 
                                />
                              </td>
                              <td className="border border-slate-300 px-2 py-0 text-center font-semibold text-slate-700 bg-slate-100">{(s.cieParameters * (scheme.cieWeightagePercent/100)).toFixed(2)}</td>
                              <td className="border border-slate-300 px-2 py-0 text-center font-bold text-indigo-700 bg-indigo-50">{s.totalCie}</td>
                            </>
                          )}

                          <td className="border border-slate-300 p-0 bg-emerald-50">
                            <input 
                              type="number" min={0} max={scheme.finalMaxMarks} 
                              value={s.finalEvaluation === 0 ? '' : s.finalEvaluation}
                              onChange={(e) => setField(rowIndex, 'finalEvaluation', e.target.value)} 
                              className={excelInputClass} 
                            />
                          </td>
                          <td className="border border-slate-300 px-2 py-0 text-center font-bold text-emerald-800 bg-emerald-100">{s.totalFinal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <div className="flex justify-end mt-4">
            <Button onClick={handleSaveDraft} loading={saving}>💾 Save All Draft</Button>
          </div>
        </>
      )}
    </div>
  );
}