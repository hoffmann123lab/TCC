import { BrowserRouter as Router, Routes, Route, useParams, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import MySheets from './pages/MySheets';
import SheetView from './pages/SheetView';
import ManageSheets from './pages/ManageSheets';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div className="app-layout">
      {!isLoginPage && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* Login */}
          <Route path="/" element={<Login />} />

          {/* Rotas de Usuário Logado */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/templates" 
            element={
              <ProtectedRoute>
                <Templates />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sheets" 
            element={
              <ProtectedRoute>
                <MySheets />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sheet/:id" 
            element={
              <ProtectedRoute>
                <SheetViewWrapper />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/create-sheet" 
            element={
              <ProtectedRoute>
                <SheetView />
              </ProtectedRoute>
            } 
          />

          {/* Rota de Admin */}
          <Route 
            path="/admin/sheets" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <ManageSheets />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

function SheetViewWrapper() {
  const { id } = useParams();
  return <SheetView key={id} />;
}