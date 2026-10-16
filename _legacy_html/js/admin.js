/**
 * Óptica Conceição - Lógica do Painel Administrativo
 * CRUD de Produtos, Métricas e Gestão de Destaques
 */

document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticação
  if (window.db && !window.db.isAdminAutenticado()) {
    // Se não estiver na página de login, redirecionar
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
      return;
    }
  }

  // Inicializar componentes se estiver no dashboard
  if (document.getElementById('admin-metrics-container')) {
    initAdminDashboard();
  }

  // Inicializar tela de login se for o caso
  if (document.getElementById('admin-login-form')) {
    initLoginForm();
  }
});

let produtoEditandoId = null;

function initLoginForm() {
  const form = document.getElementById('admin-login-form');
  const errorMsg = document.getElementById('login-error-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const usuario = document.getElementById('login-user').value.trim();
    const senha = document.getElementById('login-password').value.trim();

    if (window.db.loginAdmin(usuario, senha)) {
      window.location.href = 'index.html';
    } else {
      if (errorMsg) {
        errorMsg.style.display = 'block';
        errorMsg.textContent = 'Usuário ou senha inválidos. Tente: admin / admin123';
      }
    }
  });
}

function initAdminDashboard() {
  atualizarMetricas();
  renderizarTabelaProdutos();
  configurarModalAdmin();
  configurarBuscaTabela();
}

function atualizarMetricas() {
  if (!window.db) return;
  const stats = window.db.obterEstatisticas();

  const elTotal = document.getElementById('metric-total');
  const elAtivos = document.getElementById('metric-ativos');
  const elDestaques = document.getElementById('metric-destaques');
  const elMarcas = document.getElementById('metric-marcas');

  if (elTotal) elTotal.textContent = stats.total;
  if (elAtivos) elAtivos.textContent = stats.ativos;
  if (elDestaques) elDestaques.textContent = stats.destaques;
  if (elMarcas) elMarcas.textContent = stats.marcas;
}

function renderizarTabelaProdutos(termoBusca = '') {
  const tbody = document.getElementById('admin-products-table-body');
  if (!tbody || !window.db) return;

  let produtos = window.db.obterTodos();

  if (termoBusca) {
    const t = termoBusca.toLowerCase().trim();
    produtos = produtos.filter(p => 
      p.nome.toLowerCase().includes(t) ||
      p.codigo.toLowerCase().includes(t) ||
      p.marca.toLowerCase().includes(t) ||
      p.categoria.toLowerCase().includes(t)
    );
  }

  if (produtos.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
          Nenhum produto cadastrado ou correspondente à busca.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = produtos.map(prod => {
    const foto = prod.imagens && prod.imagens.length > 0 ? prod.imagens[0] : '';
    const preco = prod.precoReferencia 
      ? Number(prod.precoReferencia).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      : 'Sob Consulta';

    return `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${foto}" class="table-thumb" alt="${prod.nome}" />
            <div>
              <div class="table-title">${prod.nome}</div>
              <div class="table-sku">${prod.codigo}</div>
            </div>
          </div>
        </td>
        <td><strong>${prod.marca}</strong></td>
        <td><span class="badge ${prod.categoria === 'Grau' ? 'badge-dark' : 'badge-gold'}">${prod.categoria}</span></td>
        <td>${prod.formato}</td>
        <td>${preco}</td>
        <td>
          <button class="btn-icon-action ${prod.destaque ? 'star-active' : ''}" title="Alternar Destaque na Vitrine" onclick="toggleDestaqueProduto('${prod.id}')">
            ${prod.destaque ? '★' : '☆'}
          </button>
          <span style="font-size: 0.8rem; margin-left: 0.35rem; color: ${prod.ativo !== false ? 'var(--color-success)' : 'var(--color-danger)'}; font-weight: 600;">
            ${prod.ativo !== false ? '● Ativo' : '○ Inativo'}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="btn-icon-action" title="Editar Produto" onclick="abrirModalEdicao('${prod.id}')">
              ✏️
            </button>
            <button class="btn-icon-action btn-delete" title="Excluir Produto" onclick="confirmarExclusao('${prod.id}', '${prod.nome}')">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function configurarBuscaTabela() {
  const searchInput = document.getElementById('admin-table-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderizarTabelaProdutos(e.target.value);
    });
  }
}

function toggleDestaqueProduto(id) {
  if (!window.db) return;
  const novoStatus = window.db.toggleDestaque(id);
  atualizarMetricas();
  renderizarTabelaProdutos();
  showToast(novoStatus ? 'Produto adicionado aos destaques da vitrine!' : 'Produto removido dos destaques.');
}

function confirmarExclusao(id, nome) {
  if (confirm(`Tem certeza que deseja excluir o produto "${nome}"? Esta ação não pode ser desfeita.`)) {
    window.db.remover(id);
    atualizarMetricas();
    renderizarTabelaProdutos();
    showToast('Produto excluído com sucesso!');
  }
}

// Modal de Criação / Edição e Upload de Fotos
function configurarModalAdmin() {
  const modal = document.getElementById('admin-product-modal');
  const btnNovo = document.getElementById('btn-novo-produto');
  const btnClose = document.getElementById('admin-modal-close');
  const form = document.getElementById('admin-product-form');
  const fileInput = document.getElementById('prod-img-file');
  const dropzoneArea = document.getElementById('dropzone-area');

  if (btnNovo) {
    btnNovo.addEventListener('click', () => {
      produtoEditandoId = null;
      document.getElementById('admin-modal-title').textContent = 'Cadastrar Nova Armação';
      form.reset();
      document.getElementById('prod-codigo').value = 'OC-' + (window.db.obterTodos().length + 101);
      removerFotoUpload();
      modal.classList.add('active');
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => modal.classList.remove('active'));
  }

  // Eventos de Upload de Arquivo
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        processarArquivoImagem(e.target.files[0]);
      }
    });
  }

  // Drag and drop na dropzone
  if (dropzoneArea) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzoneArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneArea.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzoneArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneArea.classList.remove('drag-over');
      });
    });

    dropzoneArea.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processarArquivoImagem(e.dataTransfer.files[0]);
      }
    });
  }

  // Salvar Produto (Criar ou Atualizar)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const imagemFinal = document.getElementById('prod-img-data').value.trim() || 
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80';

      const dadosProduto = {
        codigo: document.getElementById('prod-codigo').value.trim(),
        nome: document.getElementById('prod-nome').value.trim(),
        marca: document.getElementById('prod-marca').value.trim(),
        categoria: document.getElementById('prod-categoria').value,
        formato: document.getElementById('prod-formato').value,
        genero: document.getElementById('prod-genero').value,
        material: document.getElementById('prod-material').value.trim(),
        precoReferencia: parseFloat(document.getElementById('prod-preco').value) || 0,
        descricao: document.getElementById('prod-descricao').value.trim(),
        destaque: document.getElementById('prod-destaque').checked,
        novidade: document.getElementById('prod-novidade').checked,
        ativo: document.getElementById('prod-ativo').checked,
        medidas: {
          lente: document.getElementById('prod-med-lente').value.trim() || '52mm',
          ponte: document.getElementById('prod-med-ponte').value.trim() || '18mm',
          haste: document.getElementById('prod-med-haste').value.trim() || '140mm'
        },
        rostosRecomendados: document.getElementById('prod-rostos').value.split(',').map(r => r.trim()).filter(Boolean),
        imagens: [imagemFinal]
      };

      if (produtoEditandoId) {
        window.db.atualizar(produtoEditandoId, dadosProduto);
        showToast('Produto atualizado com sucesso!');
      } else {
        window.db.adicionar(dadosProduto);
        showToast('Novo produto cadastrado com sucesso!');
      }

      modal.classList.remove('active');
      atualizarMetricas();
      renderizarTabelaProdutos();
    });
  }
}

// Processar e Otimizar Upload de Imagem
function processarArquivoImagem(file) {
  if (!file.type.startsWith('image/')) {
    alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG ou WEBP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Original = e.target.result;
    
    // Otimizar e comprimir para o tamanho ideal
    otimizarImagem(base64Original, 800, 800, (base64Otimizada) => {
      document.getElementById('prod-img-data').value = base64Otimizada;
      
      const previewImg = document.getElementById('preview-img-el');
      const filenameEl = document.getElementById('preview-filename');
      const filesizeEl = document.getElementById('preview-filesize');
      const previewContainer = document.getElementById('preview-container');
      const dropzone = document.getElementById('dropzone-area');

      if (previewImg) previewImg.src = base64Otimizada;
      if (filenameEl) filenameEl.textContent = file.name;
      if (filesizeEl) {
        const kb = Math.round(base64Otimizada.length * 0.75 / 1024);
        filesizeEl.textContent = `Foto pronta (${kb} KB • alta definição)`;
      }

      if (dropzone) dropzone.style.display = 'none';
      if (previewContainer) previewContainer.classList.add('active');
    });
  };
  reader.readAsDataURL(file);
}

// Redimensionamento via Canvas para manter o LocalStorage leve e ultra-rápido
function otimizarImagem(base64Str, maxLargura, maxAltura, callback) {
  const img = new Image();
  img.src = base64Str;
  img.onload = () => {
    let width = img.width;
    let height = img.height;

    if (width > height) {
      if (width > maxLargura) {
        height = Math.round((height * maxLargura) / width);
        width = maxLargura;
      }
    } else {
      if (height > maxAltura) {
        width = Math.round((width * maxAltura) / height);
        height = maxAltura;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    const resultado = canvas.toDataURL('image/jpeg', 0.85);
    callback(resultado);
  };
}

function removerFotoUpload() {
  const fileInput = document.getElementById('prod-img-file');
  const imgData = document.getElementById('prod-img-data');
  const dropzone = document.getElementById('dropzone-area');
  const previewContainer = document.getElementById('preview-container');

  if (fileInput) fileInput.value = '';
  if (imgData) imgData.value = '';
  if (dropzone) dropzone.style.display = 'block';
  if (previewContainer) previewContainer.classList.remove('active');
}

function abrirModalEdicao(id) {
  if (!window.db) return;
  const prod = window.db.obterPorId(id);
  if (!prod) return;

  produtoEditandoId = id;
  const modal = document.getElementById('admin-product-modal');
  document.getElementById('admin-modal-title').textContent = 'Editar Armação: ' + prod.codigo;

  document.getElementById('prod-codigo').value = prod.codigo;
  document.getElementById('prod-nome').value = prod.nome;
  document.getElementById('prod-marca').value = prod.marca;
  document.getElementById('prod-categoria').value = prod.categoria;
  document.getElementById('prod-formato').value = prod.formato;
  document.getElementById('prod-genero').value = prod.genero;
  document.getElementById('prod-material').value = prod.material;
  document.getElementById('prod-preco').value = prod.precoReferencia || '';
  document.getElementById('prod-descricao').value = prod.descricao || '';
  document.getElementById('prod-destaque').checked = Boolean(prod.destaque);
  document.getElementById('prod-novidade').checked = Boolean(prod.novidade);
  document.getElementById('prod-ativo').checked = prod.ativo !== false;

  document.getElementById('prod-med-lente').value = prod.medidas?.lente || '';
  document.getElementById('prod-med-ponte').value = prod.medidas?.ponte || '';
  document.getElementById('prod-med-haste').value = prod.medidas?.haste || '';
  document.getElementById('prod-rostos').value = (prod.rostosRecomendados || []).join(', ');

  const imgUrl = prod.imagens && prod.imagens.length > 0 ? prod.imagens[0] : '';
  document.getElementById('prod-img-data').value = imgUrl;

  const dropzone = document.getElementById('dropzone-area');
  const previewContainer = document.getElementById('preview-container');
  const previewImg = document.getElementById('preview-img-el');
  const filenameEl = document.getElementById('preview-filename');
  const filesizeEl = document.getElementById('preview-filesize');

  if (imgUrl) {
    if (previewImg) previewImg.src = imgUrl;
    if (filenameEl) filenameEl.textContent = 'Foto atual cadastrada';
    if (filesizeEl) filesizeEl.textContent = 'Clique em Trocar Foto se desejar substituir';
    if (dropzone) dropzone.style.display = 'none';
    if (previewContainer) previewContainer.classList.add('active');
  } else {
    removerFotoUpload();
  }

  modal.classList.add('active');
}

function resetarParaDadosExemplo() {
  if (confirm('Deseja recarregar o catálogo padrão de demonstração? Isso substituirá os dados atuais.')) {
    window.db.resetarCatalogo();
    atualizarMetricas();
    renderizarTabelaProdutos();
    showToast('Catálogo padrão restaurado com sucesso!');
  }
}

function logoutAdmin() {
  if (window.db) {
    window.db.logoutAdmin();
  }
  window.location.href = 'login.html';
}
