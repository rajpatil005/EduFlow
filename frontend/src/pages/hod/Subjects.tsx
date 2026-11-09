import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LoadingState } from '@/components/common/LoadingState';
import { hodApi, HodSubject } from '@/services/hodApi';
import { mockHodSubjects } from '@/mock/mockData';

export default function Subjects() {
  const [subjects, setSubjects] = useState<HodSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<HodSubject | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await hodApi.getSubjects();
        setSubjects(data);
      } catch {
        setSubjects(mockHodSubjects);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = subjects.filter((s) => {
    const matchesSem = semesterFilter ? s.semester.toString() === semesterFilter : true;
    const q = search.toLowerCase();
    const matchesSearch = s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
    return matchesSem && matchesSearch;
  });

  if (loading) {
    return <LoadingState message="Loading subjects..." />;
  }

  return (
    <div>
      <PageHeader
        title="Department Subjects"
        subtitle="Curriculum subjects, semester mapping, credit allocations, and assigned faculty"
      />

      <Card className="mb-6">
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Filter by Semester"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </Select>

            <Input
              label="Search Subject"
              placeholder="Search by subject name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-slate-500">
            No subjects found matching your filters.
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filtered.map((s) => (
            <Card key={s.id} hoverable>
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{s.code}</p>
                  </div>
                  <Badge variant="info">Sem {s.semester}</Badge>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mb-4 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Programme</span>
                    <span className="font-medium text-slate-800">{s.programme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits</span>
                    <span className="font-semibold text-slate-800">{s.credits} Credits</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Faculty</span>
                    <span className="font-medium text-indigo-600">{s.assignedTeacher || 'Unassigned'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enrolled Students</span>
                    <span className="font-medium text-slate-800">{s.studentCount} students</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => setSelectedSubject(s)}>
                    Subject Details
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        title="Subject Information"
        footer={<Button variant="outline" onClick={() => setSelectedSubject(null)}>Close</Button>}
      >
        {selectedSubject && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs text-slate-500 uppercase">Subject Name</p>
              <p className="font-bold text-slate-900 text-lg">{selectedSubject.name}</p>
              <p className="font-mono text-xs text-slate-500">{selectedSubject.code}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <p className="text-xs text-slate-500 uppercase">Semester</p>
                <p className="font-semibold text-slate-800">Semester {selectedSubject.semester}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Credits</p>
                <p className="font-semibold text-slate-800">{selectedSubject.credits} Academic Credits</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-3 border-b">
              <div>
                <p className="text-xs text-slate-500 uppercase">Programme</p>
                <p className="text-slate-800">{selectedSubject.programme}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Enrolled Students</p>
                <p className="text-slate-800">{selectedSubject.studentCount} Students</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase">Current Assigned Faculty</p>
              <p className="font-medium text-indigo-700 text-base mt-1">{selectedSubject.assignedTeacher}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

