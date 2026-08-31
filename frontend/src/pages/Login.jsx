import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div style={styles.pageContainer}>
      <div style={styles.mainCard}>
        
        {/* COLUNA DA ESQUERDA: HERO NO AZUL DA REFERÊNCIA */}
        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.sheetPreviewCard}>
              <div style={styles.sheetHeader}>
                <span style={{ ...styles.dot, backgroundColor: '#ff5f56' }}></span>
                <span style={{ ...styles.dot, backgroundColor: '#ffbd2e' }}></span>
                <span style={{ ...styles.dot, backgroundColor: '#27c93f' }}></span>
              </div>
              <div style={styles.sheetGrid}>
                <div style={styles.gridRowHeader}>
                  <span>A</span><span>B</span><span>C</span><span>D</span>
                </div>
                <div style={styles.gridRow}>
                  <div style={styles.cellActive}></div>
                  <div style={styles.cell}></div>
                  <div style={styles.cell}></div>
                  <div style={styles.cell}></div>
                </div>
                <div style={styles.gridRow}>
                  <div style={styles.cell}></div>
                  <div style={styles.cellActive}></div>
                  <div style={styles.cell}></div>
                  <div style={styles.cell}></div>
                </div>
              </div>

              <div style={styles.floatingChart}>
                <div style={{ ...styles.bar, height: '40%', background: '#93c5fd' }}></div>
                <div style={{ ...styles.bar, height: '70%', background: '#3b82f6' }}></div>
                <div style={{ ...styles.bar, height: '100%', background: '#1d4ed8' }}></div>
              </div>
            </div>

            <h2 style={styles.heroTitle}>Organize. Analise.<br />Transforme dados em decisões.</h2>
            <p style={styles.heroSubtitle}>Sua plataforma inteligente de planilhas online.</p>
          </div>
        </div>

        {/* COLUNA DA DIREITA: FORMULÁRIO */}
        <div style={styles.formSection}>
          
          <div style={styles.brandHeader}>
            <div style={styles.logoIcon}>📊</div>
            <div>
              <h3 style={styles.brandName}>SheetHub</h3>
              <p style={styles.brandTagline}>Planilhas que simplificam.</p>
            </div>
          </div>

          <div style={styles.welcomeText}>
            <h1 style={styles.title}>
              {isRegister ? 'Crie sua conta' : 'Bem-vindo de volta!'}
            </h1>
            <p style={styles.subtitle}>
              {isRegister ? 'Preencha os dados abaixo' : 'Faça login para acessar suas planilhas.'}
            </p>
          </div>

          {errorMessage && <div style={styles.errorBanner}>⚠️ {errorMessage}</div>}
          {successMessage && <div style={styles.successBanner}>✅ {successMessage}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            
            {isRegister && (
              <div style={styles.inputGroup}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  type="text"
                  placeholder="Nome Completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.inputField}
                />
              </div>
            )}

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>✉</span>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.inputField}
              />
            </div>

            <div style={styles.inputGroup}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.inputField}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePasswordBtn}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'wait' : 'pointer'
              }}
            >
              {loading ? 'A PROCESSAR...' : isRegister ? 'CRIAR CONTA' : 'ENTRAR'}
            </button>
          </form>

          <p style={styles.footerText}>
            {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
            <button type="button" onClick={handleToggleMode} style={styles.toggleBtn}>
              {isRegister ? 'Faça login' : 'Criar conta'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '##f8fafc',
    padding: '1.5rem',
    boxSizing: 'border-box',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  mainCard: {
    width: '100%',
    maxWidth: '920px',
    borderRadius: '24px',
    backgroundColor: '#ffffff',
    boxShadow: '0 20px 45px -15px rgba(37, 99, 235, 0.12)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    overflow: 'hidden'
  },
  heroSection: {
    flex: 1,
    background: 'linear-gradient(135deg, #eef2ff 0%, #dbeafe 100%)',
    borderRight: '1px solid #dbeafe',
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  heroContent: {
    maxWidth: '340px'
  },
  heroTitle: {
    color: '#1e3a8a',
    fontSize: '1.4rem',
    fontWeight: 'bold',
    lineHeight: '1.4',
    marginTop: '2rem',
    marginBottom: '0.5rem'
  },
  heroSubtitle: {
    color: '#3b82f6',
    fontSize: '0.9rem',
    margin: 0
  },
  sheetPreviewCard: {
    width: '100%',
    height: '180px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
    padding: '12px',
    position: 'relative',
    boxShadow: '0 8px 20px rgba(37, 99, 235, 0.08)'
  },
  sheetHeader: {
    display: 'flex',
    gap: '6px',
    marginBottom: '12px'
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%'
  },
  sheetGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  gridRowHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px',
    color: '#93c5fd',
    fontSize: '0.7rem',
    textAlign: 'center'
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '6px'
  },
  cell: {
    height: '18px',
    backgroundColor: '#f8fafc',
    borderRadius: '4px'
  },
  cellActive: {
    height: '18px',
    backgroundColor: '#dbeafe',
    border: '1px solid #2563eb',
    borderRadius: '4px'
  },
  floatingChart: {
    position: 'absolute',
    bottom: '-15px',
    right: '-15px',
    width: '100px',
    height: '70px',
    backgroundColor: '#ffffff',
    border: '1px solid #bfdbfe',
    borderRadius: '10px',
    padding: '8px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    boxShadow: '0 10px 20px rgba(37, 99, 235, 0.12)'
  },
  bar: {
    width: '12px',
    borderRadius: '3px 3px 0 0'
  },
  formSection: {
    flex: 1.1,
    padding: '3rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  brandHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '1.5rem'
  },
  logoIcon: {
    fontSize: '1.5rem',
    background: '#eff6ff',
    border: '1px solid #dbeafe',
    padding: '6px 10px',
    borderRadius: '10px'
  },
  brandName: {
    color: '#0f172a',
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  brandTagline: {
    color: '#64748b',
    margin: 0,
    fontSize: '0.75rem'
  },
  welcomeText: {
    marginBottom: '1.5rem'
  },
  title: {
    color: '#0f172a',
    fontSize: '1.5rem',
    margin: 0,
    fontWeight: '600'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '0.85rem',
    marginTop: '4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #cbd5e1',
    paddingBottom: '0.4rem',
    marginBottom: '1.75rem'
  },
  inputIcon: {
    color: '#64748b',
    fontSize: '1rem',
    marginRight: '0.75rem'
  },
  inputField: {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#0f172a',
    fontSize: '0.95rem'
  },
  togglePasswordBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: '0.75rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0 4px'
  },
  submitBtn: {
    width: '100%',
    padding: '0.85rem',
    marginTop: '0.5rem',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    letterSpacing: '1px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
  },
  footerText: {
    textAlign: 'center',
    fontSize: '0.8rem',
    color: '#64748b',
    marginTop: '1.5rem',
    marginBottom: 0
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0,
    fontSize: '0.8rem'
  },
  errorBanner: {
    padding: '0.6rem',
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    fontSize: '0.75rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  successBanner: {
    padding: '0.6rem',
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    fontSize: '0.75rem',
    marginBottom: '1rem',
    textAlign: 'center'
  }
};