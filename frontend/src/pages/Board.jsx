import React, { useState } from 'react';
import { SprintTab } from '../components/board/SprintTab';
import { KanbanTab } from '../components/board/KanbanTab';
import { HistoryTab } from '../components/board/HistoryTab';
import { Layers, LayoutGrid, History } from 'lucide-react';

const Board = () => {
  const [activeTab, setActiveTab] = useState('board');

  const tabs = [
    { id: 'sprint', label: 'Sprint', icon: Layers },
    { id: 'board', label: 'Board', icon: LayoutGrid },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Board</h1>
          <p className="text-muted-foreground">Manage sprints and track progress</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`tab-item ${activeTab === id ? 'active' : ''}`}
          >
            <Icon className="w-4 h-4 mr-2 inline-block" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'sprint' && <SprintTab />}
      {activeTab === 'board' && <KanbanTab />}
      {activeTab === 'history' && <HistoryTab />}
    </div>
  );
};

export default Board;
