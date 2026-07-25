import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Issue } from '../../types';
import type { Sprint } from '../../api/sprintApi';
import IssueCard from '../issue/IssueCard';

interface SprintSectionProps {
  sprint: Sprint;
  issues: Issue[];
  onStartSprint: () => void;
  onCompleteSprint: () => void;
  onIssueClick: (issue: Issue) => void;
}

export default function SprintSection({
  sprint,
  issues,
  onStartSprint,
  onCompleteSprint,
  onIssueClick,
}: SprintSectionProps) {
  const { setNodeRef } = useDroppable({
    id: `sprint-${sprint.id}`,
    data: {
      type: 'Sprint',
      sprint,
    },
  });

  return (
    <div className="bg-white dark:bg-dark-paper border border-gray-200 dark:border-dark-border rounded-lg mb-6 shadow-sm overflow-hidden transition-colors duration-200">
      <div className="bg-gray-50 dark:bg-dark-bg/50 px-4 py-3 border-b border-gray-200 dark:border-dark-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-xl">🏃</span> {sprint.name}
          </h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            {issues.length} issues
          </span>
          {sprint.status === 'ACTIVE' && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
              Active Sprint
            </span>
          )}
        </div>
        <div>
          {sprint.status === 'PLANNED' && (
            <button
              onClick={onStartSprint}
              disabled={issues.length === 0}
              className="text-sm font-medium px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Sprint
            </button>
          )}
          {sprint.status === 'ACTIVE' && (
            <button
              onClick={onCompleteSprint}
              className="text-sm font-medium px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
            >
              Complete Sprint
            </button>
          )}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`p-2 min-h-[100px] ${
          issues.length === 0 ? 'flex items-center justify-center' : 'flex flex-col gap-2'
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
            <div className="text-sm text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-lg w-full h-full min-h-[80px] flex items-center justify-center">
              Plan a sprint by dragging issues here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
