import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';

export default function Syllabus() {
  const [subjectId, setSubjectId] = useState('');
  const syllabusUrl = subjectId ? `https://example.com/syllabus/${subjectId}.pdf` : '';

  return (
    <div>
      <PageHeader title="Syllabus" subtitle="View and download subject syllabus" />

      <Card className="mb-5">
        <CardBody>
          <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">Select subject</option>
            <option value="s1">DBMS</option>
            <option value="s2">AI</option>
          </Select>
        </CardBody>
      </Card>

      {!subjectId ? (
        <Card><CardBody><EmptyState title="Select a subject" description="Choose a subject to view its syllabus." /></CardBody></Card>
      ) : (
        <Card>
          <CardBody>
            <h3 className="text-base font-semibold mb-3">Syllabus PDF</h3>
            <p className="text-sm text-slate-500 mb-4">View or download the syllabus for this subject.</p>
            <div className="flex gap-2">
              <Button onClick={() => window.open(syllabusUrl, '_blank')}>View PDF</Button>
              <Button variant="outline" onClick={() => { const a = document.createElement('a'); a.href = syllabusUrl; a.download = `syllabus-${subjectId}.pdf`; a.click(); }}>Download</Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}