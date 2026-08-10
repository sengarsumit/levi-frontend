import { useGetIssueByIdQuery, useUpdateIssueMutation, useDeleteIssueMutation, useAssignIssueMutation } from '../../api/issueApi';
import { useGetUsersQuery } from '../../api/userApi';
import { ActivityFeed } from './ActivityFeed';
import { IssueTypeBadge } from './IssueBadge';
import { X, Trash2, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Drawer,
  Box,
  Stack,
  Typography,
  TextField,
  IconButton,
  Button,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
  Divider,
} from '@mui/material';

interface IssueDrawerProps {
  issueId: number | null;
  projectId: number;
  onClose: () => void;
}

type Tab_ = 'details' | 'activity';

export function IssueDrawer({ issueId, projectId, onClose }: IssueDrawerProps) {
  const { data: issue, isLoading, error } = useGetIssueByIdQuery(issueId!, { skip: !issueId });
  const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
  const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();
  const [assignIssue, { isLoading: isAssigning }] = useAssignIssueMutation();
  const { data: users = [] } = useGetUsersQuery();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<Tab_>('details');

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
    <Drawer anchor="right" open={!!issueId} onClose={onClose} slotProps={{ paper: { sx: { width: { xs: '100%', sm: 480 } } } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            {issue && <IssueTypeBadge type={issue.issueType} />}
            <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
              #{issueId}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            <IconButton size="small" color="error" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 size={16} />
            </IconButton>
            <IconButton size="small" onClick={onClose}>
              <X size={16} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="fullWidth">
          <Tab value="details" label="Details" />
          <Tab value="activity" label="Activity" />
        </Tabs>
        <Divider />

        {/* Body */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
          {isLoading ? (
            <Stack spacing={1.5}>
              <Skeleton variant="rounded" height={32} />
              <Skeleton variant="rounded" height={96} />
            </Stack>
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                This issue doesn't exist, or isn't assigned to you.
              </Typography>
            </Box>
          ) : issue ? (
            activeTab === 'details' ? (
              <Stack spacing={2.5}>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={5}
                  fullWidth
                  placeholder="Add a description..."
                />

                {/* Metadata */}
                <Stack spacing={1.5} sx={{ pt: 1, borderTop: 1, borderColor: 'divider' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Type</Typography>
                    <IssueTypeBadge type={issue.issueType} />
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Assignee</Typography>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={issue.assignedTo ?? ''}
                        onChange={(e) => handleAssign(e.target.value)}
                        disabled={isAssigning}
                      >
                        <MenuItem value="">Unassigned</MenuItem>
                        {users.map((u) => (
                          <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                  {issue.createdAt && (
                    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Created</Typography>
                      <Typography variant="body2">{format(new Date(issue.createdAt), 'MMM d, yyyy')}</Typography>
                    </Stack>
                  )}
                  {issue.updatedAt && (
                    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Updated</Typography>
                      <Typography variant="body2">{format(new Date(issue.updatedAt), 'MMM d, yyyy')}</Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            ) : (
              <ActivityFeed issueId={issue.id} />
            )
          ) : null}
        </Box>

        {/* Footer — only shown on details tab */}
        {activeTab === 'details' && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Save size={16} />}
              onClick={handleSave}
              disabled={isUpdating || isLoading || !issue}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
