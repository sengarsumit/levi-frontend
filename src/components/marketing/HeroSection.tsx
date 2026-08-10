import { Box, Container, Stack, Typography, Button, Paper, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { ArrowRight } from 'lucide-react';

const columns: { title: string; color: 'default' | 'info' | 'success'; cards: string[] }[] = [
  { title: 'To Do', color: 'default', cards: ['Design onboarding flow', 'Set up CI pipeline'] },
  { title: 'In Progress', color: 'info', cards: ['Kanban drag & drop', 'Org approval workflow'] },
  { title: 'Done', color: 'success', cards: ['Auth & JWT', 'Multi-tenant orgs'] },
];

export function HeroSection() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'radial-gradient(60% 60% at 50% 0%, rgba(13,148,136,0.10) 0%, rgba(247,250,249,0) 70%)'
            : 'radial-gradient(60% 60% at 50% 0%, rgba(45,212,191,0.14) 0%, rgba(12,22,20,0) 70%)',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Chip
            label="Now live — free to try"
            color="secondary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, maxWidth: 780, fontSize: { xs: '2.25rem', md: '3.25rem' }, lineHeight: 1.15 }}
          >
            Project management for teams who'd rather ship than configure.
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 620 }}>
            Levi is a multi-tenant, Jira-style workspace: organizations, projects, Kanban boards,
            and sprint planning with live updates — built to stay out of your way.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={RouterLink}
              to="/register"
              size="large"
              variant="contained"
              color="primary"
              endIcon={<ArrowRight size={18} />}
            >
              Create your workspace
            </Button>
            <Button component={RouterLink} to="/login" size="large" variant="outlined" color="inherit">
              Sign in
            </Button>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              mt: 6,
              width: '100%',
              maxWidth: 820,
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              boxShadow: (theme) =>
                theme.palette.mode === 'light'
                  ? '0 24px 60px -24px rgba(13,148,136,0.35)'
                  : '0 24px 60px -24px rgba(0,0,0,0.6)',
            }}
          >
            <Stack direction="row" spacing={2}>
              {columns.map((col) => (
                <Box key={col.title} sx={{ flex: 1, textAlign: 'left' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: col.color === 'default' ? 'text.secondary' : `${col.color}.main`,
                      }}
                    />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {col.title.toUpperCase()}
                    </Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {col.cards.map((card) => (
                      <Paper
                        key={card}
                        variant="outlined"
                        sx={{ p: 1.25, borderRadius: 2, bgcolor: 'background.default' }}
                      >
                        <Typography variant="body2">{card}</Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
