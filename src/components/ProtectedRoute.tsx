import { useAuthContext } from '../hooks/useAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user } = useAuthContext();

  if (requireAdmin && user?.role !== 'admin') {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Acceso denegado</h1>
        <p>No tienes permisos para acceder a esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
