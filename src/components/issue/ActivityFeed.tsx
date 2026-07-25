import { useState } from 'react';
import { useGetCommentsByIssueQuery, useUpdateCommentMutation, useDeleteCommentMutation } from '../../api/commentApi';
import { useGetUsersQuery } from '../../api/userApi';
import { CommentBox } from './CommentBox';
import { getCurrentUserId } from '../../lib/jwt';
import { formatDistanceToNow } from 'date-fns';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="flex flex-col gap-4">
      {/* Comment thread */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 bg-slate-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                  <div className="h-10 bg-slate-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-4">
            No comments yet. Be the first to comment!
          </p>
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
              <div
                key={comment.id}
                className={`flex gap-3 group ${comment.replyTo ? 'ml-8 border-l-2 border-indigo-100 pl-3' : ''}`}
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  {getInitials(authorName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-700">{authorName}</span>
                    <span className="text-xs text-slate-400">
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                        : ''}
                    </span>
                    {isOwner && !isEditing && (
                      <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(comment.id, comment.comment)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows={2}
                        autoFocus
                        className="w-full rounded-md border border-indigo-300 px-2 py-1.5 text-sm resize-none
                          focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => saveEdit(comment.id)}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-500 text-white text-xs hover:bg-indigo-600 transition-colors"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs hover:bg-slate-200 transition-colors"
                        >
                          <X className="w-3 h-3" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-700 bg-slate-50 rounded-lg px-3 py-2 leading-relaxed">
                      {comment.comment}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New comment input */}
      <div className="border-t border-slate-100 pt-4">
        <CommentBox issueId={issueId} />
      </div>
    </div>
  );
}
