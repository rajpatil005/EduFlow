import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockComponents } from '@/mock/mockData';
import type { AssessmentComponent } from '@/types/assessment';

export default function Assessments() {
  const { showToast } = useToast();
  const [subjectId, setSubjectId] = useState('s1');
  const [components, setComponents] = useState<AssessmentComponent[]>([]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ maxMarks: 0, weightage: 0 });

  useEffect(() => {
    if (!subjectId) return;
    
    // Load from localStorage
    const saved = localStorage.getItem(`assessment_components_${subjectId}`);
    if (saved) {
      setComponents(JSON.parse(saved));
    } else {
      const subsComponents = mockComponents.filter(c => c.subjectId === subjectId);
      if (subsComponents.length > 0) {
        setComponents(subsComponents as AssessmentComponent[]); 
      } else {
        setComponents([
          { id: `c1-${subjectId}`, subjectId, name: 'UT1', maxMarks: 20, weightage: 10, type: 'UNIT_TEST' },
          { id: `c2-${subjectId}`, subjectId, name: 'UT2', maxMarks: 20, weightage: 10, type: 'UNIT_TEST' },
          { id: `c3-${subjectId}`, subjectId, name: 'CIE', maxMarks: 30, weightage: 40, type: 'PRACTICAL' },
          { id: `c4-${subjectId}`, subjectId, name: 'FINAL', maxMarks: 50, weightage: 40, type: 'FINAL' },
        ]);
      }
    }
    setEditingId(null);
  }, [subjectId]);

  const handleEditClick = (comp: AssessmentComponent) => {
    setEditingId(comp.id);
    setEditForm({ maxMarks: comp.maxMarks, weightage: comp.weightage });
  };

  const handleSaveClick = (id: string) => {
    const updated = components.map(c => 
      c.id === id ? { ...c, maxMarks: editForm.maxMarks, weightage: editForm.weightage } : c
    );
    setComponents(updated);
    localStorage.setItem(`assessment_components_${subjectId}`, JSON.stringify(updated));
    setEditingId(null);
    showToast('Component updated! Marks Entry will now use these marks.', 'success');
  };

  return (
    <div>
      <PageHeader 
        title="Assessments Setup" 
        subtitle="Configure max marks and weightage for each component" 
      />

      <Card className="mb-5 max-w-sm">
        <CardBody>
          <Select label="Subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="s1">DBMS</option>
            <option value="s2">AI</option>
          </Select>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map((c) => (
          <Card key={c.id} className={editingId === c.id ? 'border-indigo-400 shadow-md' : ''}>
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900">{c.name}</h3>
                <Badge variant={c.type === 'FINAL' ? 'purple' : c.type === 'UNIT_TEST' ? 'info' : 'warning'}>
                  {c.type}
                </Badge>
              </div>

              {editingId === c.id ? (
                <div className="space-y-3 mt-3">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Max Marks</label>
                    <Input 
                      type="number" 
                      value={editForm.maxMarks} 
                      onChange={(e) => setEditForm({ ...editForm, maxMarks: Number(e.target.value) })} 
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Weightage (%)</label>
                    <Input 
                      type="number" 
                      value={editForm.weightage} 
                      onChange={(e) => setEditForm({ ...editForm, weightage: Number(e.target.value) })} 
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={() => handleSaveClick(c.id)}>Save</Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Max Marks: <span className="font-medium text-slate-900">{c.maxMarks}</span></p>
                    <p>Weightage: <span className="font-medium text-slate-900">{c.weightage}%</span></p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(c)}>
                      ✏️ Edit
                    </Button>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}