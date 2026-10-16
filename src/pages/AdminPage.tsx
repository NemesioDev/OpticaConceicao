import React, { useState } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { Produto } from '../types/produto';
import { AdminProductModal } from '../components/AdminProductModal';
import { LOGO_URL } from '../lib/supabase';

interface AdminPageProps {
  navegarPara: (pagina: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navegarPara }) => {
  const { 
    produtos, 
    estatisticas, 
    toggleDestaque, 
    atualizarProduto, 
    removerProduto, 
    resetarCatalogo, 
    logoutAdmin 
  } = useCatalog();

  const [buscaTabela, setBuscaTabela] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const produtosFiltrados = produtos.filter(p => {
    if (!buscaTabela.trim()) return true;
    const t = buscaTabela.toLowerCase().trim();
    return p.nome.toLowerCase().includes(t) || 
           p.marca.toLowerCase().includes(t) || 
           p.codigo.toLowerCase().includes(t) ||
           p.categoria.toLowerCase().includes(t);
  });

  const abrirNovo = () => {
    setProdutoEditando(null);
    setModalAberto(true);
  };

  const abrirEdicao = (prod: Produto) => {
    setProdutoEditando(prod);
    setModalAberto(true);
  };

  const handleExcluir = (id: string, nome: string) => {
    if (confirm(`Tem certeza que deseja excluir o modelo "${nome}" do catálogo?`)) {
      removerProduto(id);
    }
  };

  const [sidebarAbertaMobile, setSidebarAbertaMobile] = useState(false);

  return (
    <div className="admin-layout-responsive">
      {/* Barra de Topo no Mobile */}
      <div className="admin-mobile-header">
        <button 
          className="btn btn-dark btn-sm"
          onClick={() => setSidebarAbertaMobile(!sidebarAbertaMobile)}
        >
          {sidebarAbertaMobile ? '✕ Fechar Menu' : '☰ Menu do Painel'}
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>Admin Conceição</span>
      </div>

      {/* Sidebar Admin */}
      <aside className={`admin-sidebar-responsive ${sidebarAbertaMobile ? 'mobile-open' : ''}`}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ background: '#FFFFFF', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'center' }}>
            <img 
              src={LOGO_URL} 
              alt="Óptica Conceição" 
              style={{ maxHeight: '38px', objectFit: 'contain' }} 
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/assets/images/logo.png'; }}
            />
          </div>
        </div>

        <div style={{ padding: '1rem 0', flexGrow: 1 }}>
          <button 
            style={{ width: '100%', padding: '0.85rem 1.5rem', background: 'rgba(255,255,255,0.08)', border: 'none', borderLeft: '3px solid var(--color-gold)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '0.9rem' }}
          >
            👓 Gerenciar Catálogo
          </button>
          <button 
            onClick={() => navegarPara('catalogo')}
            style={{ width: '100%', padding: '0.85rem 1.5rem', background: 'none', border: 'none', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}
          >
            👁️ Ver Catálogo Público ↗
          </button>
          <button 
            onClick={() => navegarPara('home')}
            style={{ width: '100%', padding: '0.85rem 1.5rem', background: 'none', border: 'none', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem' }}
          >
            🌐 Ver Site Oficial ↗
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button 
            onClick={() => {
              if (confirm('Deseja recarregar o catálogo padrão de demonstração?')) {
                resetarCatalogo();
              }
            }}
            className="btn btn-outline-gold btn-sm"
            style={{ width: '100%', color: '#CBD5E1', marginBottom: '0.75rem', fontSize: '0.75rem' }}
          >
            ↻ Restaurar Catálogo Demo
          </button>
          <button 
            onClick={() => {
              logoutAdmin();
              navegarPara('home');
            }}
            className="btn btn-dark btn-sm"
            style={{ width: '100%', background: 'rgba(255,255,255,0.08)' }}
          >
            🚪 Sair do Painel
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: '#FFFFFF', height: '70px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '1.35rem', color: 'var(--color-primary-dark)' }}>Gestão do Catálogo & Armações</h2>
          <button onClick={abrirNovo} className="btn btn-gold btn-sm">
            <span>➕</span> Cadastrar Nova Armação
          </button>
        </header>

        <div style={{ padding: '2rem' }}>
          {/* Métricas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>👓</div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary-dark)' }}>{estatisticas.total}</h3>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total de Modelos</span>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>✓</div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-success)' }}>{estatisticas.ativos}</h3>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Modelos Ativos</span>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>★</div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-gold-hover)' }}>{estatisticas.destaques}</h3>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Destaques Vitrine</span>
              </div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>🏷️</div>
              <div>
                <h3 style={{ fontSize: '1.6rem', color: 'var(--color-primary)' }}>{estatisticas.marcas}</h3>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600 }}>Marcas Cadastradas</span>
              </div>
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <input 
                type="text" 
                value={buscaTabela}
                onChange={e => setBuscaTabela(e.target.value)}
                placeholder="Filtrar por nome, código ou marca..."
                style={{ padding: '0.65rem 1rem', width: '320px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                Clique na estrela para alternar destaques na vitrine inicial da loja.
              </span>
            </div>

            <div className="admin-table-scroll">
              <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Armação / SKU</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Marca</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Categoria</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Formato</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Preço Ref.</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Destaque / Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                      Nenhum produto cadastrado ou correspondente à busca.
                    </td>
                  </tr>
                ) : (
                  produtosFiltrados.map(prod => (
                    <tr key={prod.id} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <img 
                            src={prod.imagens[0] || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80'} 
                            alt={prod.nome} 
                            style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                          />
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-primary-dark)' }}>{prod.nome}</strong>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{prod.codigo}</span>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem' }}>{prod.marca}</td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <span className={`badge ${prod.categoria === 'Grau' ? 'badge-dark' : 'badge-gold'}`}>
                          {prod.categoria}
                        </span>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem' }}>{prod.formato}</td>

                      <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
                        {prod.precoReferencia 
                          ? prod.precoReferencia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                          : 'Sob Consulta'}
                      </td>

                      <td style={{ padding: '1rem 1.25rem' }}>
                        <button 
                          onClick={() => toggleDestaque(prod.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: prod.destaque ? 'var(--color-gold)' : '#CBD5E1' }}
                          title="Alternar destaque na vitrine"
                        >
                          {prod.destaque ? '★' : '☆'}
                        </button>
                        <button 
                          onClick={() => atualizarProduto(prod.id, { ativo: !prod.ativo })}
                          style={{ marginLeft: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: prod.ativo ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}
                        >
                          {prod.ativo ? '● Ativo' : '○ Inativo'}
                        </button>
                      </td>

                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <button 
                          onClick={() => abrirEdicao(prod)} 
                          style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.35rem 0.6rem', cursor: 'pointer', marginRight: '0.4rem' }}
                          title="Editar armação"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleExcluir(prod.id, prod.nome)} 
                          style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '4px', padding: '0.35rem 0.6rem', cursor: 'pointer' }}
                          title="Excluir armação"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Cadastro / Edição */}
      {modalAberto && (
        <AdminProductModal 
          produtoEditando={produtoEditando} 
          onClose={() => setModalAberto(false)} 
        />
      )}
    </div>
  );
};
