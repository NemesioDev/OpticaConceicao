import React, { useState, useMemo } from 'react';
import { useCatalog } from '../context/CatalogContext';
import { ProductCard } from '../components/ProductCard';

interface CatalogPageProps {
  categoriaInicial?: string;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ categoriaInicial = 'todos' }) => {
  const { produtos, marcasDisponiveis } = useCatalog();

  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState(categoriaInicial);
  const [formato, setFormato] = useState('todos');
  const [marca, setMarca] = useState('todos');
  const [genero, setGenero] = useState('todos');
  const [ordenacao, setOrdenacao] = useState<'relevancia' | 'preco-asc' | 'preco-desc' | 'nome'>('relevancia');

  const formatosDisponiveis = ['Redondo', 'Quadrado', 'Aviador', 'Gatinho', 'Hexagonal', 'Retangular'];

  const produtosFiltrados = useMemo(() => {
    let lista = produtos.filter(p => p.ativo);

    if (busca.trim()) {
      const termo = busca.toLowerCase().trim();
      lista = lista.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.marca.toLowerCase().includes(termo) ||
        p.codigo.toLowerCase().includes(termo) ||
        p.formato.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
      );
    }

    if (categoria !== 'todos') {
      lista = lista.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if (formato !== 'todos') {
      lista = lista.filter(p => p.formato.toLowerCase() === formato.toLowerCase());
    }

    if (marca !== 'todos') {
      lista = lista.filter(p => p.marca.toLowerCase() === marca.toLowerCase());
    }

    if (genero !== 'todos') {
      lista = lista.filter(p => p.genero.toLowerCase() === genero.toLowerCase() || p.genero.toLowerCase() === 'unissex');
    }

    // Ordenação
    if (ordenacao === 'preco-asc') {
      lista.sort((a, b) => (a.precoReferencia || 0) - (b.precoReferencia || 0));
    } else if (ordenacao === 'preco-desc') {
      lista.sort((a, b) => (b.precoReferencia || 0) - (a.precoReferencia || 0));
    } else if (ordenacao === 'nome') {
      lista.sort((a, b) => a.nome.localeCompare(b.nome));
    } else {
      lista.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
    }

    return lista;
  }, [produtos, busca, categoria, formato, marca, genero, ordenacao]);

  const limparFiltros = () => {
    setBusca('');
    setCategoria('todos');
    setFormato('todos');
    setMarca('todos');
    setGenero('todos');
    setOrdenacao('relevancia');
  };

  return (
    <main>
      {/* Header do Catálogo */}
      <section style={{ background: 'linear-gradient(135deg, #091533, #1A3B8B)', padding: '4rem 0 3rem', color: '#FFFFFF', textAlign: 'center' }}>
        <div className="container">
          <span className="subheading-gold" style={{ color: 'var(--color-gold)' }}>Coleção Exclusiva</span>
          <h1 style={{ color: '#FFFFFF', fontSize: '2.4rem', marginBottom: '0.75rem' }}>Catálogo de Armações & Óculos</h1>
          <p style={{ color: '#CBD5E1', maxWidth: '650px', margin: '0 auto' }}>
            Use os filtros inteligentes para escolher o modelo que harmoniza com a geometria do seu rosto.
          </p>
        </div>
      </section>

      {/* Toolbar */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--color-border)', padding: '1.25rem 0', position: 'sticky', top: '85px', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ flex: 1, minWidth: '280px', maxWidth: '500px' }}>
            <input 
              type="text" 
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="🔍 Buscar por modelo, código, formato ou marca..."
              style={{ width: '100%', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', outline: 'none', background: '#F8FAFC' }}
            />
          </div>

          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            <strong style={{ color: 'var(--color-primary-dark)' }}>{produtosFiltrados.length}</strong> armações encontradas
          </div>

          <div>
            <select 
              value={ordenacao} 
              onChange={e => setOrdenacao(e.target.value as any)}
              style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', cursor: 'pointer' }}
            >
              <option value="relevancia">Destaques Primeiro</option>
              <option value="preco-asc">Menor Preço</option>
              <option value="preco-desc">Maior Preço</option>
              <option value="nome">Nome (A - Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal com Barra Lateral de Filtros */}
      <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
          {/* Sidebar de Filtros */}
          <aside style={{ background: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>⚙️ Filtros</h3>
              <button onClick={limparFiltros} style={{ background: 'none', border: 'none', color: 'var(--color-gold-hover)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                Limpar Todos
              </button>
            </div>

            {/* Categoria */}
            <div style={{ marginBottom: '1.75rem' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Tipo</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {['todos', 'Grau', 'Sol', 'Infantil'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoria(cat)}
                    style={{ 
                      padding: '0.4rem 0.85rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      border: '1px solid transparent',
                      background: categoria === cat ? 'var(--color-primary)' : '#F1F5F9',
                      color: categoria === cat ? '#FFFFFF' : 'var(--color-text-main)'
                    }}
                  >
                    {cat === 'todos' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Formato de Aro */}
            <div style={{ marginBottom: '1.75rem' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Formato do Aro</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <button 
                  onClick={() => setFormato('todos')}
                  style={{ 
                    padding: '0.4rem 0.85rem', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '0.8rem', 
                    cursor: 'pointer',
                    background: formato === 'todos' ? 'var(--color-primary)' : '#F1F5F9',
                    color: formato === 'todos' ? '#FFFFFF' : 'var(--color-text-main)',
                    border: 'none'
                  }}
                >
                  Todos
                </button>
                {formatosDisponiveis.map(fmt => (
                  <button 
                    key={fmt}
                    onClick={() => setFormato(fmt)}
                    style={{ 
                      padding: '0.4rem 0.85rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.8rem', 
                      cursor: 'pointer',
                      background: formato === fmt ? 'var(--color-primary)' : '#F1F5F9',
                      color: formato === fmt ? '#FFFFFF' : 'var(--color-text-main)',
                      border: 'none'
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Marca */}
            <div style={{ marginBottom: '1.75rem' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Marca</strong>
              <select 
                value={marca} 
                onChange={e => setMarca(e.target.value)}
                style={{ width: '100%', padding: '0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }}
              >
                <option value="todos">Todas as Marcas</option>
                {marcasDisponiveis.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Gênero */}
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Linha</strong>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['todos', 'Feminino', 'Masculino', 'Unissex'].map(g => (
                  <button 
                    key={g}
                    onClick={() => setGenero(g)}
                    style={{ 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: 'var(--radius-full)', 
                      fontSize: '0.75rem', 
                      cursor: 'pointer',
                      border: 'none',
                      background: genero === g ? 'var(--color-primary)' : '#F1F5F9',
                      color: genero === g ? '#FFFFFF' : 'var(--color-text-main)'
                    }}
                  >
                    {g === 'todos' ? 'Todas' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Dica */}
            <div style={{ background: 'rgba(245, 197, 68, 0.15)', border: '1px solid rgba(245, 197, 68, 0.4)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>💡 Dica Óptica</h4>
              <p style={{ fontSize: '0.775rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                Em nossa loja em Maracanaú você pode experimentar todas essas armações com auxílio de espelhos especiais e ajuste milimétrico gratuito!
              </p>
            </div>
          </aside>

          {/* Grid de Produtos */}
          <div>
            {produtosFiltrados.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👓</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>Nenhuma armação encontrada</h3>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                  Tente alterar os filtros ou clique em limpar para visualizar todos os modelos.
                </p>
                <button className="btn btn-outline-gold" onClick={limparFiltros}>
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {produtosFiltrados.map(prod => (
                  <ProductCard key={prod.id} produto={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
