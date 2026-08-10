import { useState } from 'react';
import { useGetCommentsByIssueQuery, useUpdateCommentMutation, useDeleteCommentMutation } from '../../api/commentApi';
import { useGetUsersQuery } from '../../api/userApi';
import { CommentBox } from './CommentBox';
import { getCurrentUserId } from '../../lib/jwt';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Box,
  Stack,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Button,
  Skeleton,
  Divider,
} from '@mui/material';

interface ActivityFeedProps {
  issueId: number;
}

export function ActivityFeed({ issueId }: ActivityFeedProps) {
  const { data: comments = [], isLoading } = useGetCommentsByIssueQuery(issueId);
  const { data: users = [] } = useGetUsersQuery(undefined);
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const currentUserId = getCurrentUserId();

  const getUserName = (userId: string) => {
    const user = users.find((u: { id: string; name: string }) => u.id === userId);
    return user?.name ?? 'Unknown';
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const startEdit = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id: number) => {
    try {
      await updateComment({ id, comment: editText, issueId }).unwrap();
      setEditingId(null);
    } catch {
      toast.error('Failed to update comment');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteComment({ id, issueId }).unwrap();
      toast.success('Comment deleted');
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <Stack spacing={2.5}>
      {/* Comment thread */}
      <Stack spacing={1.5}>
        {isLoading ? (
          <Stack spacing={1.5}>
            {[1, 2].map((i) => (
              <Stack key={i} direction="row" spacing={1.5}>
                <Skeleton variant="circular" width={32} height={32} />
                <Stack spacing={0.5} sx={{ flex: 1 }}>
                  <Skeleton variant="text" width={96} />
                  <Skeleton variant="rounded" height={40} />
                </Stack>
              </Stack>
            ))}
          </Stack>
        ) : comments.length === 0 ? (
          <Typography variant="caption" sx={{ color: 'text.disabled', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
            No comments yet. Be the first to comment!
          </Typography>
        ) : (
          comments.map((comment: {
            id: number;
            userId: string;
            comment: string;
            createdAt: string;
            replyTo?: number;
          }) => {
            const isOwner = comment.userId === currentUserId;
            const isEditing = editingId === comment.id;
            const authorName = getUserName(comment.userId);

            return (
              <Stack
                key={comment.id}
                direction="row"
                spacing={1.5}
                sx={comment.replyTo ? { ml: 4, pl: 1.5, borderLeft: 2, borderColor: 'primary.light' } : undefined}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 12,
                    fontWeight: 700,
                    mt: 0.25,
                    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
                  }}
                >
                  {getInitials(authorName)}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {authorName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                        : ''}
                    </Typography>
                    {isOwner && !isEditing && (
                      <Stack direction="row" spacing={0.25} sx={{ ml: 'auto' }}>
                        <IconButton size="small" onClick={() => startEdit(comment.id, comment.comment)}>
                          <Pencil size={12} />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(comment.id)}>
                          <Trash2 size={12} />
                        </IconButton>
                      </Stack>
                    )}
                  </Stack>

                  {isEditing ? (
                    <Stack spacing={1}>
                      <TextField
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        multiline
                        rows={2}
                        autoFocus
                        fullWidth
                        size="small"
                      />
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="contained" startIcon={<Check size={12} />} onClick={() => saveEdit(comment.id)}>
                          Save
                        </Button>
                        <Button size="small" color="inherit" startIcon={<X size={12} />} onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </Stack>
                    </Stack>
                  ) : (
                    <Box sx={{ bgcolor: 'action.hover', borderRadius: 2, px: 1.5, py: 1 }}>
                      <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                        {comment.comment}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Stack>
            );
          })
        )}
      </Stack>

      <Divider />
      <CommentBox issueId={issueId} />
    </Stack>
  );
}
