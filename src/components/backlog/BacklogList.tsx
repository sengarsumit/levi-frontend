import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Stack, Typography, Chip } from '@mui/material';
import type { Issue } from '../../types';
import { IssueCard } from '../issue/IssueCard';

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
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          📋 Backlog
        </Typography>
        <Chip label={`${issues.length} issues`} size="small" />
      </Stack>

      <Stack ref={setNodeRef} spacing={1} sx={{ p: 1.5, minHeight: 150, justifyContent: issues.length === 0 ? 'center' : undefined }}>
        <SortableContext items={issues.map((i) => `issue-${i.id}`)} strategy={verticalListSortingStrategy}>
          {issues.length > 0 ? (
            issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} sortableId={`issue-${issue.id}`} onClick={onIssueClick} />
            ))
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
              Your backlog is empty. Create issues to plan your work.
            </Typography>
          )}
        </SortableContext>
      </Stack>
    </Box>
  );
}
