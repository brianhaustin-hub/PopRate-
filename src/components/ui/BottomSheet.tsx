'use client';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
          <div className="fixed bottom-0 left-0 right-0 bg-surface-900 border-t border-white/5 rounded-t-3xl z-50 max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center">
                <X size={18} className="text-white/60" />
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-60px)] p-4">
              {children}
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
