import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { type RootState } from "../../app/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // lastOrgSlug survives logout() (see authSlice) specifically so this redirect can send
    // a signed-out user back to the org-specific login page they came from, rather than the
    // generic one — a plain navigate() call from the sign-out button races this redirect and
    // reliably loses, so the redirect target has to be decided here instead.
    const lastOrgSlug = localStorage.getItem('lastOrgSlug');
    const loginPath = lastOrgSlug ? `/login/${lastOrgSlug}` : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
