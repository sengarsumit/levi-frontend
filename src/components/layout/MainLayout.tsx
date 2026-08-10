import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { LogOut, FolderKanban, Settings, Building, KanbanSquare, Menu as MenuIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { logout } from "../../features/auth/authSlice";
import type { RootState } from "../../app/store";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { ThemeToggle } from "../common/ThemeToggle";

const DRAWER_WIDTH = 256;

const navItems = [
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Organization", to: "/organization", icon: Building },
];

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentTenantId = useSelector((state: RootState) => state.organization.currentTenantId);

  // Redirecting to the right login page (org-specific vs generic) after sign-out is handled
  // by ProtectedRoute, not here — dispatching logout() and then also calling navigate() in
  // this handler raced against ProtectedRoute's own redirect (both react to the same
  // isAuthenticated flip) and ProtectedRoute always won, regardless of call order.
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleSettings = () => {
    if (currentTenantId) {
      navigate(`/organization/${currentTenantId}/settings`);
    }
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ gap: 1, px: 3 }}>
        <KanbanSquare size={24} strokeWidth={2.2} />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Levi
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, py: 2, px: 1.5 }}>
        {navItems.map(({ label, to, icon: Icon }) => (
          <ListItemButton
            key={to}
            component={Link}
            to={to}
            onClick={() => setMobileOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Icon size={20} />
            </ListItemIcon>
            <ListItemText primary={label} slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "error.main",
            "&:hover": { bgcolor: "error.main", color: "error.contrastText" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36, color: "inherit" }}>
            <LogOut size={20} />
          </ListItemIcon>
          <ListItemText primary="Sign Out" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
        </ListItemButton>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <AppBar
          position="static"
          color="inherit"
          elevation={0}
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 4 }, gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
              {isMobile && (
                <IconButton onClick={() => setMobileOpen(true)} color="inherit" edge="start">
                  <MenuIcon size={20} />
                </IconButton>
              )}
              <WorkspaceSwitcher />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ThemeToggle />
              <Tooltip title="Organization settings">
                <IconButton onClick={handleSettings} color="inherit">
                  <Settings size={20} />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", p: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ mx: "auto", maxWidth: 1152 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
