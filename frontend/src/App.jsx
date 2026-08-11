import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SheetView from './pages/SheetView';

export default function App() {
  return (
    <BrowserRouter>
      {/* Barra de navegação visível em todas as páginas */}
      <Navbar />

      {/* Gerenciamento das rotas da aplicação */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sheet/:id" element={<SheetView />} />
      </Routes>
    </BrowserRouter>
  );
}