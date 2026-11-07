import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/common/LoadingState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { mockResults } from '@/mock/mockData';
import { marksApi } from '@/services/marksApi';

interface ReportRow {
  studentId: string;
  examSeatNo: string;
  studentRollNo: string;
  studentName: string;
  utConvertedTo30: number;
  utPercent60: number;
  cieMarksOut30: number;
  ciePercent40: number;
  totalCieMarks: number;
}

export default function Reports() {
  const { showToast } = useToast();
  const [subjectId, setSubjectId] = useState('s1');
  const [students, setStudents] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    setSubmitted(false); 
    
    setTimeout(() => {
      setStudents(mockResults as ReportRow[]);
      setLoading(false);
    }, 300);
  }, [subjectId]);

  const exportExcel = () => {
    if (students.length === 0) {
      showToast('No data to export', 'error');
      return;
    }

    const headers = [
      'Exam Seat No.',
      'Roll No',
      'Name of Student',
      'Unit Test Converted to 30',
      '60% of UT',
      'CIE Parameters / 30',
      '40% of CIE',
      'Total CIE / 30',
    ];

    const rows = students.map((s) => [
      s.examSeatNo,
      s.studentRollNo,
      s.studentName,
      s.utConvertedTo30,
      s.utPercent60,
      s.cieMarksOut30,
      s.ciePercent40,
      s.totalCieMarks,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((v) => `"${v}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CIE-Report-${subjectId}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Excel downloaded successfully', 'success');
  };

  // ==================== 2. SUBMIT TO HOD ====================
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Backend API call
      const payload = {
        subjectId,
        entries: students.map((s) => ({
          studentId: s.studentId,
          examSeatNo: s.examSeatNo,
          totalCieMarks: s.totalCieMarks,
        })),
      };

      await marksApi.submit(payload as any);
      showToast('Marks submitted to HOD successfully', 'success');
      setSubmitted(true);
    } catch {
      // Mock fallback (backend nasel tar)
      await new Promise((r) => setTimeout(r, 800));
      showToast('Marks submitted to HOD (mock)', 'success');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Reports — CIE Assessment"
        subtitle="Proforma-E Format"
        actions={
          <div className="flex gap-2">
            {/* Excel Button */}
            <Button variant="outline" onClick={exportExcel} disabled={loading || students.length === 0}>
              📊 Download Excel
            </Button>

            {/* Submit Button */}
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={loading || students.length === 0 || submitted}
              variant={submitted ? 'success' : 'primary'}
            >
              {submitted ? '✓ Submitted to HOD' : '✅ Submit to HOD'}
            </Button>
          </div>
        }
      />

      <Card className="mb-5">
        <CardBody>
          <div className="w-64">
            <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              <option value="s1">DBMS</option>
              <option value="s2">AI</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <LoadingState />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-slate-600">Exam Seat No.</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-slate-600">Roll No</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-slate-600">Name of Student</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase text-slate-600">UT Converted to 30</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase text-slate-600">60% of UT</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase text-slate-600">CIE Params / 30</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase text-slate-600">40% of CIE</th>
                  <th className="px-3 py-3 text-xs font-semibold uppercase text-indigo-600 bg-indigo-50">Total CIE / 30</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.studentId} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-left font-mono text-slate-700">{s.examSeatNo}</td>
                    <td className="px-3 py-2 text-left text-slate-700">{s.studentRollNo}</td>
                    <td className="px-3 py-2 text-left font-medium text-slate-900">{s.studentName}</td>
                    <td className="px-3 py-2 text-slate-700">{s.utConvertedTo30}</td>
                    <td className="px-3 py-2 text-slate-700">{s.utPercent60}</td>
                    <td className="px-3 py-2 text-slate-700">{s.cieMarksOut30}</td>
                    <td className="px-3 py-2 text-slate-700">{s.ciePercent40}</td>
                    <td className="px-3 py-2 font-bold text-indigo-700 bg-indigo-50/50">{s.totalCieMarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Submit Marks to HOD"
        message={`Are you sure you want to submit CIE marks for ${students.length} students to HOD? Once submitted, HOD will be able to view these marks.`}
        onConfirm={handleSubmit}
        onCancel={() => setConfirmOpen(false)}
        loading={submitting}
      />
    </div>
  );
}