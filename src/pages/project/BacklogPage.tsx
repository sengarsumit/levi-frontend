import { useState, useMemo } from 'react';
import { useParams } from 'react-router';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useGetSprintsByProjectQuery, useCreateSprintMutation, useUpdateSprintMutation } from '../../api/sprintApi';
import { useGetIssuesByProjectQuery, useUpdateIssueMutation, issueApi } from '../../api/issueApi';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../../hooks/useWebSocket';
import SprintSection from '../../components/backlog/SprintSection';
import BacklogList from '../../components/backlog/BacklogList';
import IssueCard from '../../components/issue/IssueCard';
import { IssueDrawer } from '../../components/issue/IssueDrawer';
import type { Issue } from '../../types';

export default function BacklogPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? Number(id) : 0;
  const dispatch = useDispatch();

  // Listen for real-time issue updates
  useWebSocket(projectId, (_message) => {
    dispatch(issueApi.util.invalidateTags(['Issue']));
    // Optional: toast.info(`Issue updated: ${message.title}`);
  });

  const { data: sprints = [], isLoading: loadingSprints } = useGetSprintsByProjectQuery(projectId);
  const { data: allIssues = [], isLoading: loadingIssues } = useGetIssuesByProjectQuery(projectId);
  
  const [createSprint] = useCreateSprintMutation();
  const [updateSprint] = useUpdateSprintMutation();
  const [updateIssue] = useUpdateIssueMutation();

  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Group issues
  const backlogIssues = useMemo(() => allIssues.filter((i: Issue) => !i.sprintId), [allIssues]);
  const issuesBySprint = useMemo(() => {
    const map = new Map<number, Issue[]>();
    sprints.forEach(s => map.set(s.id, []));
    allIssues.forEach((i: Issue) => {
      if (i.sprintId && map.has(i.sprintId)) {
        map.get(i.sprintId)!.push(i);
      }
    });
    return map;
  }, [allIssues, sprints]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const issueId = Number(active.id.toString().replace('issue-', ''));
    const issue = allIssues.find((i: Issue) => i.id === issueId);
    if (issue) setActiveIssue(issue);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveIssue(null);
    const { active, over } = event;
    if (!over) return;

    const issueId = Number(active.id.toString().replace('issue-', ''));
    const issue = allIssues.find((i: Issue) => i.id === issueId);
    if (!issue) return;

    let targetSprintId: number | undefined = undefined;

    if (over.id === 'backlog') {
      targetSprintId = undefined;
    } else if (over.id.toString().startsWith('sprint-')) {
      targetSprintId = Number(over.id.toString().replace('sprint-', ''));
    } else if (over.id.toString().startsWith('issue-')) {
      const overIssueId = Number(over.id.toString().replace('issue-', ''));
      const overIssue = allIssues.find((i: Issue) => i.id === overIssueId);
      if (overIssue) {
        targetSprintId = overIssue.sprintId || undefined;
      }
    }

    if (issue.sprintId !== targetSprintId) {
      updateIssue({ ...issue, sprintId: targetSprintId });
    }
  };

  const handleCreateSprint = () => {
    const sprintCount = sprints.length + 1;
    createSprint({
      name: `Sprint ${sprintCount}`,
      projectId,
    });
  };

  if (loadingSprints || loadingIssues) return <div className="p-8">Loading backlog...</div>;

  return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backlog</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Plan sprints and prioritize work</p>
          </div>
          <button
            onClick={handleCreateSprint}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-colors"
          >
            Create Sprint
          </button>
        </div>

        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-6">
            {sprints.map(sprint => (
              <SprintSection
                key={sprint.id}
                sprint={sprint}
                issues={issuesBySprint.get(sprint.id) || []}
                onStartSprint={() => updateSprint({ ...sprint, status: 'ACTIVE' })}
                onCompleteSprint={() => updateSprint({ ...sprint, status: 'COMPLETED' })}
                onIssueClick={setSelectedIssue}
              />
            ))}

            <BacklogList
              issues={backlogIssues}
              onIssueClick={setSelectedIssue}
            />
          </div>

          <DragOverlay>
            {activeIssue ? (
              <div className="opacity-90 transform rotate-2">
                <IssueCard issue={activeIssue} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {selectedIssue && (
          <IssueDrawer
            issueId={selectedIssue.id}
            projectId={projectId}
            onClose={() => setSelectedIssue(null)}
          />
        )}
      </div>
  );
}
