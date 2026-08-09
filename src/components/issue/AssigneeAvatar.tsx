import { User } from 'lucide-react';
import { useGetUsersQuery } from '../../api/userApi';

const COLORS = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-purple-500'];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

function colorFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AssigneeAvatarProps {
  assignedTo?: string;
}

// Calling useGetUsersQuery() here rather than threading a shared list down as a prop is
// deliberate: RTK Query dedupes identical concurrent queries and shares the cached result,
// so every card on a board resolves against one real network request, not one each — no
// prop-drilling needed through KanbanBoard -> KanbanColumn -> KanbanCard for this.
export function AssigneeAvatar({ assignedTo }: AssigneeAvatarProps) {
  const { data: users = [] } = useGetUsersQuery();

  if (!assignedTo) {
    return <User className="w-3.5 h-3.5 text-slate-400" aria-label="Unassigned" />;
  }

  // Falls back gracefully for a stale/dangling assignedTo (e.g. a user removed from the
  // org since) rather than rendering blank.
  const user = users.find((u) => u.id === assignedTo);
  const name = user?.name ?? 'Unknown user';

  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0 ${colorFor(assignedTo)}`}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
