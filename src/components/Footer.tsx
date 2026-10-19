import React from 'react';
import { LOGO_URL } from '../lib/supabase';

interface FooterProps {
  navegarPara: (pagina: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navegarPara }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="brand-logo-darkbg">
                <img 
                  src={LOGO_URL} 
                  alt="Óptica Conceição" 
                  className="brand-logo-img" 
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/logo.png'; }}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: '#94A3B8' }}>
              Tradição, saúde visual e estética refinada no coração de Maracanaú. A Óptica Conceição oferece um catálogo selecionado com assessoria para seu rosto e grau.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>Navegação</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => navegarPara('home')} className="top-bar-item">Página Inicial</button>
              <button onClick={() => navegarPara('catalogo')} className="top-bar-item">Catálogo Completo</button>
              <button onClick={() => navegarPara('admin')} className="top-bar-item">Painel do Lojista</button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>Atendimento</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
              <a href="https://wa.me/558588220984" target="_blank" rel="noopener noreferrer" className="top-bar-item">
                WhatsApp: (85) 8822-0984
              </a>
              <span style={{ color: '#94A3B8' }}>Rua Capitão Valdemar de Lima, 116 C</span>
              <span style={{ color: '#94A3B8' }}>Centro, Maracanaú - CE</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', marginBottom: '1.25rem' }}>Horários da Loja</h4>
            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#CBD5E1' }}>Segunda a Sexta: 08h às 17h</p>
            <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#CBD5E1' }}>Sábados: 08h às 12h</p>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}>
              📍 Localização no Centro de Maracanaú
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
          <div>© 2026 Óptica Conceição. Todos os direitos reservados.</div>
          <div>Desenvolvido com React + TypeScript de alta performance.</div>
        </div>
      </div>
    </footer>
  );
};
