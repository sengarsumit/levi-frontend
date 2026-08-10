import { useState } from 'react';
import { useCreateCommentMutation } from '../../api/commentApi';
import { Box, TextField, Button, Stack } from '@mui/material';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

interface CommentBoxProps {
  issueId: number;
}

export function CommentBox({ issueId }: CommentBoxProps) {
  const [text, setText] = useState('');
  const [createComment, { isLoading }] = useCreateCommentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await createComment({ issueId, comment: text.trim() }).unwrap();
      setText('');
    } catch {
      toast.error('Failed to post comment');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      void handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          rows={3}
          fullWidth
          placeholder="Add a comment... (Ctrl+Enter to submit)"
        />
        <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            size="small"
            variant="contained"
            disabled={isLoading || !text.trim()}
            startIcon={<Send size={14} />}
          >
            {isLoading ? 'Posting...' : 'Comment'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
