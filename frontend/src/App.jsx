import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import SheetView from './pages/SheetView';
import Templates from './pages/Templates'; // 👈 1. IMPORTAR AQUI

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sheet/:id" element={<SheetView />} />
        <Route path="/templates" element={<Templates />} /> {/* 👈 2. ADICIONAR A ROTA AQUI */}
      </Routes>
    </BrowserRouter>
  );
}