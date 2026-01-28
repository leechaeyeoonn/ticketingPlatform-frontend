import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from './token';

type AuthGuardProps = {
  redirectTo?: string;
};

export default function AuthGuard({ redirectTo = '/login' }: AuthGuardProps) {
  const location = useLocation();
  const ok = isAuthenticated();

  if (!ok) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
