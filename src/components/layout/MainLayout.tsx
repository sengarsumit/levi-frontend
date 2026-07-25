import { Outlet } from "react-router";
import { Link } from "react-router";
import { LogOut, FolderKanban, Settings, Home, Building } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";

const MainLayout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl tracking-tight">
          Project Levi
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 font-medium">
                <Home className="w-5 h-5 text-slate-500" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/projects" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 font-medium">
                <FolderKanban className="w-5 h-5 text-slate-500" />
                Projects
              </Link>
            </li>
            <li>
              <Link to="/organization" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 font-medium">
                <Building className="w-5 h-5 text-slate-500" />
                Organization
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left rounded-md hover:bg-red-50 text-red-600 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 flex items-center justify-between px-8 border-b bg-white shrink-0">
          <div className="font-medium text-slate-800">
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
