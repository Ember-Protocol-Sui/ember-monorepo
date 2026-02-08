import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export function DropdownPortal({ children, targetRef, open }: { children: React.ReactNode, targetRef: React.RefObject<HTMLElement>, open: boolean }) {
  const [coords, setCoords] = useState<{ top: number, left: number, width: number }>({ top: 0, left: 0, width: 0 });
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
  }, [open, targetRef]);

  if (!open) return null;

  return createPortal(
    <div
      ref={portalRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        width: coords.width,
        zIndex: 99999,
      }}
    >
      {children}
    </div>,
    document.body
  );
} 