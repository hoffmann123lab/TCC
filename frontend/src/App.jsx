import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import MySheets from './pages/MySheets';
import SheetView from './pages/SheetView';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Barra de Navegação no topo */}
        <Navbar />

        {/* Conteúdo Principal das Páginas */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/sheets" element={<MySheets />} />
            
            {/* A propriedade key garante que, ao mudar de /sheet/1 para /sheet/2, 
              o React crie o componente SheetView do zero sem precisar de useEffect com setState.
            */}
            <Route 
              path="/sheet/:id" 
              element={<SheetViewWrapper />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Wrapper auxiliar para forçar o recarregamento limpo do SheetView ao mudar o ID
import { useParams } from 'react-router-dom';

function SheetViewWrapper() {
  const { id } = useParams();
  return <SheetView key={id} />;
}