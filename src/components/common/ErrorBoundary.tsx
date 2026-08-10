import { useRouteError, Link } from "react-router";
import { Box, Stack, Typography, Button, Paper } from "@mui/material";

export default function GlobalErrorBoundary() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Stack spacing={2} sx={{ maxWidth: 480, textAlign: "center" }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
          Oops!
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Something went wrong.
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            textAlign: "left",
            fontSize: 13,
            fontFamily: "monospace",
            maxHeight: 256,
            overflow: "auto",
            bgcolor: "error.main",
            color: "error.contrastText",
            borderColor: "error.main",
            opacity: 0.9,
          }}
        >
          {error?.message || error?.statusText || "Unknown error"}
          {error?.stack && (
            <Box
              component="pre"
              sx={{ mt: 1, fontSize: 11, opacity: 0.8, whiteSpace: "pre-wrap" }}
            >
              {error.stack}
            </Box>
          )}
        </Paper>
        <Stack spacing={1} sx={{ pt: 2 }}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
          <Button component={Link} to="/" variant="outlined" fullWidth>
            Back to Home
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
