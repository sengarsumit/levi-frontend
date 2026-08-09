import { useGetIssueByIdQuery, useUpdateIssueMutation, useDeleteIssueMutation, useAssignIssueMutation } from '../../api/issueApi';
import { useGetUsersQuery } from '../../api/userApi';
import { ActivityFeed } from './ActivityFeed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IssueTypeBadge } from './IssueBadge';
import { X, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface IssueDrawerProps {
  issueId: number | null;
  projectId: number;
  onClose: () => void;
}

type Tab = 'details' | 'activity';

export function IssueDrawer({ issueId, projectId, onClose }: IssueDrawerProps) {
  const { data: issue, isLoading, error } = useGetIssueByIdQuery(issueId!, { skip: !issueId });
  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const [assignIssue, { isLoading: isAssigning }] = useAssignIssueMutation();
  const { data: users = [] } = useGetUsersQuery();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('details');

  useEffect(() => {
    if (issue) {
      setTitle(issue.title ?? '');
      setDescription(issue.description ?? '');
    }
  }, [issue]);

  // Reset tab when opening a new issue
  useEffect(() => {
    if (issueId) setActiveTab('details');
  }, [issueId]);

  const handleSave = async () => {
    if (!issue) return;
    try {
      await updateIssue({
        id: issue.id,
        title,
        description,
        issueType: issue.issueType,
        projectId,
        workflowStateId: issue.workflowStateId,
        boardId: issue.boardId,
      }).unwrap();
      toast.success('Issue updated');
    } catch {
      toast.error('Failed to update issue');
    }
  };

  const handleDelete = async () => {
    if (!issue) return;
    try {
      await deleteIssue(issue.id).unwrap();
      toast.success('Issue deleted');
      onClose();
    } catch {
      toast.error('Failed to delete issue');
    }
  };

  // Its own action, independent of "Save Changes" — mirrors the backend's deliberate split
  // between ISSUE_UPDATE (title/description) and ISSUE_ASSIGN (this), rather than blurring
  // that permission boundary in the UI.
  const handleAssign = async (newAssignedTo: string) => {
    if (!issue) return;
    try {
      await assignIssue({ id: issue.id, assignedTo: newAssignedTo || null }).unwrap();
      toast.success('Assignee updated');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "You don't have permission to assign this issue");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {issueId && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300
          ${issueId ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2">
            {issue && <IssueTypeBadge type={issue.issueType} />}
            <span className="text-xs text-slate-400 font-mono">#{issueId}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0">
          {(['details', 'activity'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors
                ${activeTab === tab
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-8 bg-slate-100 rounded animate-pulse" />
              <div className="h-24 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500">
                This issue doesn't exist, or isn't assigned to you.
              </p>
            </div>
          ) : issue ? (
            activeTab === 'details' ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="drawer-title">Title</Label>
                  <Input
                    id="drawer-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drawer-desc">Description</Label>
                  <textarea
                    id="drawer-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Add a description..."
                  />
                </div>

                {/* Metadata */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Type</span>
                    <IssueTypeBadge type={issue.issueType} />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Assignee</span>
                    <select
                      value={issue.assignedTo ?? ''}
                      onChange={(e) => handleAssign(e.target.value)}
                      disabled={isAssigning}
                      className="h-8 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-700"
                    >
                      <option value="">Unassigned</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                  {issue.createdAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Created</span>
                      <span className="text-slate-700">
                        {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                  {issue.updatedAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Updated</span>
                      <span className="text-slate-700">
                        {format(new Date(issue.updatedAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ActivityFeed issueId={issue.id} />
            )
          ) : null}
        </div>

        {/* Footer — only shown on details tab */}
        {activeTab === 'details' && (
          <div className="p-4 border-t border-slate-200 shrink-0">
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={isUpdating || isLoading || !issue}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
