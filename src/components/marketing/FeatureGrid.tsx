import { Box, Container, Typography, Grid, Paper, Stack } from '@mui/material';
import {
  Building2,
  FolderKanban,
  KanbanSquare,
  ListChecks,
  UserCheck,
  ShieldCheck,
  MessageSquare,
  KeyRound,
  BarChart3,
  UsersRound,
  UserPlus,
} from 'lucide-react';
import type { ComponentType } from 'react';

interface Feature {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Building2,
    title: 'Organizations with approval-gated signup',
    description:
      'Anyone can request to join a workspace; an admin reviews and approves or rejects the request before access is granted.',
  },
  {
    icon: FolderKanban,
    title: 'Multiple projects per organization',
    description: 'Every workspace can hold as many projects as your team needs, each with its own board and backlog.',
  },
  {
    icon: KanbanSquare,
    title: 'Live Kanban boards',
    description:
      'Drag issues across workflow states with optimistic updates — changes push to every connected teammate over WebSocket in real time.',
  },
  {
    icon: ListChecks,
    title: 'Backlog & sprint planning',
    description: 'Groom the backlog and organize issues into sprints before they ever hit the board.',
  },
  {
    icon: UserCheck,
    title: 'Issue assignment with scoped visibility',
    description:
      "Assign issues to a specific teammate; non-admins see their own assigned work plus anything unclaimed, not the whole org's issue list.",
  },
  {
    icon: ShieldCheck,
    title: 'Role-based permissions',
    description: 'Admins get full control out of the box, and can define custom roles with exactly the permissions a teammate needs.',
  },
  {
    icon: MessageSquare,
    title: 'Comments on issues',
    description: 'Discuss the work where it happens, directly on the issue.',
  },
  {
    icon: KeyRound,
    title: 'Organization-specific sign-in',
    description: 'Every workspace gets its own dedicated login and signup URL.',
  },
  {
    icon: BarChart3,
    title: 'Productivity dashboard',
    description:
      'Completion-rate stats, average time-to-complete, and a per-teammate breakdown chart — computed against each person\'s actual working hours.',
  },
  {
    icon: UsersRound,
    title: 'Project-level membership',
    description: "Roster specific teammates onto individual projects — non-members don't see projects they're not part of.",
  },
  {
    icon: UserPlus,
    title: 'Role preference at signup',
    description: 'Request a specific role when asking to join a workspace; the admin sees it pre-filled and still makes the final call.',
  },
];

export function FeatureGrid() {
  return (
    <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1.2 }}>
            Available now
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            Everything below is real, working software
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
            Not a mockup — every feature here is implemented and running in the live app today.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {features.map(({ icon: Icon, title, description }) => (
            <Grid key={title} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 3,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'light'
                        ? '0 12px 24px -12px rgba(13,148,136,0.3)'
                        : '0 12px 24px -12px rgba(0,0,0,0.5)',
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    mb: 2,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
