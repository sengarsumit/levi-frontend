import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { IssueDrawer } from '../issue/IssueDrawer';
import { useMoveIssueMutation } from '../../api/issueApi';
import { toast } from 'sonner';

interface Issue {
  id: number;
  title: string;
  issueType: string;
  workflowStateId?: number;
}

interface WorkflowState {
  id: number;
  name: string;
  orderIndex: number;
}

interface KanbanBoardProps {
  columns: WorkflowState[];
  issues: Issue[];
  projectId: number;
  boardId: number;
}

export function KanbanBoard({ columns, issues, projectId, boardId }: KanbanBoardProps) {
  const [localIssues, setLocalIssues] = useState<Issue[]>(issues);
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [moveIssue] = useMoveIssueMutation();

  // Update localIssues when issues prop changes (RTK Query refetch)
  if (JSON.stringify(issues) !== JSON.stringify(localIssues)) {
    setLocalIssues(issues);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const getIssuesForColumn = (columnId: number) =>
    localIssues.filter((i) => i.workflowStateId === columnId);

  const handleDragStart = (event: DragStartEvent) => {
    const issue = localIssues.find((i) => i.id === event.active.id);
    setActiveIssue(issue ?? null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveIssue(null);

    if (!over) return;

    const issueId = active.id as number;
    const issue = localIssues.find((i) => i.id === issueId);
    if (!issue) return;

    // Determine target column: 'over' can be a column id or another issue id
    let targetColumnId: number | undefined;
    const overIsColumn = columns.some((c) => c.id === over.id);
    if (overIsColumn) {
      targetColumnId = over.id as number;
    } else {
      // over is an issue — find its column
      const overIssue = localIssues.find((i) => i.id === over.id);
      targetColumnId = overIssue?.workflowStateId;
    }

    if (!targetColumnId || targetColumnId === issue.workflowStateId) {
      // Same column: reorder locally
      if (!overIsColumn && over.id !== active.id) {
        const colIssues = getIssuesForColumn(issue.workflowStateId!);
        const oldIndex = colIssues.findIndex((i) => i.id === active.id);
        const newIndex = colIssues.findIndex((i) => i.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = arrayMove(colIssues, oldIndex, newIndex);
          setLocalIssues((prev) => [
            ...prev.filter((i) => i.workflowStateId !== issue.workflowStateId),
            ...reordered,
          ]);
        }
      }
      return;
    }

    // Optimistic update
    setLocalIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, workflowStateId: targetColumnId } : i))
    );

    // API call
    try {
      await moveIssue({ id: issueId, workflowStateId: targetColumnId }).unwrap();
    } catch {
      // Rollback
      setLocalIssues(issues);
      toast.error('Failed to move issue');
    }
  };

  const sortedColumns = [...columns].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-5 overflow-x-auto pb-4 items-start">
          {sortedColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              issues={getIssuesForColumn(column.id)}
              projectId={projectId}
              boardId={boardId}
              onCardClick={(issue) => setSelectedIssueId(issue.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeIssue ? (
            <div className="rotate-2 opacity-90">
              <KanbanCard issue={activeIssue} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <IssueDrawer
        issueId={selectedIssueId}
        projectId={projectId}
        onClose={() => setSelectedIssueId(null)}
      />
    </>
  );
}
