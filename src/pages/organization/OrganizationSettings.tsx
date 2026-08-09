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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, UserPlus, Lock } from "lucide-react";

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
    return <div className="animate-pulse h-10 bg-slate-100 rounded-md" />;
  }

  if ((rolesError as any)?.status === 403) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-dashed">
        <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">Access restricted</h2>
        <p className="text-slate-500 mt-1">
          Organization settings, roles, and member management are only visible to org admins.
        </p>
        <Link to="/projects">
          <Button variant="outline" className="mt-4">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Organization Settings</h1>
        <p className="text-slate-500 mt-1">Manage roles, permissions, and members.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              Create Custom Role
            </CardTitle>
            <CardDescription>Define a new role with specific permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-2">
                <Label>Role Name</Label>
                <Input 
                  placeholder="e.g. Project Manager" 
                  value={newRoleName} 
                  onChange={(e) => setNewRoleName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2 border p-4 rounded-md">
                  {['ISSUE_READ', 'ISSUE_CREATE', 'ISSUE_UPDATE', 'ISSUE_DELETE', 'ISSUE_ASSIGN', 'TASK_TRANSITION', 'PROJECT_CREATE', 'ORG_ADMIN'].map(perm => (
                    <div key={perm} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={perm} 
                        checked={newRolePerms.includes(perm)}
                        onChange={() => togglePermission(perm)}
                      />
                      <label htmlFor={perm} className="text-sm cursor-pointer">{perm}</label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={creatingRole} className="w-full">Create Role</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-600" />
              Invite Member
            </CardTitle>
            <CardDescription>Invite a user to this organization and assign a role.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div className="space-y-2">
                <Label>User Email</Label>
                <Input 
                  type="email"
                  placeholder="user@example.com" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Role</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={inviteRoleId}
                  onChange={(e) => setInviteRoleId(e.target.value as any)}
                  required
                >
                  <option value="" disabled>Select a role</option>
                  {roles?.map((r: any) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" disabled={invitingUser || rolesLoading} className="w-full">Send Invite</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing Roles</CardTitle>
        </CardHeader>
        <CardContent>
          {rolesLoading ? (
            <div className="animate-pulse h-10 bg-slate-100 rounded-md" />
          ) : roles?.length > 0 ? (
            <div className="space-y-3">
              {roles.map((r: any) => (
                <div key={r.id} className="p-3 border rounded-md flex justify-between items-center">
                  <span className="font-medium text-slate-900">{r.name}</span>
                  <div className="flex gap-2">
                    {r.permissions.map((p: string) => (
                      <span key={p} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">{p}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No roles defined yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Access Requests</CardTitle>
          <CardDescription>Users who signed up via the organization link.</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingLoading ? (
            <div className="animate-pulse h-10 bg-slate-100 rounded-md" />
          ) : pendingMembers?.length > 0 ? (
            <div className="space-y-4">
              {pendingMembers.map((member: any) => (
                <div key={member.user.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium text-slate-900">{member.user.name}</p>
                    <p className="text-sm text-slate-500">{member.user.email}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <select 
                      className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm"
                      value={selectedRoleForPending[member.user.id] || ""}
                      onChange={(e) => setSelectedRoleForPending(prev => ({ ...prev, [member.user.id]: Number(e.target.value) }))}
                    >
                      <option value="" disabled>Select Role</option>
                      {roles?.map((r: any) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <Button size="sm" onClick={() => handleApprove(member.user.id)}>Approve</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(member.user.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No pending requests.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Members & Shift Configuration</CardTitle>
          <CardDescription>Manage working hours (shifts) for members to accurately calculate task time.</CardDescription>
        </CardHeader>
        <CardContent>
          {activeLoading ? (
            <div className="animate-pulse h-10 bg-slate-100 rounded-md" />
          ) : activeMembers?.length > 0 ? (
            <div className="space-y-4">
              {activeMembers.map((member: any) => (
                <div key={member.user.id} className="p-4 border rounded-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{member.user.name}</p>
                      <p className="text-sm text-slate-500">{member.user.email} - Role: {member.role?.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Current Shift: {member.shiftStartTime} to {member.shiftEndTime} on {member.workingDays?.split(",").map((d: string) => d.substring(0,3)).join(", ")}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 sm:mt-0" onClick={() => {
                      setEditingShiftUserId(member.user.id);
                      setShiftStart(member.shiftStartTime || "09:00");
                      setShiftEnd(member.shiftEndTime || "18:00");
                      setWorkingDays(member.workingDays ? member.workingDays.split(",") : ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"]);
                    }}>
                      Configure Shift
                    </Button>
                  </div>
                  
                  {editingShiftUserId === member.user.id && (
                    <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <Label>Start Time</Label>
                          <Input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} />
                        </div>
                        <div className="flex-1">
                          <Label>End Time</Label>
                          <Input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} />
                        </div>
                      </div>
                      <div>
                        <Label>Working Days</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {ALL_DAYS.map(day => (
                            <label key={day} className="flex items-center gap-1 text-sm bg-white border p-1.5 rounded cursor-pointer hover:bg-slate-50">
                              <input 
                                type="checkbox" 
                                checked={workingDays.includes(day)}
                                onChange={() => toggleWorkingDay(day)}
                              />
                              {day.substring(0, 3)}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingShiftUserId(null)}>Cancel</Button>
                        <Button size="sm" onClick={() => handleUpdateShift(member.user.id, member.organization.slug)}>Save Shift</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No active members found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
