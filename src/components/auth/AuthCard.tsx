import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { KanbanSquare } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3 }}>
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', textDecoration: 'none', color: 'text.primary' }}
        >
          <KanbanSquare size={22} strokeWidth={2.2} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Levi
          </Typography>
        </Stack>
        <ThemeToggle />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Card variant="outlined" sx={{ width: '100%', maxWidth: 420, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={0.5} sx={{ mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {description}
              </Typography>
            </Stack>
            {children}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
