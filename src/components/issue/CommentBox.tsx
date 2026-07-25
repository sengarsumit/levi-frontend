import { useState } from 'react';
import { useCreateCommentMutation } from '../../api/commentApi';
import { Button } from '@/components/ui/button';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      void handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        placeholder="Add a comment... (Ctrl+Enter to submit)"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
          placeholder:text-slate-400 transition-all"
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !text.trim()}
          className="flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          {isLoading ? 'Posting...' : 'Comment'}
        </Button>
      </div>
    </form>
  );
}
