import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetProjectsQuery } from "../../api/projectApi";
import { type RootState } from "../../app/store";
import { selectPermissions } from "../../features/auth/authSlice";
import { ProjectCard } from "../../components/project/ProjectCard";
import { CreateProjectModal } from "../../components/project/CreateProjectModal";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ProjectsDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const currentTenantId = useSelector((state: RootState) => state.organization.currentTenantId);
  const permissions = useSelector(selectPermissions) || [];
  const canCreateProject = permissions.includes("PROJECT_CREATE") || permissions.includes("ALL_PERMISSIONS");

  const { data: projects, isLoading } = useGetProjectsQuery(currentTenantId, {
    skip: !currentTenantId,
  });

  const filteredProjects = projects?.filter((project: any) => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    project.projectKey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">Manage and track your organization's projects.</p>
        </div>
        
        {canCreateProject && (
          <Button onClick={() => setShowCreateModal(true)} disabled={!currentTenantId}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      <div className="flex items-center max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {!currentTenantId ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          <h3 className="text-lg font-medium text-slate-900">No Workspace Selected</h3>
          <p className="text-slate-500 mt-1">Please select or create a workspace to view projects.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredProjects?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed">
          <div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No projects found</h3>
          <p className="text-slate-500 mt-1 mb-6">
            {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first project."}
          </p>
          {!searchTerm && canCreateProject && (
            <Button onClick={() => setShowCreateModal(true)}>
              Create Project
            </Button>
          )}
        </div>
      )}

      <CreateProjectModal 
        open={showCreateModal} 
        onOpenChange={setShowCreateModal} 
      />
    </div>
  );
}
