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

  return (
    <div>
      <PageHeader 
        title="Marks Entry" 
        subtitle={`Use Arrow Keys/Enter. Scheme: UT(${scheme.utMaxMarks}) + CIE(${scheme.cieMaxMarks}) + Final(${scheme.finalMaxMarks})`} 
      />

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
          <div className="flex border-b border-slate-200 mb-4 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveTab('UT')}
              className={`px-4 sm:px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'UT' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              PROFORMA-C (Unit Test)
            </button>
            <button
              onClick={() => setActiveTab('CIE')}
              className={`px-4 sm:px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'CIE' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              PROFORMA-E (CIE + Final)
            </button>
          </div>

          <Card className="overflow-hidden mb-4">
            {/* ⭐ Mobile var table scroll hoil */}
            <div className="overflow-x-auto w-full pb-2">
              
              {activeTab === 'UT' && (
                <table className="w-full text-sm text-center min-w-[800px]"> {/* ⭐ min-w add kela */}
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs uppercase text-slate-600">Roll No</th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">UT-1 Marks<br/><span className="text-[10px] text-indigo-500 font-bold">(Max: {scheme.utMaxMarks})</span></th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">UT-1 Improve<br/><span className="text-[10px]">(If Any)</span></th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">Final UT-1</th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">UT-2 Marks<br/><span className="text-[10px] text-indigo-500 font-bold">(Max: {scheme.utMaxMarks})</span></th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">UT-2 Improve<br/><span className="text-[10px]">(If Any)</span></th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">Final UT-2</th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">Max of Two</th>
                      <th className="px-2 py-2 text-xs uppercase text-indigo-600 font-bold bg-indigo-50">Marks to {scheme.utMaxMarks}<br/><span className="text-[10px]">(W: {scheme.utWeightagePercent}%)</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s, rowIndex) => {
                      if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                      return (
                        <tr key={s.studentId}>
                          <td className="px-2 py-2 text-left font-medium">{s.rollNo}</td>
                          
                          <td className="px-2 py-2">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][0] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut1 === 0 ? '' : s.ut1}
                              onChange={(e) => setField(rowIndex, 'ut1', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 4)} 
                              className="w-14 mx-auto block border border-slate-300 rounded px-1 py-1 text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                            />
                          </td>

                          <td className="px-2 py-2">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][1] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut1Improvement === 0 ? '' : s.ut1Improvement}
                              onChange={(e) => setField(rowIndex, 'ut1Improvement', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 4)} 
                              className="w-14 mx-auto block border border-slate-300 rounded px-1 py-1 text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                            />
                          </td>
                          
                          <td className="px-2 py-2 font-semibold bg-slate-50">{s.finalUt1}</td>
                          
                          <td className="px-2 py-2">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][2] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut2 === 0 ? '' : s.ut2}
                              onChange={(e) => setField(rowIndex, 'ut2', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 2, 4)} 
                              className="w-14 mx-auto block border border-slate-300 rounded px-1 py-1 text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                            />
                          </td>

                          <td className="px-2 py-2">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][3] = el; }}
                              type="number" min={0} max={scheme.utMaxMarks} 
                              value={s.ut2Improvement === 0 ? '' : s.ut2Improvement}
                              onChange={(e) => setField(rowIndex, 'ut2Improvement', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 3, 4)} 
                              className="w-14 mx-auto block border border-slate-300 rounded px-1 py-1 text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" 
                            />
                          </td>
                          
                          <td className="px-2 py-2 font-semibold bg-slate-50">{s.finalUt2}</td>
                          <td className="px-2 py-2 font-semibold bg-slate-50">{s.maxUt}</td>
                          <td className="px-2 py-2 font-bold text-indigo-700 bg-indigo-50">{s.convertedTo30}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {activeTab === 'CIE' && (
                <table className="w-full text-sm text-center min-w-[800px]"> {/* ⭐ min-w add kela */}
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-2 py-2 text-left text-xs uppercase text-slate-600">Exam Seat</th>
                      <th className="px-2 py-2 text-left text-xs uppercase text-slate-600">Name</th>
                      <th className="px-2 py-2 text-xs uppercase text-slate-600">UT to {scheme.utMaxMarks}</th>
                      
                      {scheme.isCieEnabled && (
                        <>
                          <th className="px-2 py-2 text-xs uppercase text-slate-600 bg-slate-50">{scheme.utWeightagePercent}% UT</th>
                          <th className="px-2 py-2 text-xs uppercase text-slate-600">CIE Param<br/><span className="text-[10px] text-indigo-500 font-bold">(Max: {scheme.cieMaxMarks})</span></th>
                          <th className="px-2 py-2 text-xs uppercase text-slate-600 bg-slate-50">{scheme.cieWeightagePercent}% CIE</th>
                          <th className="px-2 py-2 text-xs uppercase text-indigo-600 bg-indigo-50">Total CIE</th>
                        </>
                      )}
                      <th className="px-2 py-2 text-xs uppercase text-emerald-600 bg-emerald-50">Final Eval<br/><span className="text-[10px]">(Max: {scheme.finalMaxMarks})</span></th>
                      <th className="px-2 py-2 text-xs uppercase text-emerald-700 bg-emerald-100">Total Final</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s, rowIndex) => {
                      if (!inputRefs.current[rowIndex]) inputRefs.current[rowIndex] = [];
                      return (
                        <tr key={s.studentId}>
                          <td className="px-2 py-2">
                            <input 
                              ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][0] = el; }}
                              type="text" value={s.examSeatNo} 
                              onChange={(e) => setField(rowIndex, 'examSeatNo', e.target.value)} 
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, 0, 2)}
                              className="w-20 border border-slate-300 rounded px-1 py-1 text-xs" 
                            />
                          </td>
                          <td className="px-2 py-2 text-left font-medium">{s.studentName}</td>
                          <td className="px-2 py-2 bg-slate-50">{s.convertedTo30}</td>
                          
                          {scheme.isCieEnabled && (
                            <>
                              <td className="px-2 py-2 bg-slate-50 font-semibold text-slate-700">{(s.convertedTo30 * (scheme.utWeightagePercent/100)).toFixed(2)}</td>
                              <td className="px-2 py-2">
                                <input 
                                  ref={el => { if (inputRefs.current[rowIndex]) inputRefs.current[rowIndex][1] = el; }}
                                  type="number" min={0} max={scheme.cieMaxMarks} 
                                  value={s.cieParameters === 0 ? '' : s.cieParameters}
                                  onChange={(e) => setField(rowIndex, 'cieParameters', e.target.value)} 
                                  onKeyDown={(e) => handleKeyDown(e, rowIndex, 1, 2)}
                                  className="w-16 mx-auto block border border-indigo-300 rounded px-1 py-1 text-center" 
                                />
                              </td>
                              <td className="px-2 py-2 bg-slate-50 font-semibold text-slate-700">{(s.cieParameters * (scheme.cieWeightagePercent/100)).toFixed(2)}</td>
                              <td className="px-2 py-2 font-bold text-indigo-700 bg-indigo-50">{s.totalCie}</td>
                            </>
                          )}

                          <td className="px-2 py-2 bg-emerald-50">
                            <input 
                              type="number" min={0} max={scheme.finalMaxMarks} 
                              value={s.finalEvaluation === 0 ? '' : s.finalEvaluation}
                              onChange={(e) => setField(rowIndex, 'finalEvaluation', e.target.value)} 
                              className="w-16 mx-auto block border border-emerald-300 rounded px-1 py-1 text-center" 
                            />
                          </td>
                          <td className="px-2 py-2 font-bold text-emerald-800 bg-emerald-100">{s.totalFinal}</td>
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