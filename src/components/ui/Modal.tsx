'use client';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ isOpen, onClose, children, title }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {(title || onClose) && (
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                  {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                  {onClose && (
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center">
                      <X size={18} className="text-white/60" />
                    </button>
                  )}
                </div>
              )}
              <div className="overflow-y-auto max-h-[calc(85vh-60px)] p-4">
                {children}
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
