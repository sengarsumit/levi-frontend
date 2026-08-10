import { useParams, Link } from "react-router";
import { useGetProjectByIdQuery } from "../../api/projectApi";
import { useGetIssuesByProjectQuery } from "../../api/issueApi";
import { ArrowLeft, FolderKanban, Calendar, CheckSquare, Kanban, ListTodo } from "lucide-react";
import { format } from "date-fns";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Skeleton,
} from "@mui/material";

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = id ? Number(id) : 0;
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId, { skip: !projectId });
  const { data: issues = [] } = useGetIssuesByProjectQuery(projectId, { skip: !projectId });

  if (isLoading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="text" width={192} height={40} />
        <Skeleton variant="rounded" height={256} sx={{ borderRadius: 3 }} />
      </Stack>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Project not found
        </Typography>
        <Button component={Link} to="/projects" variant="outlined" startIcon={<ArrowLeft size={16} />} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Button component={Link} to="/projects" size="small" color="inherit" startIcon={<ArrowLeft size={16} />}>
          Back
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 1.5,
              borderRadius: 3,
              display: "flex",
            }}
          >
            <FolderKanban size={28} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {project.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", letterSpacing: 0.5 }}>
              {project.projectKey}
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1.5}>
          <Button component={Link} to={`/projects/${id}/backlog`} variant="outlined" startIcon={<ListTodo size={16} />}>
            Backlog
          </Button>
          <Button component={Link} to={`/projects/${id}/board`} variant="contained" startIcon={<Kanban size={16} />}>
            Open Board
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                STATUS
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip
                  label={project.status}
                  size="small"
                  color={project.status === "ACTIVE" ? "success" : "default"}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                CREATED
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1, color: "text.secondary" }}>
                <Calendar size={16} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {project.createdAt ? format(new Date(project.createdAt), "MMM d, yyyy") : "N/A"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                ISSUES
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1, color: "text.secondary" }}>
                <CheckSquare size={16} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {issues.length} Issues
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {project.description && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              DESCRIPTION
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {project.description}
            </Typography>
          </CardContent>
        </Card>
      )}

      {[
        { to: `/projects/${id}/board`, icon: Kanban, title: "Kanban Board", desc: "View and manage issues across workflow columns" },
        { to: `/projects/${id}/backlog`, icon: ListTodo, title: "Sprint Backlog", desc: "Plan sprints, prioritize issues, and manage backlog" },
      ].map(({ to, icon: Icon, title, desc }) => (
        <Card key={to} variant="outlined" sx={{ borderRadius: 3, borderStyle: "dashed", borderWidth: 2 }}>
          <CardActionArea component={Link} to={to} sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Box
                sx={{
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  p: 1.5,
                  borderRadius: 3,
                  display: "flex",
                }}
              >
                <Icon size={24} />
              </Box>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {desc}
                </Typography>
              </Box>
              <ArrowLeft size={20} style={{ marginLeft: "auto", transform: "rotate(180deg)", opacity: 0.4 }} />
            </Stack>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}
