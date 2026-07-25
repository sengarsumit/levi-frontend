import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import { CreateIssueModal } from './CreateIssueModal';
import { Plus } from 'lucide-react';

interface Issue {
  id: number;
  title: string;
  issueType: string;
  workflowStateId?: number;
}

interface WorkflowState {
  id: number;
  name: string;
  orderIndex: number;
}

interface KanbanColumnProps {
  column: WorkflowState;
  issues: Issue[];
  projectId: number;
  boardId: number;
  onCardClick: (issue: Issue) => void;
}

const columnColors: Record<string, string> = {
  'To Do': 'border-t-slate-400',
  'In Progress': 'border-t-indigo-500',
  'Done': 'border-t-emerald-500',
};

const columnHeaderColors: Record<string, string> = {
  'To Do': 'bg-slate-100 text-slate-600',
  'In Progress': 'bg-indigo-50 text-indigo-700',
  'Done': 'bg-emerald-50 text-emerald-700',
};

export function KanbanColumn({ column, issues, projectId, boardId, onCardClick }: KanbanColumnProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const borderColor = columnColors[column.name] ?? 'border-t-slate-300';
  const headerColor = columnHeaderColors[column.name] ?? 'bg-slate-50 text-slate-600';

  return (
    <>
      <div
        className={`flex flex-col rounded-xl border border-slate-200 border-t-4 ${borderColor} bg-slate-50 min-w-[280px] max-w-[320px] w-full transition-all
          ${isOver ? 'ring-2 ring-indigo-300 bg-indigo-50' : ''}`}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${headerColor}`}>
              {column.name}
            </span>
            <span className="text-xs font-semibold text-slate-400 tabular-nums">
              {issues.length}
            </span>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
            title="Add issue"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Cards drop zone */}
        <div
          ref={setNodeRef}
          className="flex-1 flex flex-col gap-2 p-3 min-h-[120px]"
        >
          <SortableContext
            items={issues.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
          >
            {issues.map((issue) => (
              <KanbanCard key={issue.id} issue={issue} onClick={onCardClick} />
            ))}
          </SortableContext>
          {issues.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-400 italic">Drop issues here</p>
            </div>
          )}
        </div>

        {/* Add issue button at bottom */}
        <div className="px-3 pb-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all border border-dashed border-slate-300 hover:border-indigo-300"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Issue
          </button>
        </div>
      </div>

      <CreateIssueModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        projectId={projectId}
        boardId={boardId}
        workflowStateId={column.id}
        workflowStateName={column.name}
      />
    </>
  );
}
