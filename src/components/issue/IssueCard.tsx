import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IssueTypeBadge } from './IssueBadge';
import { AssigneeAvatar } from './AssigneeAvatar';
import { GripVertical } from 'lucide-react';
import type { Issue } from '../../types';

interface IssueCardProps {
  issue: Issue;
}

export default function IssueCard({ issue }: IssueCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `issue-${issue.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-dark-paper rounded-lg border border-gray-200 dark:border-dark-border p-3 shadow-sm group hover:shadow-md hover:border-primary-300 dark:hover:border-primary-500/50 transition-all ${
        isDragging ? 'opacity-50 ring-2 ring-primary-400 shadow-xl z-50 relative' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 cursor-grab active:cursor-grabbing shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">
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
