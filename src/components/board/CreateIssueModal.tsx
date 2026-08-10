import { useState } from 'react';
import { useCreateIssueMutation } from '../../api/issueApi';
import { useGetUsersQuery } from '../../api/userApi';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';

interface CreateIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  boardId: number;
  workflowStateId: number;
  workflowStateName: string;
}

export function CreateIssueModal({
  open,
  onOpenChange,
  projectId,
  boardId,
  workflowStateId,
  workflowStateName,
}: CreateIssueModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<'TASK' | 'BUG' | 'STORY'>('TASK');
  const [assignedTo, setAssignedTo] = useState('');

  const [createIssue, { isLoading }] = useCreateIssueMutation();
  const { data: users = [] } = useGetUsersQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createIssue({
        title,
        description,
        issueType,
        projectId,
        boardId,
        workflowStateId,
        // Omit entirely rather than sending an empty string when unassigned — the backend
        // only honors this field at all if the caller can assign (ISSUE_ASSIGN/ORG_ADMIN),
        // silently dropping it otherwise, so there's no case where sending it helps.
        ...(assignedTo ? { assignedTo } : {}),
      }).unwrap();

      toast.success('Issue created successfully');
      setTitle('');
      setDescription('');
      setIssueType('TASK');
      setAssignedTo('');
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to create issue');
    }
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Issue</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Add a new issue to <Typography component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{workflowStateName}</Typography>
          </DialogContentText>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              fullWidth
              required
              label="Title"
              placeholder="Describe the issue..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="Optional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Type
              </Typography>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={issueType}
                onChange={(_, val) => val && setIssueType(val)}
              >
                <ToggleButton value="TASK">Task</ToggleButton>
                <ToggleButton value="BUG">Bug</ToggleButton>
                <ToggleButton value="STORY">Story</ToggleButton>
              </ToggleButtonGroup>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="issue-assignee-label">Assignee</InputLabel>
              <Select
                labelId="issue-assignee-label"
                label="Assignee"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !title.trim()}>
            {isLoading ? 'Creating...' : 'Create Issue'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
