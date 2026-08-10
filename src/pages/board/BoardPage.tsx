import { useParams, Link } from 'react-router';
import { useGetBoardsByProjectQuery, useCreateBoardMutation } from '../../api/boardApi';
import { useGetIssuesByBoardQuery, issueApi } from '../../api/issueApi';
import { useGetWorkflowStatesByBoardQuery } from '../../api/workflowStateApi';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../../hooks/useWebSocket';
import { KanbanBoard } from '../../components/board/KanbanBoard';
import { ArrowLeft, Kanban } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Box, Stack, Typography, Button, CircularProgress } from '@mui/material';

export default function BoardPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const numericProjectId = Number(projectId);
  const dispatch = useDispatch();

  // Listen for real-time issue updates
  useWebSocket(numericProjectId, (message) => {
    // We can be more granular, but for now invalidating the Issue tag is easiest
    dispatch(issueApi.util.invalidateTags(['Issue']));
    toast.info(`Issue updated: ${message.title}`);
  });

  const {
    data: boards,
    isLoading: boardsLoading,
    refetch: refetchBoards,
  } = useGetBoardsByProjectQuery(numericProjectId);

  const [createBoard, { isLoading: creating }] = useCreateBoardMutation();
  const [autoCreating, setAutoCreating] = useState(false);

  const board = boards?.[0];
  const boardId = board?.id;

  // Auto-create default board if none exists
  useEffect(() => {
    if (!boardsLoading && boards !== undefined && boards.length === 0 && !autoCreating) {
      setAutoCreating(true);
      createBoard({ name: 'Main Board', projectId: numericProjectId })
        .unwrap()
        .then(() => {
          refetchBoards();
          toast.success('Default board created with To Do, In Progress, and Done columns');
        })
        .catch(() => toast.error('Failed to create default board'))
        .finally(() => setAutoCreating(false));
    }
  }, [boards, boardsLoading, createBoard, numericProjectId, autoCreating, refetchBoards]);

  const { data: workflowStates = [], isLoading: columnsLoading } =
    useGetWorkflowStatesByBoardQuery(boardId!, { skip: !boardId });

  const { data: issues = [], isLoading: issuesLoading } =
    useGetIssuesByBoardQuery(boardId!, { skip: !boardId });

  const isLoading = boardsLoading || columnsLoading || issuesLoading || autoCreating || creating;

  return (
    <Stack spacing={2.5} sx={{ height: '100%' }}>
      {/* Header */}
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Button component={Link} to={`/projects/${projectId}`} size="small" color="inherit" startIcon={<ArrowLeft size={16} />}>
          Project
        </Button>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 1, borderRadius: 2, display: 'flex' }}>
            <Kanban size={20} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {board?.name ?? 'Board'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {workflowStates.length} columns · {issues.length} issues
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* Board content */}
      {isLoading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
            <CircularProgress size={32} />
            <Typography variant="body2">
              {autoCreating || creating ? 'Setting up your board...' : 'Loading board...'}
            </Typography>
          </Stack>
        </Box>
      ) : board && workflowStates.length > 0 ? (
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          <KanbanBoard
            columns={workflowStates}
            issues={issues}
            projectId={numericProjectId}
            boardId={boardId!}
          />
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Stack spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box sx={{ color: 'text.disabled', display: 'flex' }}>
              <Kanban size={48} />
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Board is being set up...
            </Typography>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
