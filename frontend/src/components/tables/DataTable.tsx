import { ReactNode } from 'react';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import { EmptyState } from '../common/EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
}

// ⭐ extends object kela aani constraints kadhle
export const DataTable = <T extends object>({
  columns,
  data,
  keyField,
  loading,
  emptyTitle = 'No records found',
  emptyDescription = 'No data available.',
  onRowClick,
}: DataTableProps<T>) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <THead>
          <TR>
            {columns.map((c) => (
              <TH key={c.key}>{c.header}</TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {data.map((row, i) => (
            <TR key={String(row[keyField])} className={onRowClick ? 'cursor-pointer' : ''}>
              {columns.map((c) => (
                <TD key={c.key}>
                  {c.render ? c.render(row, i) : String(row[c.key as keyof T] ?? '—')}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
};