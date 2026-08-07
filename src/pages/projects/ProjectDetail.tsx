import { useParams, Link } from "react-router";
import { useGetProjectByIdQuery } from "../../api/projectApi";
import { useGetIssuesByProjectQuery } from "../../api/issueApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, FolderKanban, Calendar, CheckSquare, Kanban, ListTodo } from "lucide-react";
import { format } from "date-fns";

export default function ProjectDetail() {
  const { id } = useParams();
  const projectId = id ? Number(id) : 0;
  const { data: project, isLoading, error } = useGetProjectByIdQuery(projectId, { skip: !projectId });
  const { data: issues = [] } = useGetIssuesByProjectQuery(projectId, { skip: !projectId });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-slate-900">Project not found</h2>
        <Link to="/projects">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{project.name}</h1>
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {project.projectKey}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/projects/${id}/backlog`}>
            <Button variant="outline" className="flex items-center gap-2">
              <ListTodo className="w-4 h-4" />
              Backlog
            </Button>
          </Link>
          <Link to={`/projects/${id}/board`}>
            <Button className="flex items-center gap-2">
              <Kanban className="w-4 h-4" />
              Open Board
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Status</h3>
          </CardHeader>
          <CardContent>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {project.status}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Created</h3>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold">
              {project.createdAt ? format(new Date(project.createdAt), 'MMM d, yyyy') : 'N/A'}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-sm font-medium text-slate-500">Issues</h3>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-semibold">{issues.length} Issues</span>
          </CardContent>
        </Card>
      </div>

      {project.description && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-medium text-slate-500">Description</h3>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700">{project.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick link to board */}
      <Card className="border-dashed border-2 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
        <Link to={`/projects/${id}/board`} className="block">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-200 transition-colors">
              <Kanban className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Kanban Board</p>
              <p className="text-sm text-slate-500">
                View and manage issues across workflow columns
              </p>
            </div>
            <ArrowLeft className="w-5 h-5 text-slate-400 ml-auto rotate-180 group-hover:text-indigo-500 transition-colors" />
          </CardContent>
        </Link>
      </Card>

      <Card className="border-dashed border-2 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
        <Link to={`/projects/${id}/backlog`} className="block">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-200 transition-colors">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Sprint Backlog</p>
              <p className="text-sm text-slate-500">
                Plan sprints, prioritize issues, and manage backlog
              </p>
            </div>
            <ArrowLeft className="w-5 h-5 text-slate-400 ml-auto rotate-180 group-hover:text-indigo-500 transition-colors" />
          </CardContent>
        </Link>
      </Card>
    </div>
  );
}
