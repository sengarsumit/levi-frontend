import { useParams, Link } from 'react-router';
import { BarChart } from '@mui/x-charts/BarChart';
import { useGetProjectProductivityQuery } from '../../api/issueApi';
import { useGetUsersQuery } from '../../api/userApi';
import { ArrowLeft, ListChecks, CheckCircle2, Percent, Timer } from 'lucide-react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';

export default function ProductivityPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? Number(id) : 0;
  const { data: stats, isLoading } = useGetProjectProductivityQuery(projectId, { skip: !projectId });
  const { data: users = [] } = useGetUsersQuery();
  const theme = useTheme();

  const nameFor = (userId: string) => users.find((u) => u.id === userId)?.name ?? 'Unknown user';

  if (isLoading || !stats) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="text" width={192} height={40} />
        <Skeleton variant="rounded" height={320} sx={{ borderRadius: 3 }} />
      </Stack>
    );
  }

  const completionRate =
    stats.totalIssues > 0 ? Math.round((stats.completedIssues / stats.totalIssues) * 100) : 0;

  const statCards = [
    { label: 'TOTAL ISSUES', value: stats.totalIssues, icon: ListChecks },
    { label: 'COMPLETED', value: stats.completedIssues, icon: CheckCircle2 },
    { label: 'COMPLETION RATE', value: `${completionRate}%`, icon: Percent },
    {
      label: 'AVG TIME TO COMPLETE',
      value: stats.avgTimeTakenHours != null ? `${stats.avgTimeTakenHours.toFixed(1)}h` : '—',
      icon: Timer,
    },
  ];

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={Link} to={`/projects/${id}`} size="small" color="inherit" startIcon={<ArrowLeft size={16} />}>
          Back to Project
        </Button>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Productivity
      </Typography>

      <Grid container spacing={3}>
        {statCards.map(({ label, value, icon: Icon }) => (
          <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {label}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1 }}>
                  <Icon size={16} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {value}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stats.byUser.length > 0 ? (
        <>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                ISSUES COMPLETED PER TEAMMATE
              </Typography>
              <BarChart
                height={320}
                colors={[theme.palette.primary.main]}
                xAxis={[{ data: stats.byUser.map((u) => nameFor(u.userId)), scaleType: 'band' }]}
                series={[{ data: stats.byUser.map((u) => u.completedCount), label: 'Completed' }]}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                BY TEAMMATE
              </Typography>
              <Table size="small" sx={{ mt: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Assigned</TableCell>
                    <TableCell align="right">Completed</TableCell>
                    <TableCell align="right">Avg Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.byUser.map((u) => (
                    <TableRow key={u.userId}>
                      <TableCell>{nameFor(u.userId)}</TableCell>
                      <TableCell align="right">{u.assignedCount}</TableCell>
                      <TableCell align="right">{u.completedCount}</TableCell>
                      <TableCell align="right">
                        {u.avgTimeTakenHours != null ? `${u.avgTimeTakenHours.toFixed(1)}h` : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card variant="outlined" sx={{ borderRadius: 3, borderStyle: 'dashed' }}>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No assigned issues yet — productivity data will appear here once work is assigned and
              completed.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
