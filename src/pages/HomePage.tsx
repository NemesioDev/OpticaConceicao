import React from 'react';
import { useCatalog } from '../context/CatalogContext';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  navegarPara: (pagina: string, param?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navegarPara }) => {
  const { produtos } = useCatalog();

  const produtosDestaque = produtos
    .filter(p => p.ativo && p.destaque)
    .slice(0, 4);

  return (
    <main>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-pattern"></div>
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-badge">
                <span>✨</span> Nova Coleção 2026 / 2027
              </div>
              <h1 className="heading-display hero-title">
                Sua visão com a clareza e a <span>elegância</span> que você merece.
              </h1>
              <p className="hero-desc">
                Curadoria de grifes internacionais e armações artesanais no Centro de Maracanaú. Descubra a armação ideal com assessoria de especialistas.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => navegarPara('catalogo')} className="btn btn-gold">
                  Explorar Catálogo Digital →
                </button>
                <a 
                  href="https://wa.me/558588220984?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20exame%20de%20vista%20na%20%C3%93ptica%20Concei%C3%A7%C3%A3o."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-gold"
                  style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)' }}
                >
                  Agendar Exame de Vista
                </a>
              </div>
            </div>

            <div>
              <div className="hero-image-wrapper">
                <img 
                  src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80" 
                  alt="Óculos Óptica Conceição" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias Rápidas */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span className="subheading-gold">Navegue com Facilidade</span>
            <h2 className="heading-section">Explore por Categoria</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Selecione o estilo desejado e encontre o modelo perfeito para você.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div 
              className="product-card" 
              style={{ cursor: 'pointer', padding: '2rem', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(135deg, #091533, #1A3B8B)', color: '#FFFFFF' }}
              onClick={() => navegarPara('catalogo', 'Grau')}
            >
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Armações de Grau</h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Modelos leves em acetato e titânio para o dia a dia.</p>
            </div>

            <div 
              className="product-card" 
              style={{ cursor: 'pointer', padding: '2rem', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(135deg, #1A3B8B, #244AA8)', color: '#FFFFFF' }}
              onClick={() => navegarPara('catalogo', 'Sol')}
            >
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Óculos de Sol</h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Proteção UV400 e lentes polarizadas de alta definição.</p>
            </div>

            <div 
              className="product-card" 
              style={{ cursor: 'pointer', padding: '2rem', height: '240px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(135deg, #0D1E46, #162C66)', color: '#FFFFFF' }}
              onClick={() => navegarPara('catalogo', 'Infantil')}
            >
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Linha Infantil</h3>
              <p style={{ color: '#CBD5E1', fontSize: '0.85rem' }}>Armações super flexíveis e anatômicas para crianças.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques da Vitrine */}
      <section style={{ padding: '5rem 0', background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="subheading-gold">Vitrine em Alta</span>
              <h2 className="heading-section">Modelos Mais Desejados</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: '0.35rem' }}>
                Conheça os modelos em destaque na Óptica Conceição.
              </p>
            </div>

            <button onClick={() => navegarPara('catalogo')} className="btn btn-outline-gold">
              Ver Todo o Catálogo ({produtos.length} modelos) →
            </button>
          </div>

          <div className="products-grid">
            {produtosDestaque.map(prod => (
              <ProductCard key={prod.id} produto={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Exame de Vista */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ background: 'linear-gradient(135deg, #091533, #1A3B8B)', borderRadius: 'var(--radius-lg)', padding: '4rem 3rem', color: '#FFFFFF', boxShadow: 'var(--shadow-lg)' }}>
            <span className="subheading-gold" style={{ color: 'var(--color-gold)' }}>Saúde Visual em Primeiro Lugar</span>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '1rem' }}>Agende seu Exame de Vista com Especialista</h2>
            <p style={{ color: '#CBD5E1', fontSize: '1.05rem', marginBottom: '2rem', maxWidth: '650px', lineHeight: 1.7 }}>
              Realizamos avaliação computadorizada no Centro de Maracanaú. Conte com atendimento humanizado e receba a indicação ideal para o seu grau.
            </p>
            <a 
              href="https://wa.me/558588220984?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20exame%20de%20vista%20na%20%C3%93ptica%20Concei%C3%A7%C3%A3o%20em%20Maracana%C3%BA."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold"
            >
              📅 Agendar Horário via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Localização em Maracanaú */}
      <section id="localizacao" style={{ padding: '5rem 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3.5rem' }}>
            <span className="subheading-gold">Venha nos Conhecer</span>
            <h2 className="heading-section">Nossa Loja em Maracanaú</h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', marginTop: '0.5rem' }}>
              Rua Capitão Valdemar de Lima, 116 C, Centro, Maracanaú - CE
            </p>
          </div>

          <div className="location-grid-responsive">
            <div style={{ background: 'var(--color-bg)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem' }}>Atendimento Presencial</h3>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                <strong>📍 Endereço:</strong><br />
                Rua Capitão Valdemar de Lima, 116 C — Centro, Maracanaú - CE
              </p>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
                <strong>⏰ Horários:</strong><br />
                Segunda a Sexta: 08h às 17h | Sábados: 08h às 12h
              </p>
              <p style={{ marginBottom: '1.75rem', color: 'var(--color-text-muted)' }}>
                <strong>💬 WhatsApp Oficial:</strong><br />
                (85) 8822-0984
              </p>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Rua+Capit%C3%A3o+Valdemar+de+Lima,+116+C,+Centro,+Maracana%C3%BA+-+CE"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-dark"
                style={{ width: '100%' }}
              >
                🗺️ Como Chegar no Google Maps
              </a>
            </div>

            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '380px', border: '1px solid var(--color-border)' }}>
              <iframe 
                src="https://maps.google.com/maps?q=Rua+Capit%C3%A3o+Valdemar+de+Lima,+116,+Centro,+Maracana%C3%BA+-+CE&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                title="Mapa Óptica Conceição Maracanaú"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
