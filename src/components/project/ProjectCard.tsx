import { Link } from "react-router";
import { FolderKanban, MoreHorizontal, Calendar } from "lucide-react";
import { Card, CardContent, Box, Typography, IconButton, Stack } from "@mui/material";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    projectKey: string;
    name: string;
    description: string;
    createdAt: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 3,
        transition: "box-shadow 0.15s ease",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 2.5, pb: 1.5, flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                p: 1.25,
                borderRadius: 2,
                display: "flex",
              }}
            >
              <FolderKanban size={20} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {/* Stretched link: covers the whole card so anywhere on it navigates, while the
                    more-options button below sits above it (zIndex) and stays independently clickable. */}
                <Box
                  component={Link}
                  to={`/projects/${project.id}`}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 0,
                  }}
                  aria-label={project.name}
                />
                {project.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", letterSpacing: 0.5 }}>
                {project.projectKey}
              </Typography>
            </Box>
          </Stack>
          <IconButton size="small" sx={{ position: "relative", zIndex: 1, color: "text.secondary" }}>
            <MoreHorizontal size={18} />
          </IconButton>
        </Stack>

        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mt: 2,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {project.description || "No description provided."}
        </Typography>
      </CardContent>

      <Stack
        direction="row"
        spacing={0.75}
        sx={{
          alignItems: "center",
          px: 2.5,
          py: 1.5,
          borderTop: 1,
          borderColor: "divider",
          color: "text.secondary",
        }}
      >
        <Calendar size={14} />
        <Typography variant="caption">
          {format(new Date(project.createdAt), "MMM d, yyyy")}
        </Typography>
      </Stack>
    </Card>
  );
}
