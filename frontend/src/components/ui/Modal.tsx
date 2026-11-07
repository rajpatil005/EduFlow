import { ReactNode, useEffect } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode; // ⭐ HE ADD KELA
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

export const Modal = ({ open, onClose, title, children, footer, size = 'md' }: ModalProps) => {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full flex flex-col max-h-[90vh] ${sizeClasses[size]}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl leading-none">
            ×
          </button>
        </div>
        
        {/* Body (Scrollable) */}
        <div className="p-5 overflow-y-auto">
          {children}
        </div>

        {/* Footer (Button Ithe Disel) */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-5 py-4 bg-slate-50 border-t rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};