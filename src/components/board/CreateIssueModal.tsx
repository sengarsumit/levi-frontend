import { useState } from 'react';
import { useCreateIssueMutation } from '../../api/issueApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

  const [createIssue, { isLoading }] = useCreateIssueMutation();

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
      }).unwrap();

      toast.success('Issue created successfully');
      setTitle('');
      setDescription('');
      setIssueType('TASK');
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || 'Failed to create issue');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Issue</DialogTitle>
            <DialogDescription>
              Add a new issue to <span className="font-semibold text-slate-700">{workflowStateName}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="issue-title">Title</Label>
              <Input
                id="issue-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Describe the issue..."
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-description">Description</Label>
              <Input
                id="issue-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-type">Type</Label>
              <div className="flex gap-2">
                {(['TASK', 'BUG', 'STORY'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setIssueType(t)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                      issueType === t
                        ? t === 'BUG'
                          ? 'bg-red-100 text-red-700 border-red-300'
                          : t === 'STORY'
                          ? 'bg-purple-100 text-purple-700 border-purple-300'
                          : 'bg-blue-100 text-blue-700 border-blue-300'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? 'Creating...' : 'Create Issue'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
