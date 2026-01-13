import React from 'react';
import { ChevronDown, ChevronUp, ChevronsUp } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const statusClasses = {
    'To Do': 'status-badge-todo',
    'In Progress': 'status-badge-progress',
    'In Code Review': 'status-badge-review',
    'In QA': 'status-badge-qa',
    'Ready to Deployment': 'status-badge-ready',
    'Done': 'status-badge-done',
  };

  return (
    <span className={`status-badge ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const priorityClasses = {
    'Least': 'priority-least',
    'Medium': 'priority-medium',
    'High': 'priority-high',
    'Very High': 'priority-very-high',
  };

  const renderIndicator = () => {
    switch (priority) {
      case 'Least':
        return <ChevronDown className="w-3.5 h-3.5 text-current" strokeWidth={2.75} />;
      case 'Medium':
        return <span className="text-sm font-bold leading-none text-current">=</span>;
      case 'High':
        return <ChevronUp className="w-3.5 h-3.5 text-current" strokeWidth={2.75} />;
      case 'Very High':
        return <ChevronsUp className="w-3.5 h-3.5 text-current" strokeWidth={2.75} />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`priority-badge ${priorityClasses[priority] || ''} inline-flex items-center gap-1`}
      title={priority}
    >
      {renderIndicator()}
      <span>{priority}</span>
    </span>
  );
};

export const SprintStatusBadge = ({ status }) => {
  const statusClasses = {
    'To Be Start': 'sprint-to-start',
    'In Progress': 'sprint-in-progress',
    'Completed': 'sprint-completed',
  };

  return (
    <span className={`status-badge ${statusClasses[status]}`}>
      {status}
    </span>
  );
};

