export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: number;
  issueType: string;
  assignedTo?: string;
  assignedBy?: string;
  projectId: number;
  workflowStateId?: number;
  boardId?: number;
  sprintId?: number;
  createdAt: string;
  updatedAt: string;
}
