import { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateProjectMutation } from "../../api/projectApi";
import { type RootState } from "../../app/store";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { toast } from "sonner";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectModal({ open, onOpenChange }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const currentTenantId = useSelector((state: RootState) => state.organization.currentTenantId);
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createProject({
        name,
        description,
        orgId: currentTenantId,
      }).unwrap();

      toast.success("Project created successfully");
      setName("");
      setDescription("");
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onClose={() => onOpenChange(false)} maxWidth="xs" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>Start a new project in your workspace.</DialogContentText>
          <Stack spacing={2.5}>
            <TextField
              autoFocus
              fullWidth
              required
              label="Project Name"
              placeholder="E-commerce Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button variant="outlined" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading || !currentTenantId}>
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
