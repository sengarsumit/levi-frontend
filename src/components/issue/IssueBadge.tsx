interface IssueBadgeProps {
  type: string;
}

interface PriorityBadgeProps {
  priority?: string;
}

const issueTypeConfig: Record<string, { label: string; color: string }> = {
  BUG: { label: 'Bug', color: 'bg-red-100 text-red-700' },
  TASK: { label: 'Task', color: 'bg-blue-100 text-blue-700' },
  STORY: { label: 'Story', color: 'bg-purple-100 text-purple-700' },
};

export function IssueTypeBadge({ type }: IssueBadgeProps) {
  const config = issueTypeConfig[type?.toUpperCase()] ?? { label: type, color: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${config.color}`}>
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config: Record<string, { label: string; dot: string }> = {
    HIGH: { label: 'High', dot: 'bg-red-500' },
    MEDIUM: { label: 'Medium', dot: 'bg-yellow-500' },
    LOW: { label: 'Low', dot: 'bg-green-500' },
  };
  const c = config[priority?.toUpperCase() ?? ''] ?? { label: priority ?? '—', dot: 'bg-slate-400' };
  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
