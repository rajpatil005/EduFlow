import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  path?: string;
}

export const Breadcrumb = ({ items }: { items: Crumb[] }) => (
  <nav className="flex items-center text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
    <Link to="/" className="hover:text-slate-700 transition-colors">
      Home
    </Link>
    {items.map((item, i) => (
      <span key={i} className="flex items-center">
        <svg className="mx-2 h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {item.path ? (
          <Link to={item.path} className="hover:text-slate-700 transition-colors">
            {item.label}
          </Link>
        ) : (
          <span className="text-slate-900 font-medium">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);