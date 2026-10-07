import { Button, Input, Card, CardBody, CardHeader, CardTitle, Badge } from './components/ui';
import { PageHeader } from './components/layout';
import { EmptyState, LoadingState, ErrorState } from './components/common';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <PageHeader
          title="EduFlow Components Test"
          subtitle="Verifying all Week 1 components render correctly"
        />

        <Card>
          <CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
          <CardBody className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button loading>Loading...</Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Form Inputs</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <Input label="Full Name" placeholder="Enter your name" />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error="Invalid email address"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Badges</CardTitle></CardHeader>
          <CardBody className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="success" dot>Active</Badge>
            <Badge variant="warning" dot>Pending</Badge>
            <Badge variant="danger" dot>Inactive</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="purple">Purple</Badge>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Common States</CardTitle></CardHeader>
          <CardBody>
            <EmptyState
              title="No students found"
              description="Get started by adding your first student."
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Loading State</CardTitle></CardHeader>
          <CardBody>
            <LoadingState message="Fetching data..." />
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Error State</CardTitle></CardHeader>
          <CardBody>
            <ErrorState onRetry={() => alert('Retry clicked')} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}