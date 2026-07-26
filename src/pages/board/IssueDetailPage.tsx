import { useParams, Link } from 'react-router';
import { useGetIssueByIdQuery } from '../../api/issueApi';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { IssueTypeBadge } from '../../components/issue/IssueBadge';
import { format } from 'date-fns';

export default function IssueDetailPage() {
  const { issueId } = useParams<{ issueId: string }>();
  const { data: issue, isLoading, error } = useGetIssueByIdQuery(Number(issueId));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-slate-900">Issue not found</h2>
        <Link to="/projects">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/projects/${issue.projectId}`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Project
        </Button>
      </Link>

      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <IssueTypeBadge type={issue.issueType} />
          <span className="text-xs text-slate-400 font-mono">#{issue.id}</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900">{issue.title}</h1>

        {issue.description && (
          <p className="text-slate-600 leading-relaxed">{issue.description}</p>
        )}

        <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-sm">
          {issue.createdAt && (
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span>Created: {format(new Date(issue.createdAt), 'MMM d, yyyy')}</span>
            </div>
          )}
          {issue.timeTakenHours != null && (
            <div className="flex items-center gap-2 text-emerald-600 font-medium">
              <Clock className="w-4 h-4" />
              <span>Time Taken: {issue.timeTakenHours} hours</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
