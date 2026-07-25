import { Link } from "react-router";
import { FolderKanban, MoreHorizontal, Calendar, CheckSquare } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    projectKey: string;
    name: string;
    description: string;
    createdAt: string;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow group flex flex-col h-full">
      <CardHeader className="p-5 pb-0 flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
            <FolderKanban className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">
              <Link to={`/projects/${project.id}`} className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                {project.name}
              </Link>
            </h3>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              {project.projectKey}
            </span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600 p-1 z-10 relative">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </CardHeader>
      
      <CardContent className="p-5 flex-1">
        <p className="text-sm text-slate-600 line-clamp-2">
          {project.description || "No description provided."}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between text-xs text-slate-500 border-t mt-4 border-slate-100 pt-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {format(new Date(project.createdAt), 'MMM d, yyyy')}
        </div>
        <div className="flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5" />
          0 Issues
        </div>
      </CardFooter>
    </Card>
  );
}
