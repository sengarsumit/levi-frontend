import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Issue } from '../../types';
import IssueCard from '../issue/IssueCard';

interface BacklogListProps {
  issues: Issue[];
  onIssueClick: (issue: Issue) => void;
}

export default function BacklogList({ issues, onIssueClick }: BacklogListProps) {
  const { setNodeRef } = useDroppable({
    id: 'backlog',
    data: {
      type: 'Backlog',
    },
  });

  return (
    <div className="bg-white dark:bg-dark-paper border border-gray-200 dark:border-dark-border rounded-lg shadow-sm overflow-hidden transition-colors duration-200">
      <div className="bg-gray-50 dark:bg-dark-bg/50 px-4 py-3 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="text-xl">📋</span> Backlog
        </h3>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
          {issues.length} issues
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`p-2 min-h-[150px] ${
          issues.length === 0 ? 'flex flex-col items-center justify-center' : 'flex flex-col gap-2'
        }`}
      >
        <SortableContext items={issues.map(i => `issue-${i.id}`)} strategy={verticalListSortingStrategy}>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <div key={issue.id} onClick={() => onIssueClick(issue)} className="cursor-pointer">
                <IssueCard issue={issue} />
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
              Your backlog is empty. Create issues to plan your work.
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
