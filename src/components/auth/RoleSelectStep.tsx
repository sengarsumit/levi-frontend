import { useState } from "react";
import { Stack, TextField, MenuItem, Button, Typography } from "@mui/material";
import { useGetJoinRolesQuery } from "../../api/organizationApi";

interface RoleSelectStepProps {
  orgSlug: string;
  onSubmit: (preferredRoleId: number | undefined) => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function RoleSelectStep({ orgSlug, onSubmit, isSubmitting, submitLabel = "Request Access" }: RoleSelectStepProps) {
  const { data: roles = [], isLoading } = useGetJoinRolesQuery(orgSlug);
  const [roleId, setRoleId] = useState("");

  return (
    <Stack spacing={2.5}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Optionally let the admin know which role you're requesting. They'll still make the
        final decision when approving you.
      </Typography>
      <TextField
        select
        label="Preferred role (optional)"
        fullWidth
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        disabled={isLoading}
      >
        <MenuItem value="">No preference</MenuItem>
        {roles.map((role: { id: number; name: string }) => (
          <MenuItem key={role.id} value={role.id}>
            {role.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        type="button"
        variant="contained"
        size="large"
        fullWidth
        disabled={isSubmitting}
        onClick={() => onSubmit(roleId === "" ? undefined : Number(roleId))}
      >
        {isSubmitting ? "Requesting..." : submitLabel}
      </Button>
    </Stack>
  );
}
