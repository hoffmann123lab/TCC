import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados de Feedback
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password || (isRegister && !name)) {
      setErrorMessage('Por favor, preencha todos os campos!');
      return;
    }

    const endpoint = isRegister 
      ? 'http://localhost:5000/api/users/register' 
      : 'http://localhost:5000/api/users/login';

    const bodyData = isRegister 
      ? { name, email, password } 
      : { email, password };

    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Erro ao realizar a operação.');
        return;
      }

      if (isRegister) {
        setSuccessMessage('Conta criada com sucesso! Faça login para continuar.');
        setIsRegister(false);
        setName('');
        setPassword('');
      } else {
        localStorage.setItem('user_authenticated', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Erro de conexão com o servidor!');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="login-page-container">
      <div className="login-main-card">
        
        {/* COLUNA DA ESQUERDA: HERO */}
        <div className="login-hero-section">
          <div className="login-hero-content">
            <div className="login-sheet-preview-card">
              <div className="login-sheet-header">
                <span className="login-dot login-dot-red"></span>
                <span className="login-dot login-dot-yellow"></span>
                <span className="login-dot login-dot-green"></span>
              </div>
              <div className="login-sheet-grid">
                <div className="login-grid-row-header">
                  <span>A</span><span>B</span><span>C</span><span>D</span>
                </div>
                <div className="login-grid-row">
                  <div className="login-cell-active"></div>
                  <div className="login-cell"></div>
                  <div className="login-cell"></div>
                  <div className="login-cell"></div>
                </div>
                <div className="login-grid-row">
                  <div className="login-cell"></div>
                  <div className="login-cell-active"></div>
                  <div className="login-cell"></div>
                  <div className="login-cell"></div>
                </div>
              </div>

              <div className="login-floating-chart">
                <div className="login-bar login-bar-1"></div>
                <div className="login-bar login-bar-2"></div>
                <div className="login-bar login-bar-3"></div>
              </div>
            </div>

            <h2 className="login-hero-title">Organize. Analise.<br />Transforme dados em decisões.</h2>
            <p className="login-hero-subtitle">Sua plataforma inteligente de planilhas online.</p>
          </div>
        </div>

        {/* COLUNA DA DIREITA: FORMULÁRIO */}
        <div className="login-form-section">
          
          <div className="login-brand-header">
            <div className="login-logo-icon">📊</div>
            <div>
              <h3 className="login-brand-name">SheetHub</h3>
              <p className="login-brand-tagline">Planilhas que simplificam.</p>
            </div>
          </div>

          <div className="login-welcome-text">
            <h1 className="login-title">
              {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta!'}
            </h1>
            <p className="login-subtitle">
              {isRegister ? 'Preencha os dados abaixo' : 'Faça login para acessar suas planilhas.'}
            </p>
          </div>

          {errorMessage && <div className="login-error-banner">⚠️ {errorMessage}</div>}
          {successMessage && <div className="login-success-banner">✅ {successMessage}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            
            {isRegister && (
              <div className="login-input-group">
                <span className="login-input-icon">👤</span>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input-field"
                />
              </div>
            )}

            <div className="login-input-group">
              <span className="login-input-icon">✉</span>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input-field"
              />
            </div>

            <div className="login-input-group">
              <span className="login-input-icon">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input-field"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-password-btn"
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? 'A PROCESSAR...' : isRegister ? 'CRIAR CONTA' : 'ENTRAR'}
            </button>
          </form>

          <p className="login-footer-text">
            {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button type="button" onClick={handleToggleMode} className="login-toggle-btn">
              {isRegister ? 'Faça login' : 'Criar conta'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}