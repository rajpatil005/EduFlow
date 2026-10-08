export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative">
      <div className="h-12 w-12 rounded-full border-4 border-slate-200" />
      <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
    </div>
    <p className="mt-4 text-sm text-slate-500">{message}</p>
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
    ))}
  </div>
);