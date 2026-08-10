import { Chip, Stack, Box, Typography } from '@mui/material';
import type { ChipProps } from '@mui/material';

interface IssueBadgeProps {
  type: string;
}

interface PriorityBadgeProps {
  priority?: string;
}

const issueTypeConfig: Record<string, { label: string; color: ChipProps['color'] }> = {
  BUG: { label: 'Bug', color: 'error' },
  TASK: { label: 'Task', color: 'info' },
  STORY: { label: 'Story', color: 'secondary' },
};

export function IssueTypeBadge({ type }: IssueBadgeProps) {
  const config = issueTypeConfig[type?.toUpperCase()] ?? { label: type, color: 'default' as const };
  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      sx={{ fontWeight: 600, height: 20, fontSize: 11 }}
    />
  );
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  HIGH: { label: 'High', color: 'error.main' },
  MEDIUM: { label: 'Medium', color: 'warning.main' },
  LOW: { label: 'Low', color: 'success.main' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const c = priorityConfig[priority?.toUpperCase() ?? ''] ?? { label: priority ?? '—', color: 'text.disabled' };
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', color: 'text.secondary' }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: c.color }} />
      <Typography variant="caption">{c.label}</Typography>
    </Stack>
  );
}
