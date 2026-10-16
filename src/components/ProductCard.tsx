import React from 'react';
import { Produto } from '../types/produto';
import { useCatalog } from '../context/CatalogContext';

interface ProductCardProps {
  produto: Produto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ produto }) => {
  const { abrirModal } = useCatalog();

  const imagemPrincipal = produto.imagens && produto.imagens.length > 0
    ? produto.imagens[0]
    : 'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80';

  const precoFormatado = produto.precoReferencia
    ? produto.precoReferencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'Sob Consulta';

  return (
    <article className="product-card">
      <div className="product-badges">
        {produto.destaque && <span className="badge badge-gold">Destaque</span>}
        {produto.novidade && <span className="badge badge-novo">Novo</span>}
      </div>

      <div className="product-image-container" onClick={() => abrirModal(produto)}>
        <img src={imagemPrincipal} alt={produto.nome} loading="lazy" />
      </div>

      <div className="product-info">
        <div className="product-meta">
          <span className="product-brand">{produto.marca}</span>
          <span className="product-code">{produto.codigo}</span>
        </div>

        <h3 
          className="product-title" 
          onClick={() => abrirModal(produto)} 
          style={{ cursor: 'pointer' }}
        >
          {produto.nome}
        </h3>

        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className="tag-spec">Aro: {produto.formato}</span>
          <span className="tag-spec">{produto.genero}</span>
          <span className="tag-spec">{produto.categoria}</span>
        </div>

        <div className="product-footer">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light)', textTransform: 'uppercase' }}>
              Ref. a partir de
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>
              {precoFormatado}
            </span>
          </div>

          <button 
            className="btn btn-outline-gold btn-sm"
            onClick={() => abrirModal(produto)}
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </article>
  );
};
