import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');

  // 1. Se não estiver autenticado, manda de volta para o Login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Se a rota exigir ADM e o usuário logado não for admin
  if (requireAdmin && userData.role !== 'admin') {
    alert('Acesso restrito a administradores!');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}