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

export interface User {
  id: string;
  systemId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  organizationId: number;
  permissions: string[];
}

export interface OrganizationUser {
  id: number;
  organization: Organization;
  user: User;
  role?: Role;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
