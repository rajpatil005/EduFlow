import type { ReactNode } from 'react';
import { Table, THead, TBody, TR, TH, TD } from '../ui/Table';
import { EmptyState } from '../common/EmptyState';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
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

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  loading,
  emptyTitle = 'No records found',
  emptyDescription = 'Get started by creating your first record.',
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl border border-slate-200">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <Table>
        <THead>
          <TR>
            {columns.map((c) => (
              <TH key={String(c.key)} className={c.className}>
                {c.header}
              </TH>
            ))}
          </TR>
        </THead>
        <TBody>
          {data.map((row, i) => (
            <TR
              key={String(row[keyField])}
              className={
                onRowClick
                  ? 'cursor-pointer hover:bg-slate-50 transition-colors'
                  : ''
              }
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((c) => (
                <TD key={String(c.key)} className={c.className}>
                  {c.render ? (
                    c.render(row, i)
                  ) : (
                    <span>{String(row[c.key as keyof T] ?? '—')}</span>
                  )}
                </TD>
              ))}
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  );
}