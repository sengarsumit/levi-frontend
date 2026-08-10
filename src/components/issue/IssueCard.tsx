import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paper, Stack, Typography, Box } from '@mui/material';
import { GripVertical } from 'lucide-react';
import { IssueTypeBadge } from './IssueBadge';
import { AssigneeAvatar } from './AssigneeAvatar';
import type { Issue } from '../../types';

interface IssueCardProps {
  issue: Issue;
  // The Kanban board and the Backlog/Sprint views each run their own separate dnd-kit
  // DndContext with different id-namespacing needs (Backlog's context also has "sprint-N"
  // and "backlog" droppable ids in the same space, so its issues need an "issue-N" prefix
  // to disambiguate; the board's context has no such collision and uses the plain numeric
  // id) — the caller decides which id shape applies, this component just renders.
  sortableId: string | number;
  onClick?: (issue: Issue) => void;
}

export function IssueCard({ issue, sortableId, onClick }: IssueCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      variant="outlined"
      onClick={() => onClick?.(issue)}
      sx={{
        p: 1.5,
        borderRadius: 2,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        "&:hover": { boxShadow: 2, borderColor: 'primary.light' },
        ...(isDragging && {
          opacity: 0.5,
          boxShadow: 4,
          outline: '2px solid',
          outlineColor: 'primary.main',
          position: 'relative',
          zIndex: 1,
        }),
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
        <Box
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          sx={{
            mt: 0.25,
            color: 'text.disabled',
            cursor: 'grab',
            display: 'flex',
            flexShrink: 0,
            '&:active': { cursor: 'grabbing' },
            '&:hover': { color: 'text.secondary' },
          }}
        >
          <GripVertical size={16} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {issue.title}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <IssueTypeBadge type={issue.issueType} />
          </Box>
        </Box>
      </Stack>
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mt: 1 }}>
        <AssigneeAvatar assignedTo={issue.assignedTo} />
      </Stack>
    </Paper>
  );
}
