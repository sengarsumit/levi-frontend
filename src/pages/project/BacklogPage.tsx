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
import { IssueCard } from '../../components/issue/IssueCard';
import { IssueDrawer } from '../../components/issue/IssueDrawer';
import type { Issue } from '../../types';
import { Box, Stack, Typography, Button, Skeleton } from '@mui/material';

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

  if (loadingSprints || loadingIssues) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="text" width={192} height={40} />
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 3 }} />
      </Stack>
    );
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Backlog</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Plan sprints and prioritize work
          </Typography>
        </Box>
        <Button variant="outlined" color="inherit" onClick={handleCreateSprint}>
          Create Sprint
        </Button>
      </Stack>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Stack spacing={3}>
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
        </Stack>

        <DragOverlay>
          {activeIssue ? (
            <Box sx={{ transform: 'rotate(2deg)', opacity: 0.9 }}>
              <IssueCard issue={activeIssue} sortableId={`issue-${activeIssue.id}`} />
            </Box>
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
    </Box>
  );
}
