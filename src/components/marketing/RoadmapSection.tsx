import { Box, Container, Typography, Grid, Paper, Stack, Chip } from '@mui/material';
import { BarChart3, UsersRound, UserPlus, Palette } from 'lucide-react';
import type { ComponentType } from 'react';

interface RoadmapItem {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  title: string;
  description: string;
}

const roadmap: RoadmapItem[] = [
  {
    icon: BarChart3,
    title: 'Productivity dashboard',
    description:
      'The backend already computes assigned → started → completed timing against each teammate’s working hours — a UI to actually see it is next.',
  },
  {
    icon: UsersRound,
    title: 'Project-level membership',
    description: 'Roster specific teammates onto individual projects, not just the organization as a whole.',
  },
  {
    icon: UserPlus,
    title: 'Role selection at signup',
    description: 'Pick the role you’re requesting when you ask to join a workspace, for the admin to confirm.',
  },
  {
    icon: Palette,
    title: 'Per-organization theming',
    description: 'Custom branding and login-page styling, unique to each workspace.',
  },
];

export function RoadmapSection() {
  return (
    <Box
      id="roadmap"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.50' : 'background.paper'),
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={1.5} sx={{ alignItems: 'center', textAlign: 'center', mb: 6 }}>
          <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: 1.2 }}>
            Coming soon
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '1.75rem', md: '2.25rem' } }}>
            What's being built next
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 560 }}>
            Levi is under active development. Here's what's on the roadmap.
          </Typography>
        </Stack>

        <Grid container spacing={3}>
          {roadmap.map(({ icon: Icon, title, description }) => (
            <Grid key={title} size={{ xs: 12, sm: 6 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'flex-start', height: '100%' }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: 'secondary.main',
                    color: 'secondary.contrastText',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} strokeWidth={2.2} />
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {title}
                    </Typography>
                    <Chip label="Planned" size="small" variant="outlined" color="secondary" />
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
