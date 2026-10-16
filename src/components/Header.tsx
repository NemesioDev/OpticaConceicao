import React, { useState } from 'react';
import { LOGO_URL } from '../lib/supabase';

interface HeaderProps {
  paginaAtual: string;
  navegarPara: (pagina: string, params?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ paginaAtual, navegarPara }) => {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleNavegacao = (pagina: string, param?: string) => {
    navegarPara(pagina, param);
    setMenuAberto(false);
  };

  return (
    <>
      {/* Barra Superior Informativa */}
      <aside className="top-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div className="top-bar-item" style={{ fontSize: '0.775rem' }}>
            <span>📍</span> Rua Capitão Valdemar de Lima, 116 C — Centro, Maracanaú - CE
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.775rem' }}>
            <a 
              href="https://wa.me/558588220984" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="top-bar-item"
            >
              <span>💬</span> (85) 8822-0984
            </a>
            <button 
              onClick={() => handleNavegacao('admin')} 
              className="top-bar-item" 
              style={{ color: 'var(--color-gold)', fontWeight: 600 }}
            >
              <span>🔒</span> Acesso Lojista
            </button>
          </div>
        </div>
      </aside>

      {/* Navbar Fixa */}
      <header className="navbar">
        <div className="container header-container-flex">
          {/* Logo */}
          <button 
            onClick={() => handleNavegacao('home')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img 
              src={LOGO_URL} 
              alt="Óptica Conceição" 
              className="brand-logo-img" 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/logo.png'; }}
            />
          </button>

          {/* Menu Desktop */}
          <nav className="desktop-nav">
            <ul className="nav-menu">
              <li>
                <button 
                  className={`nav-link ${paginaAtual === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavegacao('home')}
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${paginaAtual === 'catalogo' ? 'active' : ''}`}
                  onClick={() => handleNavegacao('catalogo')}
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button 
                  className="nav-link"
                  onClick={() => handleNavegacao('catalogo', 'Grau')}
                >
                  Grau
                </button>
              </li>
              <li>
                <button 
                  className="nav-link"
                  onClick={() => handleNavegacao('catalogo', 'Sol')}
                >
                  Óculos de Sol
                </button>
              </li>
              <li>
                <button 
                  className="nav-link"
                  onClick={() => {
                    handleNavegacao('home');
                    setTimeout(() => {
                      document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                >
                  Onde Estamos
                </button>
              </li>
            </ul>
          </nav>

          {/* Botão WhatsApp Desktop */}
          <div className="desktop-cta">
            <a 
              href="https://wa.me/558588220984?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20arma%C3%A7%C3%B5es." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp btn-sm"
            >
              <span>💬</span> WhatsApp
            </a>
          </div>

          {/* Botão Menu Hambúrguer (Mobile) */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Abrir Menu"
          >
            {menuAberto ? '✕' : '☰'}
          </button>
        </div>

        {/* Menu Mobile Retrátil */}
        {menuAberto && (
          <div className="mobile-nav-drawer">
            <button 
              className={`mobile-nav-link ${paginaAtual === 'home' ? 'active' : ''}`}
              onClick={() => handleNavegacao('home')}
            >
              🏠 Início
            </button>
            <button 
              className={`mobile-nav-link ${paginaAtual === 'catalogo' ? 'active' : ''}`}
              onClick={() => handleNavegacao('catalogo')}
            >
              👓 Catálogo Completo
            </button>
            <button 
              className="mobile-nav-link"
              onClick={() => handleNavegacao('catalogo', 'Grau')}
            >
              👓 Armações de Grau
            </button>
            <button 
              className="mobile-nav-link"
              onClick={() => handleNavegacao('catalogo', 'Sol')}
            >
              🕶️ Óculos de Sol
            </button>
            <button 
              className="mobile-nav-link"
              onClick={() => {
                handleNavegacao('home');
                setTimeout(() => {
                  document.getElementById('localizacao')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              📍 Onde Estamos (Maracanaú)
            </button>
            <button 
              className="mobile-nav-link"
              onClick={() => handleNavegacao('admin')}
              style={{ color: 'var(--color-gold-hover)', fontWeight: 700 }}
            >
              🔒 Acesso Lojista (Admin)
            </button>

            <a 
              href="https://wa.me/558588220984?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20arma%C3%A7%C3%B5es." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp"
              style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}
            >
              <span>💬</span> Falar no WhatsApp: (85) 8822-0984
            </a>
          </div>
        )}
      </header>
    </>
  );
};
