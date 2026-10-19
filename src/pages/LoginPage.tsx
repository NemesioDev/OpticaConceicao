import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '../context/CatalogContext';
import { LOGO_URL } from '../lib/supabase';

interface LoginPageProps {
  navegarPara?: (pagina: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navegarPara }) => {
  const { loginAdmin } = useCatalog();
  const navigate = useNavigate();

  const handleNav = (pagina: string) => {
    if (navegarPara) {
      navegarPara(pagina);
    } else {
      if (pagina === 'admin') navigate('/admin');
      else if (pagina === 'home') navigate('/');
      else navigate(`/${pagina}`);
    }
  };
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erroMsg, setErroMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErroMsg(null);

    const resultado = await loginAdmin(usuario, senha);
    setLoading(false);

    if (resultado.success) {
      handleNav('admin');
    } else {
      setErroMsg(resultado.error || 'Usuário ou senha inválidos.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at top right, #1A3B8B 0%, #091533 100%)', padding: '1.5rem' }}>
      <div style={{ background: '#FFFFFF', width: '100%', maxWidth: '440px', borderRadius: 'var(--radius-lg)', padding: '2.75rem 2.25rem', boxShadow: '0 25px 60px rgba(9, 21, 51, 0.45)', border: '1px solid rgba(245, 197, 68, 0.4)', textAlign: 'center' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <img 
            src={LOGO_URL} 
            alt="Óptica Conceição" 
            style={{ maxHeight: '60px', maxWidth: '100%', objectFit: 'contain' }} 
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/logo.png'; }}
          />
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          Painel de Gestão do Catálogo & Vitrine
        </p>

        {erroMsg && (
          <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {erroMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              E-mail ou Usuário
            </label>
            <input 
              type="text" 
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
              placeholder="Digite seu e-mail ou usuário"
              autoComplete="username"
              required
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary-dark)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Senha de Acesso
            </label>
            <input 
              type="password" 
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', outline: 'none' }}
            />
          </div>

          <button type="submit" className="btn btn-gold" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Autenticando...' : 'Entrar no Painel →'}
          </button>

          <button 
            type="button"
            onClick={() => handleNav('home')}
            style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: 'var(--color-text-muted)', cursor: 'pointer', textDecoration: 'none' }}
          >
            ← Voltar para o Site Principal
          </button>
        </form>
      </div>
    </div>
  );
};
