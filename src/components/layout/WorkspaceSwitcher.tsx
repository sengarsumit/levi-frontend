import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetOrganizationsQuery } from "../../api/organizationApi";
import { setTenantId } from "../../features/organization/organizationSlice";
import { type RootState } from "../../app/store";
import { Building, Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateWorkspaceModal } from "../organization/CreateWorkspaceModal";

export function WorkspaceSwitcher() {
  const [showCreateModal, setShowCreateModal] = useState(false);
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 text-sm font-semibold hover:bg-slate-100 rounded-md transition-colors w-48 justify-between border">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-slate-900 text-white rounded p-1">
              <Building className="w-4 h-4" />
            </div>
            <span className="truncate">
              {isLoading ? "Loading..." : (currentOrg?.name || "Select Workspace")}
            </span>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-500" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {organizations?.map((org: any) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => dispatch(setTenantId(String(org.id)))}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                {org.name}
              </div>
              {currentTenantId === String(org.id) && <Check className="w-4 h-4" />}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowCreateModal(true)}
            className="cursor-pointer text-indigo-600 font-medium focus:text-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateWorkspaceModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </>
  );
}
