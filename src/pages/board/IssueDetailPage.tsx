import { useParams, Link } from 'react-router';
import { useGetIssueByIdQuery } from '../../api/issueApi';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { IssueTypeBadge } from '../../components/issue/IssueBadge';
import { format } from 'date-fns';
import { Box, Stack, Typography, Button, Card, CardContent, Skeleton, Grid } from '@mui/material';

export default function IssueDetailPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const { data: issue, isLoading, error } = useGetIssueByIdQuery(Number(issueId));

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="text" width={192} height={40} />
        <Skeleton variant="rounded" height={256} sx={{ borderRadius: 3 }} />
      </Stack>
    );
  }

  if (error || !issue) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Issue not found</Typography>
        <Button component={Link} to="/projects" variant="outlined" startIcon={<ArrowLeft size={16} />} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 672, mx: 'auto' }}>
      <Box>
        <Button component={Link} to={`/projects/${issue.projectId}`} size="small" color="inherit" startIcon={<ArrowLeft size={16} />}>
          Back to Project
        </Button>
      </Box>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <IssueTypeBadge type={issue.issueType} />
              <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>
                #{issue.id}
              </Typography>
            </Stack>

            <Typography variant="h5" sx={{ fontWeight: 700 }}>{issue.title}</Typography>

            {issue.description && (
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                {issue.description}
              </Typography>
            )}

            <Grid container spacing={2} sx={{ pt: 2, borderTop: 1, borderColor: 'divider' }}>
              {issue.createdAt && (
                <Grid size={6}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                    <Calendar size={16} />
                    <Typography variant="body2">Created: {format(new Date(issue.createdAt), 'MMM d, yyyy')}</Typography>
                  </Stack>
                </Grid>
              )}
              {issue.timeTakenHours != null && (
                <Grid size={6}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'success.main', fontWeight: 500 }}>
                    <Clock size={16} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Time Taken: {issue.timeTakenHours} hours</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
