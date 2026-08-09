import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IssueTypeBadge } from '../issue/IssueBadge';
import { AssigneeAvatar } from '../issue/AssigneeAvatar';
import { GripVertical } from 'lucide-react';

interface Issue {
  id: number;
  title: string;
  issueType: string;
  workflowStateId?: number;
  assignedTo?: string;
}

interface KanbanCardProps {
  issue: Issue;
  onClick: (issue: Issue) => void;
}

export function KanbanCard({ issue, onClick }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: issue.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-slate-200 p-3 shadow-sm group cursor-pointer
        hover:shadow-md hover:border-indigo-300 transition-all
        ${isDragging ? 'opacity-50 ring-2 ring-indigo-400 shadow-xl' : ''}`}
      onClick={() => onClick(issue)}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">
            {issue.title}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <IssueTypeBadge type={issue.issueType} />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mt-2">
        <AssigneeAvatar assignedTo={issue.assignedTo} />
      </div>
    </div>
  );
}
