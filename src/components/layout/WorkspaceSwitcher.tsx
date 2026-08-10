import { useEffect, useState, type MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetOrganizationsQuery } from "../../api/organizationApi";
import { setTenantId } from "../../features/organization/organizationSlice";
import { type RootState } from "../../app/store";
import { Building, Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { CreateWorkspaceModal } from "../organization/CreateWorkspaceModal";

export function WorkspaceSwitcher() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();

  const currentTenantId = useSelector((state: RootState) => state.organization.currentTenantId);
  const { data: organizations, isLoading } = useGetOrganizationsQuery(undefined);

  // Auto-select first org if none selected and orgs exist
  useEffect(() => {
    if (!currentTenantId && organizations?.length > 0) {
      dispatch(setTenantId(String(organizations[0].id)));
    }
  }, [currentTenantId, organizations, dispatch]);

  // currentTenantId is persisted to localStorage (and sent as the X-Tenant-ID header) as a
  // string, but organizations[].id comes back from the API as a number — compare as strings.
  const currentOrg = organizations?.find((org: any) => String(org.id) === currentTenantId);

  const open = Boolean(anchorEl);
  const handleOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        onClick={handleOpen}
        color="inherit"
        sx={{
          justifyContent: "space-between",
          width: { xs: 160, sm: 208 },
          border: 1,
          borderColor: "divider",
          px: 1.5,
          textTransform: "none",
        }}
        endIcon={<ChevronsUpDown size={16} />}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
          <Box
            sx={{
              bgcolor: "text.primary",
              color: "background.paper",
              borderRadius: 1,
              p: 0.5,
              display: "flex",
            }}
          >
            <Building size={16} />
          </Box>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
            {isLoading ? "Loading..." : currentOrg?.name || "Select Workspace"}
          </Typography>
        </Box>
      </Button>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} slotProps={{ paper: { sx: { width: 224 } } }}>
        <Typography variant="overline" color="text.secondary" sx={{ px: 2, py: 0.5, display: "block" }}>
          Workspaces
        </Typography>
        <Divider />
        {organizations?.map((org: any) => (
          <MenuItem
            key={org.id}
            onClick={() => {
              dispatch(setTenantId(String(org.id)));
              handleClose();
            }}
          >
            <ListItemIcon>
              <Building size={16} />
            </ListItemIcon>
            <ListItemText primary={org.name} />
            {currentTenantId === String(org.id) && <Check size={16} />}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            setShowCreateModal(true);
            handleClose();
          }}
          sx={{ color: "primary.main", fontWeight: 500 }}
        >
          <ListItemIcon sx={{ color: "inherit" }}>
            <Plus size={16} />
          </ListItemIcon>
          Create Workspace
        </MenuItem>
      </Menu>

      <CreateWorkspaceModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </>
  );
}
