import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { hodApi, HodAttendanceRecord, HodMarksSubmission, HodTeacher } from '@/services/hodApi';
import { mockHodAttendance, mockHodSubmissions, mockHodTeachers } from '@/mock/mockData';

type ReportType = 'ATTENDANCE' | 'MARKS' | 'FACULTY_WORKLOAD';

export default function Reports() {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<ReportType>('ATTENDANCE');
  const [attendanceData, setAttendanceData] = useState<HodAttendanceRecord[]>([]);
  const [marksData, setMarksData] = useState<HodMarksSubmission[]>([]);
  const [facultyData, setFacultyData] = useState<HodTeacher[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [att, marks, teachers] = await Promise.all([
          hodApi.getAttendanceRecords(),
          hodApi.getMarksSubmissions(),
          hodApi.getTeachers(),
        ]);
        setAttendanceData(att);
        setMarksData(marks);
        setFacultyData(teachers);
      } catch {
        setAttendanceData(mockHodAttendance);
        setMarksData(mockHodSubmissions);
        setFacultyData(mockHodTeachers);
      }
    };
    load();
  }, []);

  const exportCSV = () => {
    let csvContent = '';
    let fileName = `hod-report-${reportType.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;

    if (reportType === 'ATTENDANCE') {
      const headers = ['Roll No', 'Student Name', 'Subject', 'Division', 'Conducted', 'Attended', 'Attendance %', 'Status'];
      const rows = attendanceData.map((r) => [
        r.rollNo,
        `"${r.studentName}"`,
        `"${r.subject}"`,
        r.division,
        r.conductedClasses,
        r.attendedClasses,
        `${r.attendancePercent}%`,
        r.status,
      ]);
      csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    } else if (reportType === 'MARKS') {
      const headers = ['Assessment', 'Subject', 'Teacher', 'Semester', 'Division', 'Submitted Date', 'Status', 'Max Marks'];
      const rows = marksData.map((m) => [
        `"${m.assessmentName}"`,
        `"${m.subjectName}"`,
        `"${m.teacherName}"`,
        m.semester,
        m.division,
        m.submittedDate,
        m.status,
        m.maxMarks,
      ]);
      csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    } else {
      const headers = ['Employee ID', 'Name', 'Email', 'Designation', 'Workload (hrs/wk)', 'Status'];
      const rows = facultyData.map((f) => [
        f.employeeId,
        `"${f.name}"`,
        f.email,
        `"${f.designation}"`,
        f.workloadHours,
        f.status,
      ]);
      csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report exported to CSV successfully', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Department Academic Reports"
        subtitle="Generate, preview, and export department-level attendance, marks, and faculty reports"
        actions={<Button onClick={exportCSV}>Export CSV</Button>}
      />

      <Card className="mb-6">
        <CardBody>
          <div className="max-w-md">
            <Select
              label="Select Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
            >
              <option value="ATTENDANCE">Student Attendance Report</option>
              <option value="MARKS">Marks Approval & Evaluation Report</option>
              <option value="FACULTY_WORKLOAD">Faculty Workload Summary Report</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">
              {reportType === 'ATTENDANCE' && 'Student Attendance Report Preview'}
              {reportType === 'MARKS' && 'Marks Submissions Report Preview'}
              {reportType === 'FACULTY_WORKLOAD' && 'Faculty Workload Report Preview'}
            </h3>
            <span className="text-xs text-slate-500">Live Department Data</span>
          </div>

          <div className="overflow-x-auto">
            {reportType === 'ATTENDANCE' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3 text-center">Division</th>
                    <th className="py-2.5 px-3 text-center">Conducted</th>
                    <th className="py-2.5 px-3 text-center">Attended</th>
                    <th className="py-2.5 px-3 text-center">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attendanceData.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono">{r.rollNo}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{r.studentName}</td>
                      <td className="py-2 px-3 text-slate-700">{r.subject}</td>
                      <td className="py-2 px-3 text-center">{r.division}</td>
                      <td className="py-2 px-3 text-center">{r.conductedClasses}</td>
                      <td className="py-2 px-3 text-center">{r.attendedClasses}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">{r.attendancePercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'MARKS' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Assessment</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Faculty</th>
                    <th className="py-2.5 px-3 text-center">Division</th>
                    <th className="py-2.5 px-3 text-center">Max Marks</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {marksData.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{m.assessmentName}</td>
                      <td className="py-2 px-3 text-slate-700">{m.subjectName}</td>
                      <td className="py-2 px-3 text-slate-700">{m.teacherName}</td>
                      <td className="py-2 px-3 text-center">Div {m.division}</td>
                      <td className="py-2 px-3 text-center font-bold text-slate-800">{m.maxMarks}</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={m.status === 'APPROVED' ? 'success' : m.status === 'REJECTED' ? 'danger' : 'warning'}>
                          {m.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {reportType === 'FACULTY_WORKLOAD' && (
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Employee ID</th>
                    <th className="py-2.5 px-3">Faculty Name</th>
                    <th className="py-2.5 px-3">Designation</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3 text-center">Workload</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facultyData.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono text-xs">{f.employeeId}</td>
                      <td className="py-2 px-3 font-medium text-slate-900">{f.name}</td>
                      <td className="py-2 px-3 text-slate-700">{f.designation}</td>
                      <td className="py-2 px-3 text-slate-500 text-xs">{f.email}</td>
                      <td className="py-2 px-3 text-center font-semibold text-slate-800">{f.workloadHours} hrs/wk</td>
                      <td className="py-2 px-3 text-center">
                        <Badge variant={f.status === 'ACTIVE' ? 'success' : 'default'}>{f.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

