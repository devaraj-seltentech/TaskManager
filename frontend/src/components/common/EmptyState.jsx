import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      {icon || <FileQuestion className="empty-state-icon" />}
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  );
};

