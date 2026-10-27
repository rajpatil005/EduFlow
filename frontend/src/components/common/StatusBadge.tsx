import { Badge } from '@/components/ui/Badge';

type Status =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFIED'
  | 'LOCKED'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING';

interface StatusBadgeProps {
  status: Status | string;
}

const statusMap: Record<
  string,
  { variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'; label: string }
> = {
  DRAFT: { variant: 'default', label: 'Draft' },
  SUBMITTED: { variant: 'info', label: 'Submitted' },
  VERIFIED: { variant: 'warning', label: 'Verified' },
  LOCKED: { variant: 'success', label: 'Locked' },
  ACTIVE: { variant: 'success', label: 'Active' },
  INACTIVE: { variant: 'danger', label: 'Inactive' },
  PENDING: { variant: 'warning', label: 'Pending' },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusMap[status] ?? { variant: 'default' as const, label: String(status) };
  return <Badge variant={config.variant}>{config.label}</Badge>;
};