import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, Stack, Typography, IconButton, Button } from '@mui/material';
import { IssueCard } from '../issue/IssueCard';
import { CreateIssueModal } from './CreateIssueModal';
import { Plus } from 'lucide-react';
import type { Issue } from '../../types';

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

const columnAccent: Record<string, string> = {
  'To Do': 'text.disabled',
  'In Progress': 'info.main',
  'Done': 'success.main',
};

export function KanbanColumn({ column, issues, projectId, boardId, onCardClick }: KanbanColumnProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const accent = columnAccent[column.name] ?? 'text.disabled';

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: 1,
          borderColor: 'divider',
          borderTop: 3,
          borderTopColor: accent,
          bgcolor: 'background.paper',
          minWidth: 280,
          maxWidth: 320,
          width: '100%',
          transition: 'background-color 0.15s ease',
          ...(isOver && { bgcolor: 'action.hover' }),
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: accent }}>
              {column.name}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled' }}>
              {issues.length}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={() => setShowCreateModal(true)} title="Add issue">
            <Plus size={16} />
          </IconButton>
        </Stack>

        <Stack spacing={1} sx={{ flex: 1, p: 1.5, minHeight: 120 }} ref={setNodeRef}>
          <SortableContext items={issues.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} sortableId={issue.id} onClick={onCardClick} />
            ))}
          </SortableContext>
          {issues.length === 0 && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                Drop issues here
              </Typography>
            </Box>
          )}
        </Stack>

        <Box sx={{ px: 1.5, pb: 1.5 }}>
          <Button
            fullWidth
            size="small"
            variant="outlined"
            color="inherit"
            startIcon={<Plus size={14} />}
            onClick={() => setShowCreateModal(true)}
            sx={{ borderStyle: 'dashed', color: 'text.secondary' }}
          >
            Add Issue
          </Button>
        </Box>
      </Box>

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
