/**
 * Óptica Conceição - Lógica Principal (Frontend)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDestaquesHome();
  initModalProduto();
});

// Menu Mobile
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Fechar ao clicar em link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

// Renderizar Armações em Destaque na Home
function initDestaquesHome() {
  const container = document.getElementById('featured-products-container');
  if (!container || !window.db) return;

  const produtos = window.db.filtrar({ apenasDestaques: true }).slice(0, 4);

  if (produtos.length === 0) {
    container.innerHTML = '<p class="text-muted">Nenhum produto em destaque no momento.</p>';
    return;
  }

  container.innerHTML = produtos.map(prod => renderCardProduto(prod)).join('');
}

// Template de Card de Produto
function renderCardProduto(prod) {
  const imagemPrincipal = prod.imagens && prod.imagens.length > 0 
    ? prod.imagens[0] 
    : 'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80';

  const precoFormatado = prod.precoReferencia 
    ? Number(prod.precoReferencia).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'Consulte';

  return `
    <article class="product-card" data-id="${prod.id}">
      <div class="product-badges">
        ${prod.destaque ? '<span class="badge badge-gold">Destaque</span>' : ''}
        ${prod.novidade ? '<span class="badge badge-novo">Novo</span>' : ''}
      </div>

      <div class="product-image-container" onclick="abrirModalProduto('${prod.id}')">
        <img src="${imagemPrincipal}" alt="${prod.nome}" loading="lazy" />
      </div>

      <div class="product-info">
        <div class="product-meta">
          <span class="product-brand">${prod.marca}</span>
          <span class="product-code">${prod.codigo}</span>
        </div>

        <h3 class="product-title" onclick="abrirModalProduto('${prod.id}')" style="cursor: pointer;">
          ${prod.nome}
        </h3>

        <div class="product-tags">
          <span class="tag-spec">Formato: ${prod.formato}</span>
          <span class="tag-spec">${prod.genero}</span>
          <span class="tag-spec">${prod.categoria}</span>
        </div>

        <div class="product-footer">
          <div class="product-price-box">
            <span class="price-label">Ref. a partir de</span>
            <span class="price-value">${precoFormatado}</span>
          </div>
          <button class="btn-details" onclick="abrirModalProduto('${prod.id}')">
            Ver Detalhes
          </button>
        </div>
      </div>
    </article>
  `;
}

// Modal de Detalhes do Produto & Conversão WhatsApp
function initModalProduto() {
  const modalOverlay = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', fecharModalProduto);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) fecharModalProduto();
    });
  }

  // Tecla ESC fecha modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModalProduto();
  });
}

function abrirModalProduto(id) {
  if (!window.db) return;
  const prod = window.db.obterPorId(id);
  if (!prod) return;

  const modalOverlay = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-product-details');

  if (!modalOverlay || !modalContent) return;

  const precoFormatado = prod.precoReferencia 
    ? Number(prod.precoReferencia).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'Sob Consulta';

  // Mensagem WhatsApp codificada
  const mensagemWhatsApp = encodeURIComponent(
    `Olá, Óptica Conceição! Vi a armação "${prod.nome}" (${prod.codigo}) da marca ${prod.marca} no catálogo online e gostaria de saber se vocês têm disponível para experimentar na loja!`
  );
  const numeroWhatsApp = '558588220984'; // WhatsApp oficial da Óptica Conceição (Maracanaú - CE)

  modalContent.innerHTML = `
    <div class="modal-body">
      <!-- Galeria -->
      <div>
        <div class="modal-gallery-main">
          <img id="modal-main-img" src="${prod.imagens[0]}" alt="${prod.nome}" />
        </div>
        ${prod.imagens.length > 1 ? `
          <div class="modal-thumbs">
            ${prod.imagens.map((img, idx) => `
              <div class="modal-thumb ${idx === 0 ? 'active' : ''}" onclick="trocarImagemModal('${img}', this)">
                <img src="${img}" alt="Miniatura ${idx + 1}" />
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Detalhes e CTA -->
      <div style="display: flex; flex-direction: column;">
        <span class="subheading-gold" style="margin-bottom: 0.25rem;">${prod.marca} • ${prod.categoria}</span>
        <h2 style="font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 0.5rem; color: var(--color-primary);">
          ${prod.nome}
        </h2>
        <span style="font-size: 0.85rem; color: var(--color-text-light); margin-bottom: 1rem;">Código de Referência: ${prod.codigo}</span>

        <p style="color: var(--color-text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">
          ${prod.descricao}
        </p>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.6rem; color: var(--color-primary);">
            Dimensões e Especificações Técnicas:
          </h4>
          <div class="modal-specs-list">
            <div class="modal-spec-item">
              <span class="modal-spec-label">Material da Armação</span>
              <span class="modal-spec-val">${prod.material}</span>
            </div>
            <div class="modal-spec-item">
              <span class="modal-spec-label">Formato do Aro</span>
              <span class="modal-spec-val">${prod.formato}</span>
            </div>
            <div class="modal-spec-item">
              <span class="modal-spec-label">Largura da Lente</span>
              <span class="modal-spec-val">${prod.medidas?.lente || 'Padrão'}</span>
            </div>
            <div class="modal-spec-item">
              <span class="modal-spec-label">Ponte Nasal / Haste</span>
              <span class="modal-spec-val">${prod.medidas?.ponte || '-'} / ${prod.medidas?.haste || '-'}</span>
            </div>
          </div>
        </div>

        ${prod.rostosRecomendados && prod.rostosRecomendados.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary); display: block; margin-bottom: 0.4rem;">
              Indicado para formatos de rosto:
            </span>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              ${prod.rostosRecomendados.map(r => `<span class="tag-spec" style="background: rgba(197, 160, 89, 0.15); color: var(--color-gold-hover); font-weight: 600;">✓ Rosto ${r}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-top: auto; padding-top: 1.5rem; border-top: 1px solid var(--color-border); display: flex; flex-direction: column; gap: 0.85rem;">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <span style="font-size: 0.85rem; color: var(--color-text-muted);">Valor de referência:</span>
            <span style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary);">${precoFormatado}</span>
          </div>

          <a href="https://wa.me/${numeroWhatsApp}?text=${mensagemWhatsApp}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" style="width: 100%; font-size: 1rem;">
            <span>💬</span> Consultar Disponibilidade no WhatsApp
          </a>

          <a href="index.html#localizacao" class="btn btn-outline-gold" style="width: 100%; text-align: center;" onclick="fecharModalProduto()">
            📍 Experimentar na Loja Física
          </a>
        </div>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function fecharModalProduto() {
  const modalOverlay = document.getElementById('product-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function trocarImagemModal(src, thumbElement) {
  const mainImg = document.getElementById('modal-main-img');
  if (mainImg) mainImg.src = src;

  document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
  if (thumbElement) thumbElement.classList.add('active');
}

// Toast Notificações
function showToast(mensagem, tipo = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${mensagem}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}
