import { ReactNode, useState } from 'react';

export const Tooltip = ({ content, children }: { content: string; children: ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white z-50">
          {content}
        </div>
      )}
    </div>
  );
};