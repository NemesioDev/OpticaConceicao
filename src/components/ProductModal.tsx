import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';

export const ProductModal: React.FC = () => {
  const { produtoModal, fecharModal } = useCatalog();
  const [fotoAtiva, setFotoAtiva] = useState<string>('');

  if (!produtoModal) return null;

  const fotos = produtoModal.imagens && produtoModal.imagens.length > 0 
    ? produtoModal.imagens 
    : ['https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80'];

  const fotoExibida = fotoAtiva || fotos[0];

  const precoFormatado = produtoModal.precoReferencia 
    ? produtoModal.precoReferencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'Sob Consulta';

  const mensagemWhatsApp = encodeURIComponent(
    `Olá, Óptica Conceição! Vi a armação "${produtoModal.nome}" (${produtoModal.codigo}) da marca ${produtoModal.marca} no catálogo online e gostaria de saber se vocês têm disponível para experimentar na loja em Maracanaú!`
  );

  return (
    <div className="modal-overlay" onClick={fecharModal}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={fecharModal} aria-label="Fechar">
          ✕
        </button>

        <div className="modal-grid-responsive">
          {/* Galeria */}
          <div>
            <div style={{ width: '100%', height: '320px', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#F8FAFC', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={fotoExibida} alt={produtoModal.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {fotos.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                {fotos.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setFotoAtiva(img)}
                    style={{ 
                      width: '65px', 
                      height: '65px', 
                      borderRadius: 'var(--radius-sm)', 
                      cursor: 'pointer',
                      border: fotoExibida === img ? '2px solid var(--color-gold)' : '2px solid transparent',
                      overflow: 'hidden' 
                    }}
                  >
                    <img src={img} alt="Miniatura" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informações e WhatsApp */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="subheading-gold" style={{ marginBottom: '0.25rem' }}>
              {produtoModal.marca} • {produtoModal.categoria}
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              {produtoModal.nome}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', marginBottom: '1.25rem' }}>
              Código de Referência: {produtoModal.codigo}
            </span>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {produtoModal.descricao}
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.6rem', color: 'var(--color-primary-dark)' }}>
                Dimensões Técnicas:
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: '#F8FAFC', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Material</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{produtoModal.material}</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Formato do Aro</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{produtoModal.formato}</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Largura da Lente</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{produtoModal.medidas.lente}</strong>
                </div>
                <div style={{ background: '#F8FAFC', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Ponte / Haste</span>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{produtoModal.medidas.ponte} / {produtoModal.medidas.haste}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Valor de referência:</span>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>{precoFormatado}</span>
              </div>

              <a 
                href={`https://wa.me/558588220984?text=${mensagemWhatsApp}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-whatsapp"
                style={{ width: '100%', fontSize: '1rem' }}
              >
                <span>💬</span> Consultar Disponibilidade no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
