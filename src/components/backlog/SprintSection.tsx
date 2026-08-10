import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Stack, Typography, Chip, Button } from '@mui/material';
import type { Issue } from '../../types';
import type { Sprint } from '../../api/sprintApi';
import { IssueCard } from '../issue/IssueCard';

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
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 1 }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            🏃 {sprint.name}
          </Typography>
          <Chip label={`${issues.length} issues`} size="small" />
          {sprint.status === 'ACTIVE' && (
            <Chip label="Active Sprint" size="small" color="primary" />
          )}
        </Stack>
        <Box>
          {sprint.status === 'PLANNED' && (
            <Button size="small" variant="contained" onClick={onStartSprint} disabled={issues.length === 0}>
              Start Sprint
            </Button>
          )}
          {sprint.status === 'ACTIVE' && (
            <Button size="small" variant="contained" color="success" onClick={onCompleteSprint}>
              Complete Sprint
            </Button>
          )}
        </Box>
      </Stack>

      <Stack
        ref={setNodeRef}
        spacing={1}
        sx={{ p: 1.5, minHeight: 100, justifyContent: issues.length === 0 ? 'center' : undefined }}
      >
        <SortableContext items={issues.map((i) => `issue-${i.id}`)} strategy={verticalListSortingStrategy}>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} sortableId={`issue-${issue.id}`} onClick={onIssueClick} />
            ))
          ) : (
            <Box
              sx={{
                border: 2,
                borderStyle: 'dashed',
                borderColor: 'divider',
                borderRadius: 2,
                width: '100%',
                minHeight: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Plan a sprint by dragging issues here
              </Typography>
            </Box>
          )}
        </SortableContext>
      </Stack>
    </Box>
  );
}
