import { useState } from "react";
import { useGetOrganizationsQuery } from "../../api/organizationApi";
import { CreateWorkspaceModal } from "../../components/organization/CreateWorkspaceModal";
import { Building, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Paper,
} from "@mui/material";

export default function OrganizationPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: organizations, isLoading } = useGetOrganizationsQuery(undefined);
  const navigate = useNavigate();

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Organizations
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            Manage your workspaces and teams.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setShowCreateModal(true)}>
          New Workspace
        </Button>
      </Stack>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 6, lg: 4 }}>
              <Skeleton variant="rounded" height={128} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : organizations?.length > 0 ? (
        <Grid container spacing={3}>
          {organizations.map((org: any) => (
            <Grid key={org.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                variant="outlined"
                sx={{ borderRadius: 3, transition: "box-shadow 0.15s ease", "&:hover": { boxShadow: 3 } }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        p: 1.25,
                        borderRadius: 2,
                        display: "flex",
                      }}
                    >
                      <Building size={20} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {org.name}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "text.secondary" }}>
                      <Calendar size={14} />
                      <Typography variant="caption">
                        {org.createdAt ? format(new Date(org.createdAt), "MMM d, yyyy") : "N/A"}
                      </Typography>
                    </Stack>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/organization/${org.id}/settings`)}
                    >
                      Manage
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center", borderRadius: 3, borderStyle: "dashed" }}>
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
            <Building size={24} />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            No workspaces yet
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 3 }}>
            Create your first workspace to get started.
          </Typography>
          <Button variant="contained" onClick={() => setShowCreateModal(true)}>
            Create Workspace
          </Button>
        </Paper>
      )}

      <CreateWorkspaceModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </Stack>
  );
}
