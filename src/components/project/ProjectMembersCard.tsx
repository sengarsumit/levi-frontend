import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Box,
  IconButton,
  Autocomplete,
  TextField,
  Skeleton,
  Tooltip,
} from '@mui/material';
import { X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import {
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} from '../../api/projectMemberApi';
import { useGetActiveMembersQuery } from '../../api/organizationApi';
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

interface Props {
  projectId: number;
  organizationId?: number;
}

interface Candidate {
  userId: string;
  name: string;
}

export function ProjectMembersCard({ projectId, organizationId }: Props) {
  const { data: members = [], isLoading } = useGetProjectMembersQuery(projectId, { skip: !projectId });
  const { data: users = [] } = useGetUsersQuery();

  // A successful members/active response is itself the admin signal: that endpoint is
  // ORG_ADMIN-gated on the backend, so a 403 (isError) means the caller is a non-admin.
  // This avoids trusting the JWT's stale/optional permissions claim.
  const { data: activeMembers, isError: notAdmin } = useGetActiveMembersQuery(organizationId, {
    skip: !organizationId,
  });
  const isAdmin = Boolean(activeMembers) && !notAdmin;

  const [addMember, { isLoading: isAdding }] = useAddProjectMemberMutation();
  const [removeMember] = useRemoveProjectMemberMutation();
  const [selected, setSelected] = useState<Candidate | null>(null);

  const nameFor = (userId: string) => users.find((u) => u.id === userId)?.name ?? 'Unknown user';

  const candidates: Candidate[] = useMemo(() => {
    if (!activeMembers) return [];
    const existing = new Set(members.map((m) => m.userId));
    return (activeMembers as any[])
      .map((am) => ({ userId: am.user.id as string, name: am.user.name as string }))
      .filter((c) => !existing.has(c.userId));
  }, [activeMembers, members]);

  const handleAdd = async (candidate: Candidate | null) => {
    if (!candidate) return;
    try {
      await addMember({ projectId, userId: candidate.userId }).unwrap();
      toast.success(`Added ${candidate.name}`);
      setSelected(null);
    } catch {
      toast.error('Failed to add member');
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeMember({ projectId, userId }).unwrap();
      toast.success('Member removed');
    } catch {
      toast.error('Failed to remove member');
    }
  };

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          MEMBERS
        </Typography>

        {isAdmin && (
          <Stack direction="row" spacing={1} sx={{ mt: 1.5, alignItems: 'center' }}>
            <Autocomplete
              size="small"
              sx={{ flex: 1, maxWidth: 360 }}
              options={candidates}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(o, v) => o.userId === v.userId}
              value={selected}
              onChange={(_e, v) => {
                setSelected(v);
                handleAdd(v);
              }}
              disabled={isAdding}
              renderInput={(params) => (
                <TextField {...params} placeholder="Add a member…" />
              )}
              noOptionsText="No more org members to add"
            />
            <UserPlus size={18} style={{ opacity: 0.5 }} />
          </Stack>
        )}

        <Box sx={{ mt: 2 }}>
          {isLoading ? (
            <Stack spacing={1}>
              {[1, 2].map((i) => (
                <Skeleton key={i} variant="rounded" height={36} />
              ))}
            </Stack>
          ) : members.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No members yet.
            </Typography>
          ) : (
            <Stack spacing={1}>
              {members.map((m) => {
                const name = nameFor(m.userId);
                return (
                  <Stack
                    key={m.userId}
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        fontSize: 11,
                        fontWeight: 700,
                        bgcolor: colorFor(m.userId),
                      }}
                    >
                      {initials(name)}
                    </Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                      {name}
                    </Typography>
                    {isAdmin && (
                      <Tooltip title="Remove from project">
                        <IconButton size="small" onClick={() => handleRemove(m.userId)}>
                          <X size={16} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
