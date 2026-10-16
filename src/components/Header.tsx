import React from 'react';

interface HeaderProps {
  paginaAtual: string;
  navegarPara: (pagina: string, params?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ paginaAtual, navegarPara }) => {
  return (
    <>
      {/* Barra Superior Informativa */}
      <aside className="top-bar">
        <div className="container">
          <div className="top-bar-item">
            <span>📍</span> Rua Capitão Valdemar de Lima, 116 C — Centro, Maracanaú - CE
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <a 
              href="https://wa.me/558588220984" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="top-bar-item"
            >
              <span>💬</span> (85) 8822-0984
            </a>
            <button 
              onClick={() => navegarPara('admin')} 
              className="top-bar-item" 
              style={{ color: 'var(--color-gold)' }}
            >
              <span>🔒</span> Acesso Lojista
            </button>
          </div>
        </div>
      </aside>

      {/* Navbar Fixa */}
      <header className="navbar">
        <div className="container">
          <button 
            onClick={() => navegarPara('home')} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src="/assets/images/logo.png" alt="Óptica Conceição" className="brand-logo-img" />
          </button>

          <nav>
            <ul className="nav-menu">
              <li>
                <button 
                  className={`nav-link ${paginaAtual === 'home' ? 'active' : ''}`}
                  onClick={() => navegarPara('home')}
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  className={`nav-link ${paginaAtual === 'catalogo' ? 'active' : ''}`}
                  onClick={() => navegarPara('catalogo')}
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button 
                  className="nav-link"
                  onClick={() => navegarPara('catalogo', 'Grau')}
                >
                  Grau
                </button>
              </li>
              <li>
                <button 
                  className="nav-link"
                  onClick={() => navegarPara('catalogo', 'Sol')}
                >
                  Óculos de Sol
                </button>
              </li>
              <li>
                <button 
                  className="nav-link"
                  onClick={() => {
                    navegarPara('home');
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

          <div>
            <a 
              href="https://wa.me/558588220984?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20as%20arma%C3%A7%C3%B5es." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-whatsapp btn-sm"
            >
              <span>💬</span> WhatsApp: (85) 8822-0984
            </a>
          </div>
        </div>
      </header>
    </>
  );
};
