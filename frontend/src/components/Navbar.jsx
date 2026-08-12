import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">📊</div>
          <span>SheetMaker</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-item">Dashboard</Link>
          <Link to="/templates" className="nav-item">Modelos</Link> {/* 👈 GARANTIR ESTE LINK */}
        </div>

        <div className="navbar-actions">
          <button className="btn-new-sheet">+ Criar Planilha</button>
          <div className="user-profile">
            <div className="avatar">A</div>
            <span className="user-name">Aluno</span>
          </div>
        </div>
      </div>
    </nav>
  );
}