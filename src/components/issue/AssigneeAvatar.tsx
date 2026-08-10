import { User } from 'lucide-react';
import { Avatar, Tooltip, Box } from '@mui/material';
import { useGetUsersQuery } from '../../api/userApi';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EC4899', '#06B6D4', '#A855F7'];

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
// prop-drilling needed through KanbanBoard -> KanbanColumn -> IssueCard for this.
export function AssigneeAvatar({ assignedTo }: AssigneeAvatarProps) {
  const { data: users = [] } = useGetUsersQuery();

  if (!assignedTo) {
    return (
      <Box sx={{ color: 'text.disabled', display: 'flex' }} aria-label="Unassigned">
        <User size={14} />
      </Box>
    );
  }

  // Falls back gracefully for a stale/dangling assignedTo (e.g. a user removed from the
  // org since) rather than rendering blank.
  const user = users.find((u) => u.id === assignedTo);
  const name = user?.name ?? 'Unknown user';

  return (
    <Tooltip title={name}>
      <Avatar
        sx={{
          width: 20,
          height: 20,
          fontSize: 9,
          fontWeight: 700,
          bgcolor: colorFor(assignedTo),
          flexShrink: 0,
        }}
      >
        {initials(name)}
      </Avatar>
    </Tooltip>
  );
}
