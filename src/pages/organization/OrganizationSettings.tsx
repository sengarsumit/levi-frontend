import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  useGetRolesQuery,
  useCreateRoleMutation,
  useInviteUserMutation,
  useGetPendingMembersQuery,
  useApproveMemberMutation,
  useRejectMemberMutation,
  useGetActiveMembersQuery,
  useUpdateUserShiftMutation
} from "../../api/organizationApi";
import { toast } from "sonner";
import { Shield, UserPlus, Lock } from "lucide-react";
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Grid,
  Chip,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Skeleton,
} from "@mui/material";

export default function OrganizationSettings() {
  const { id } = useParams<{ id: string }>();

  // Whether the current user can see this page is decided by the backend's live
  // ORG_ADMIN check on these requests, not a client-side guess from the JWT — the JWT's
  // permission claims are only a login-time snapshot (see TenantContextInterceptor) and
  // can be stale or empty for a genuine admin who reached this org via the workspace
  // switcher rather than a fresh org-scoped login.
  const { data: roles, isLoading: rolesLoading, error: rolesError } = useGetRolesQuery(id);
  const [createRole, { isLoading: creatingRole }] = useCreateRoleMutation();
  const [inviteUser, { isLoading: invitingUser }] = useInviteUserMutation();
  const { data: pendingMembers, isLoading: pendingLoading } = useGetPendingMembersQuery(id);
  const [approveMember] = useApproveMemberMutation();
  const [rejectMember] = useRejectMemberMutation();

  const { data: activeMembers, isLoading: activeLoading } = useGetActiveMembersQuery(id);
  const [updateUserShift] = useUpdateUserShiftMutation();

  const [selectedRoleForPending, setSelectedRoleForPending] = useState<Record<string, number>>({});

  // Shift configuration state
  const [editingShiftUserId, setEditingShiftUserId] = useState<string | null>(null);
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");
  const [workingDays, setWorkingDays] = useState<string[]>(["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]);

  const ALL_DAYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

  const [newRoleName, setNewRoleName] = useState("");
  const [newRolePerms, setNewRolePerms] = useState<string[]>([]);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRoleId, setInviteRoleId] = useState<number | "">("");

  useEffect(() => {
    if (roles && roles.length > 0) {
      const userRole = roles.find((r: any) => r.name === "User") || roles[0];
      if (userRole && !inviteRoleId) {
        setInviteRoleId(userRole.id);
      }
    }
  }, [roles]);

  useEffect(() => {
    if (roles && pendingMembers) {
      const userRole = roles.find((r: any) => r.name === "User") || roles[0];
      if (userRole) {
        setSelectedRoleForPending(prev => {
          const newSelected = { ...prev };
          let changed = false;
          pendingMembers.forEach((m: any) => {
            if (!newSelected[m.user.id]) {
              newSelected[m.user.id] = userRole.id;
              changed = true;
            }
          });
          return changed ? newSelected : prev;
        });
      }
    }
  }, [roles, pendingMembers]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRole({
        orgId: id,
        roleData: { name: newRoleName, permissions: newRolePerms }
      }).unwrap();
      toast.success("Role created successfully");
      setNewRoleName("");
      setNewRolePerms([]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create role");
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteRoleId) return;
    try {
      await inviteUser({
        orgId: id,
        inviteData: { email: inviteEmail, roleId: Number(inviteRoleId) }
      }).unwrap();
      toast.success("User invited successfully");
      setInviteEmail("");
      setInviteRoleId("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to invite user");
    }
  };

  const togglePermission = (perm: string) => {
    setNewRolePerms(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const handleApprove = async (userId: string) => {
    const roleId = selectedRoleForPending[userId];
    if (!roleId) {
      toast.error("Please select a role before approving.");
      return;
    }
    try {
      await approveMember({ orgId: id, userId, roleId }).unwrap();
      toast.success("Member approved successfully");
    } catch (err: any) {
      toast.error("Failed to approve member");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      await rejectMember({ orgId: id, userId }).unwrap();
      toast.success("Member rejected successfully");
    } catch (err: any) {
      toast.error("Failed to reject member");
    }
  };

  const handleUpdateShift = async (userId: string, userOrgSlug: string) => {
    try {
      await updateUserShift({
        orgSlug: userOrgSlug,
        userId,
        shiftData: {
          shiftStartTime: shiftStart,
          shiftEndTime: shiftEnd,
          workingDays: workingDays.join(",")
        }
      }).unwrap();
      toast.success("Shift updated successfully");
      setEditingShiftUserId(null);
    } catch (err: any) {
      toast.error("Failed to update shift");
    }
  };

  const toggleWorkingDay = (day: string) => {
    setWorkingDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (rolesLoading) {
    return <Skeleton variant="rounded" height={40} />;
  }

  if ((rolesError as any)?.status === 403) {
    return (
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
          <Lock size={24} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Access restricted
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Organization settings, roles, and member management are only visible to org admins.
        </Typography>
        <Button component={Link} to="/projects" variant="outlined" sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Organization Settings
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
          Manage roles, permissions, and members.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <Shield size={18} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Create Custom Role
                  </Typography>
                </Stack>
              }
              subheader="Define a new role with specific permissions."
            />
            <CardContent sx={{ pt: 0 }}>
              <Box component="form" onSubmit={handleCreateRole}>
                <Stack spacing={2.5}>
                  <TextField
                    label="Role Name"
                    placeholder="e.g. Project Manager"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    required
                    fullWidth
                  />
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                      Permissions
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                      <FormGroup>
                        {['ISSUE_READ', 'ISSUE_CREATE', 'ISSUE_UPDATE', 'ISSUE_DELETE', 'ISSUE_ASSIGN', 'TASK_TRANSITION', 'PROJECT_CREATE', 'ORG_ADMIN'].map(perm => (
                          <FormControlLabel
                            key={perm}
                            control={
                              <Checkbox
                                size="small"
                                checked={newRolePerms.includes(perm)}
                                onChange={() => togglePermission(perm)}
                              />
                            }
                            label={<Typography variant="body2">{perm}</Typography>}
                          />
                        ))}
                      </FormGroup>
                    </Paper>
                  </Box>
                  <Button type="submit" variant="contained" fullWidth disabled={creatingRole}>
                    Create Role
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
            <CardHeader
              title={
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "primary.main" }}>
                  <UserPlus size={18} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
                    Invite Member
                  </Typography>
                </Stack>
              }
              subheader="Invite a user to this organization and assign a role."
            />
            <CardContent sx={{ pt: 0 }}>
              <Box component="form" onSubmit={handleInviteUser}>
                <Stack spacing={2.5}>
                  <TextField
                    type="email"
                    label="User Email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    fullWidth
                  />
                  <FormControl fullWidth required>
                    <InputLabel id="invite-role-label">Assign Role</InputLabel>
                    <Select
                      labelId="invite-role-label"
                      label="Assign Role"
                      value={inviteRoleId}
                      onChange={(e) => setInviteRoleId(e.target.value as any)}
                    >
                      {roles?.map((r: any) => (
                        <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button type="submit" variant="contained" fullWidth disabled={invitingUser || rolesLoading}>
                    Send Invite
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader title={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Existing Roles</Typography>} />
        <CardContent sx={{ pt: 0 }}>
          {rolesLoading ? (
            <Skeleton variant="rounded" height={40} />
          ) : roles?.length > 0 ? (
            <Stack spacing={1.5}>
              {roles.map((r: any) => (
                <Paper
                  key={r.id}
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{r.name}</Typography>
                  <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
                    {r.permissions.map((p: string) => (
                      <Chip key={p} label={p} size="small" color="primary" variant="outlined" />
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>No roles defined yet.</Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Pending Access Requests</Typography>}
          subheader="Users who signed up via the organization link."
        />
        <CardContent sx={{ pt: 0 }}>
          {pendingLoading ? (
            <Skeleton variant="rounded" height={40} />
          ) : pendingMembers?.length > 0 ? (
            <Stack spacing={1.5}>
              {pendingMembers.map((member: any) => (
                <Paper
                  key={member.user.id}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { sm: "center" }, justifyContent: "space-between", gap: 1.5 }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{member.user.name}</Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>{member.user.email}</Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        displayEmpty
                        value={selectedRoleForPending[member.user.id] || ""}
                        onChange={(e) => setSelectedRoleForPending(prev => ({ ...prev, [member.user.id]: Number(e.target.value) }))}
                      >
                        <MenuItem value="" disabled>Select Role</MenuItem>
                        {roles?.map((r: any) => (
                          <MenuItem key={r.id} value={r.id}>{r.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button size="small" variant="contained" onClick={() => handleApprove(member.user.id)}>Approve</Button>
                    <Button size="small" variant="contained" color="error" onClick={() => handleReject(member.user.id)}>Reject</Button>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>No pending requests.</Typography>
          )}
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={<Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Active Members & Shift Configuration</Typography>}
          subheader="Manage working hours (shifts) for members to accurately calculate task time."
        />
        <CardContent sx={{ pt: 0 }}>
          {activeLoading ? (
            <Skeleton variant="rounded" height={40} />
          ) : activeMembers?.length > 0 ? (
            <Stack spacing={1.5}>
              {activeMembers.map((member: any) => (
                <Paper key={member.user.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", gap: 1.5 }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{member.user.name}</Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {member.user.email} - Role: {member.role?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.disabled", display: "block", mt: 0.5 }}>
                        Current Shift: {member.shiftStartTime} to {member.shiftEndTime} on {member.workingDays?.split(",").map((d: string) => d.substring(0,3)).join(", ")}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setEditingShiftUserId(member.user.id);
                        setShiftStart(member.shiftStartTime || "09:00");
                        setShiftEnd(member.shiftEndTime || "18:00");
                        setWorkingDays(member.workingDays ? member.workingDays.split(",") : ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]);
                      }}
                    >
                      Configure Shift
                    </Button>
                  </Stack>

                  {editingShiftUserId === member.user.id && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                      <Stack spacing={2.5}>
                        <Stack direction="row" spacing={2}>
                          <TextField
                            label="Start Time"
                            type="time"
                            value={shiftStart}
                            onChange={(e) => setShiftStart(e.target.value)}
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                          <TextField
                            label="End Time"
                            type="time"
                            value={shiftEnd}
                            onChange={(e) => setShiftEnd(e.target.value)}
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                        </Stack>
                        <Box>
                          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                            Working Days
                          </Typography>
                          <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: "wrap" }}>
                            {ALL_DAYS.map(day => (
                              <FormControlLabel
                                key={day}
                                sx={{
                                  m: 0,
                                  border: 1,
                                  borderColor: "divider",
                                  borderRadius: 1.5,
                                  pr: 1.5,
                                  bgcolor: "background.paper",
                                }}
                                control={
                                  <Checkbox
                                    size="small"
                                    checked={workingDays.includes(day)}
                                    onChange={() => toggleWorkingDay(day)}
                                  />
                                }
                                label={<Typography variant="body2">{day.substring(0, 3)}</Typography>}
                              />
                            ))}
                          </Stack>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                          <Button size="small" color="inherit" onClick={() => setEditingShiftUserId(null)}>Cancel</Button>
                          <Button size="small" variant="contained" onClick={() => handleUpdateShift(member.user.id, member.organization.slug)}>Save Shift</Button>
                        </Stack>
                      </Stack>
                    </Box>
                  )}
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>No active members found.</Typography>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
