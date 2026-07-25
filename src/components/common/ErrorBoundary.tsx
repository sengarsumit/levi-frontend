import { useRouteError, Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function GlobalErrorBoundary() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <h2 className="text-xl font-semibold text-slate-900">Something went wrong.</h2>
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-left text-sm font-mono overflow-auto max-h-64 shadow-sm border border-red-200">
          {error?.message || error?.statusText || "Unknown error"}
          {error?.stack && (
            <pre className="mt-2 text-xs opacity-80 whitespace-pre-wrap">{error.stack}</pre>
          )}
        </div>
        <div className="pt-4 flex flex-col gap-2">
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          <Link to="/">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
