import { Navigate } from 'react-router-dom';

// Lista de e-mails autorizados
const ALLOWED_ADMIN_EMAILS = [
  'rafaelhoffmann@gmail.com',
  'samuelcunha@gmail.com'
];

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';

  // Lê de 'user_data' ou 'user' para garantir compatibilidade
  const storedUser = localStorage.getItem('user_data') || localStorage.getItem('user');
  const userData = storedUser ? JSON.parse(storedUser) : {};

  // Formata o e-mail para comparação segura
  const userEmail = userData?.email ? userData.email.toLowerCase().trim() : '';

  // 1. Se não estiver autenticado, redireciona para o Login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 2. Se a rota exigir ADM
  if (requireAdmin) {
    const isAllowedAdmin = userData.role === 'admin' || ALLOWED_ADMIN_EMAILS.includes(userEmail);

    if (!isAllowedAdmin) {
      alert('Acesso restrito a administradores autorizados!');
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}