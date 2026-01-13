import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from '../ui/button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
            variant === 'danger' ? 'bg-destructive/10' : 'bg-yellow-500/10'
          }`}
        >
          <AlertTriangle
            className={`w-6 h-6 ${
              variant === 'danger' ? 'text-destructive' : 'text-yellow-500'
            }`}
          />
        </div>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3 w-full">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

