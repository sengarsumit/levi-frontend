import { useParams, Link } from 'react-router';
import { useGetBoardsByProjectQuery, useCreateBoardMutation } from '../../api/boardApi';
import { useGetIssuesByBoardQuery, issueApi } from '../../api/issueApi';
import { useGetWorkflowStatesByBoardQuery } from '../../api/workflowStateApi';
import { useDispatch } from 'react-redux';
import { useWebSocket } from '../../hooks/useWebSocket';
import { KanbanBoard } from '../../components/board/KanbanBoard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Kanban } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

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
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Link to={`/projects/${projectId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Project
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Kanban className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {board?.name ?? 'Board'}
            </h1>
            <p className="text-xs text-slate-500">
              {workflowStates.length} columns · {issues.length} issues
            </p>
          </div>
        </div>
      </div>

      {/* Board content */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm">
              {autoCreating || creating ? 'Setting up your board...' : 'Loading board...'}
            </p>
          </div>
        </div>
      ) : board && workflowStates.length > 0 ? (
        <div className="flex-1 overflow-hidden">
          <KanbanBoard
            columns={workflowStates}
            issues={issues}
            projectId={numericProjectId}
            boardId={boardId!}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Kanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Board is being set up...</p>
          </div>
        </div>
      )}
    </div>
  );
}
