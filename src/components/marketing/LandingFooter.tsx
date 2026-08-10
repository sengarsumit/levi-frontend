import { Box, Container, Stack, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { KanbanSquare, ArrowRight } from 'lucide-react';

export function LandingFooter() {
  return (
    <Box component="footer" sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack
          spacing={3}
          sx={{
            alignItems: 'center',
            textAlign: 'center',
            py: { xs: 6, md: 8 },
            borderBottom: 1,
            borderColor: 'divider',
            mb: 4,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Ready to organize your team's work?
          </Typography>
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
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <KanbanSquare size={18} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Levi — a project management workspace
            </Typography>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Built with React, Spring Boot & MySQL
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
