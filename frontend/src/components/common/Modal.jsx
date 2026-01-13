import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-[95vw] sm:max-w-sm',
    md: 'max-w-[95vw] sm:max-w-md',
    lg: 'max-w-[95vw] sm:max-w-lg',
    xl: 'max-w-[95vw] sm:max-w-xl',
    '2xl': 'max-w-[95vw] md:max-w-2xl',
    '75vw': 'max-w-[95vw] lg:max-w-[75vw]',
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={`bg-card rounded-xl shadow-lg w-full ${
            sizeClasses[size] || sizeClasses.md
          } animate-scale-in max-h-[90vh] flex flex-col`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

