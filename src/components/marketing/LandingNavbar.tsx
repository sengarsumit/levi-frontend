import { AppBar, Toolbar, Container, Box, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { KanbanSquare } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export function LandingNavbar() {
  return (
    <AppBar
      position="sticky"
      color="transparent"
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(247, 250, 249, 0.8)' : 'rgba(12, 22, 20, 0.8)',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <KanbanSquare size={26} strokeWidth={2.2} color="currentColor" />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Levi
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              component="a"
              href="#features"
              color="inherit"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Features
            </Button>
            <Button
              component="a"
              href="#roadmap"
              color="inherit"
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Roadmap
            </Button>
            <ThemeToggle />
            <Button component={RouterLink} to="/login" color="inherit">
              Sign in
            </Button>
            <Button component={RouterLink} to="/register" variant="contained" color="primary">
              Get started
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
