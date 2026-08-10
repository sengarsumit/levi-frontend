import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetProjectsQuery } from "../../api/projectApi";
import { type RootState } from "../../app/store";
import { ProjectCard } from "../../components/project/ProjectCard";
import { CreateProjectModal } from "../../components/project/CreateProjectModal";
import { Plus, Search } from "lucide-react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Skeleton,
  Paper,
} from "@mui/material";

export default function ProjectsDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const currentTenantId = useSelector((state: RootState) => state.organization.currentTenantId);

  const { data: projects, isLoading } = useGetProjectsQuery(currentTenantId, {
    skip: !currentTenantId,
  });

  const filteredProjects = projects?.filter(
    (project: any) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.projectKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Projects
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            Manage and track your organization's projects.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => setShowCreateModal(true)}
          disabled={!currentTenantId}
        >
          New Project
        </Button>
      </Stack>

      <TextField
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ maxWidth: 384 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search size={16} />
              </InputAdornment>
            ),
          },
        }}
      />

      {!currentTenantId ? (
        <Paper
          variant="outlined"
          sx={{ py: 8, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            No Workspace Selected
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Please select or create a workspace to view projects.
          </Typography>
        </Paper>
      ) : isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredProjects?.length > 0 ? (
        <Grid container spacing={3}>
          {filteredProjects.map((project: any) => (
            <Grid key={project.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <ProjectCard project={project} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          variant="outlined"
          sx={{ py: 8, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}
        >
          <Box
            sx={{
              mx: "auto",
              width: 48,
              height: 48,
              borderRadius: "50%",
              bgcolor: "action.hover",
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Plus size={24} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            No projects found
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first project."}
          </Typography>
          {!searchTerm && (
            <Button variant="contained" onClick={() => setShowCreateModal(true)}>
              Create Project
            </Button>
          )}
        </Paper>
      )}

      <CreateProjectModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </Stack>
  );
}
