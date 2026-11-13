import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingState } from '@/components/common/LoadingState';
import { useToast } from '@/components/ui/Toast';
import {
  hodApi,
  HodMarksSubmission,
  MarksApprovalStatus,
} from '@/services/hodApi';
import { mockHodSubmissions } from '@/mock/mockData';

export default function MarksApproval() {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<HodMarksSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | MarksApprovalStatus>('PENDING');

  // Reviewing modal
  const [reviewingItem, setReviewingItem] = useState<HodMarksSubmission | null>(null);

  // Approve Confirm Dialog
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [processingApprove, setProcessingApprove] = useState(false);

  // Reject Modal with Reason
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processingReject, setProcessingReject] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await hodApi.getMarksSubmissions();
        setSubmissions(data);
      } catch {
        setSubmissions(mockHodSubmissions);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = async () => {
    if (!reviewingItem) return;
    setProcessingApprove(true);
    try {
      await hodApi.approveMarks(reviewingItem.id);
      setSubmissions((prev) =>
        prev.map((s) => (s.id === reviewingItem.id ? { ...s, status: 'APPROVED' } : s))
      );
      setReviewingItem((prev) => (prev ? { ...prev, status: 'APPROVED' } : null));
      showToast('Marks submission approved successfully', 'success');
      setApproveConfirmOpen(false);
    } finally {
      setProcessingApprove(false);
    }
  };

  const handleReject = async () => {
    if (!reviewingItem) return;
    if (!rejectReason.trim()) {
      showToast('Please provide a reason for rejection', 'error');
      return;
    }

    setProcessingReject(true);
    try {
      await hodApi.rejectMarks(reviewingItem.id, rejectReason.trim());
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === reviewingItem.id
            ? { ...s, status: 'REJECTED', rejectionReason: rejectReason.trim() }
            : s
        )
      );
      setReviewingItem((prev) =>
        prev
          ? { ...prev, status: 'REJECTED', rejectionReason: rejectReason.trim() }
          : null
      );
      showToast('Marks submission rejected and returned to teacher', 'success');
      setRejectModalOpen(false);
      setRejectReason('');
    } finally {
      setProcessingReject(false);
    }
  };

  const filtered = submissions.filter((s) => {
    if (activeTab === 'ALL') return true;
    return s.status === activeTab;
  });

  if (loading) {
    return <LoadingState message="Loading marks submissions..." />;
  }

  const getStatusBadge = (status: MarksApprovalStatus) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      default:
        return <Badge variant="warning">Pending Approval</Badge>;
    }
  };

  return (
    <div>
      <PageHeader
        title="Marks Approval"
        subtitle="Review, verify, approve, or reject marks submitted by department faculty"
      />

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3">
        {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {tab === 'ALL' ? 'All Submissions' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            <span className="ml-2 text-xs opacity-80">
              ({tab === 'ALL' ? submissions.length : submissions.filter((s) => s.status === tab).length})
            </span>
          </button>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Assessment</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Submitted By</th>
                <th className="py-3 px-4 text-center">Division</th>
                <th className="py-3 px-4 text-center">Submitted Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No submissions found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{s.assessmentName}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{s.subjectName}</div>
                      <div className="text-xs font-mono text-slate-400">{s.subjectCode}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">{s.teacherName}</td>
                    <td className="py-3 px-4 text-center">
                      <Badge variant="purple">Div {s.division}</Badge>
                    </td>
                    <td className="py-3 px-4 text-center text-xs text-slate-500">{s.submittedDate}</td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(s.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setReviewingItem(s)}>
                        Review Marks
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Marks Modal */}
      <Modal
        open={!!reviewingItem}
        onClose={() => setReviewingItem(null)}
        title={reviewingItem ? `Review ${reviewingItem.assessmentName} — ${reviewingItem.subjectName}` : 'Review Marks'}
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button variant="outline" onClick={() => setReviewingItem(null)}>Close</Button>
            {reviewingItem && reviewingItem.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => setRejectModalOpen(true)}>
                  Reject
                </Button>
                <Button variant="success" onClick={() => setApproveConfirmOpen(true)}>
                  Approve Marks
                </Button>
              </div>
            )}
          </div>
        }
      >
        {reviewingItem && (
          <div className="space-y-4 text-sm">
            {/* Header info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Subject</p>
                <p className="font-semibold text-slate-800">{reviewingItem.subjectName} ({reviewingItem.subjectCode})</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Faculty</p>
                <p className="font-semibold text-slate-800">{reviewingItem.teacherName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Division & Sem</p>
                <p className="font-semibold text-slate-800">Div {reviewingItem.division} (Sem {reviewingItem.semester})</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Max Marks</p>
                <p className="font-bold text-slate-900">{reviewingItem.maxMarks} Marks</p>
              </div>
            </div>

            {/* Rejection notice if rejected */}
            {reviewingItem.status === 'REJECTED' && reviewingItem.rejectionReason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <span className="font-semibold">Rejection Reason: </span>
                {reviewingItem.rejectionReason}
              </div>
            )}

            {/* Student Marks Table */}
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Student Marks List</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3 text-right">Marks Obtained</th>
                      <th className="py-2.5 px-3 text-right">Out of</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviewingItem.studentMarks.map((st) => (
                      <tr key={st.studentId} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-medium text-slate-700">{st.rollNo}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{st.studentName}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{st.marksObtained}</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">{reviewingItem.maxMarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm Approve Dialog */}
      <ConfirmDialog
        open={approveConfirmOpen}
        title="Approve Marks Submission"
        message="Are you sure you want to approve this marks submission? Once approved, it will be finalized."
        onConfirm={handleApprove}
        onCancel={() => setApproveConfirmOpen(false)}
        loading={processingApprove}
      />

      {/* Reject Modal with Reason */}
      <Modal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Marks Submission"
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleReject} loading={processingReject}>
              Confirm Rejection
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Please specify why these marks are being rejected. This feedback will be sent back to the teacher for correction.
          </p>
          <Textarea
            label="Rejection Reason *"
            placeholder="e.g. Marks entry contains discrepancy with attendance records or missing students..."
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

