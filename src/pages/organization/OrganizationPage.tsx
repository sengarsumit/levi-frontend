import { useState } from "react";
import { useGetOrganizationsQuery } from "../../api/organizationApi";
import { CreateWorkspaceModal } from "../../components/organization/CreateWorkspaceModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Building, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router";

export default function OrganizationPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: organizations, isLoading } = useGetOrganizationsQuery(undefined);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Organizations</h1>
          <p className="text-slate-500 mt-1">Manage your workspaces and teams.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Workspace
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : organizations?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org: any) => (
            <Card key={org.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-0 flex-row items-center gap-3">
                <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900">{org.name}</h3>
              </CardHeader>
              <CardContent className="p-5 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {org.createdAt ? format(new Date(org.createdAt), 'MMM d, yyyy') : 'N/A'}
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate(`/organization/${org.id}/settings`)}>
                  Manage
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Building className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No workspaces yet</h3>
          <p className="text-slate-500 mt-1 mb-6">Create your first workspace to get started.</p>
          <Button onClick={() => setShowCreateModal(true)}>Create Workspace</Button>
        </div>
      )}

      <CreateWorkspaceModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
}
