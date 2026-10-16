/**
 * Óptica Conceição - Lógica da Página de Catálogo
 * Filtros multifacetados, busca em tempo real e ordenação
 */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogo();
});

const estadoFiltros = {
  categoria: 'todos',
  formato: 'todos',
  material: 'todos',
  genero: 'todos',
  marca: 'todos',
  busca: '',
  ordenacao: 'relevancia'
};

function initCatalogo() {
  lerParametrosURL();
  popularFiltrosDinamicos();
  configurarListenersFiltros();
  aplicarFiltrosERenderizar();
}

// Ler parâmetros passados pela URL (ex: ?categoria=Grau)
function lerParametrosURL() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('categoria')) estadoFiltros.categoria = urlParams.get('categoria');
  if (urlParams.has('formato')) estadoFiltros.formato = urlParams.get('formato');
  if (urlParams.has('genero')) estadoFiltros.genero = urlParams.get('genero');
  if (urlParams.has('busca')) estadoFiltros.busca = urlParams.get('busca');

  // Atualizar input se tiver busca na URL
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput && estadoFiltros.busca) {
    searchInput.value = estadoFiltros.busca;
  }
}

// Popular selects ou chips com dados das marcas existentes no banco
function popularFiltrosDinamicos() {
  if (!window.db) return;

  // Marcas
  const selectMarca = document.getElementById('filter-marca');
  if (selectMarca) {
    const marcas = window.db.obterMarcas();
    selectMarca.innerHTML = '<option value="todos">Todas as Marcas</option>' +
      marcas.map(m => `<option value="${m}">${m}</option>`).join('');
  }

  // Sincronizar estado visual das categorias/chips
  atualizarChipsVisuais();
}

function atualizarChipsVisuais() {
  document.querySelectorAll('.filter-chip[data-filter-type]').forEach(chip => {
    const tipo = chip.dataset.filterType;
    const valor = chip.dataset.filterValue;

    if (estadoFiltros[tipo] && estadoFiltros[tipo].toLowerCase() === valor.toLowerCase()) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

function configurarListenersFiltros() {
  // Busca em tempo real
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      estadoFiltros.busca = e.target.value;
      aplicarFiltrosERenderizar();
    });
  }

  // Chips de Categoria, Formato e Gênero
  document.querySelectorAll('.filter-chip[data-filter-type]').forEach(chip => {
    chip.addEventListener('click', () => {
      const tipo = chip.dataset.filterType;
      const valor = chip.dataset.filterValue;

      // Se clicar no já ativo, desmarca e volta para 'todos'
      if (estadoFiltros[tipo] === valor && valor !== 'todos') {
        estadoFiltros[tipo] = 'todos';
      } else {
        estadoFiltros[tipo] = valor;
      }

      atualizarChipsVisuais();
      aplicarFiltrosERenderizar();
    });
  });

  // Select de Marca
  const selectMarca = document.getElementById('filter-marca');
  if (selectMarca) {
    selectMarca.addEventListener('change', (e) => {
      estadoFiltros.marca = e.target.value;
      aplicarFiltrosERenderizar();
    });
  }

  // Select de Material
  const selectMaterial = document.getElementById('filter-material');
  if (selectMaterial) {
    selectMaterial.addEventListener('change', (e) => {
      estadoFiltros.material = e.target.value;
      aplicarFiltrosERenderizar();
    });
  }

  // Select de Ordenação
  const sortSelect = document.getElementById('sort-products-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      estadoFiltros.ordenacao = e.target.value;
      aplicarFiltrosERenderizar();
    });
  }

  // Botão Limpar Filtros
  const btnReset = document.getElementById('btn-reset-filters');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      estadoFiltros.categoria = 'todos';
      estadoFiltros.formato = 'todos';
      estadoFiltros.material = 'todos';
      estadoFiltros.genero = 'todos';
      estadoFiltros.marca = 'todos';
      estadoFiltros.busca = '';
      estadoFiltros.ordenacao = 'relevancia';

      if (searchInput) searchInput.value = '';
      if (selectMarca) selectMarca.value = 'todos';
      if (selectMaterial) selectMaterial.value = 'todos';
      if (sortSelect) sortSelect.value = 'relevancia';

      atualizarChipsVisuais();
      aplicarFiltrosERenderizar();
    });
  }

  // Toggle filtros mobile
  const mobileBtn = document.getElementById('btn-mobile-filters');
  const sidebar = document.querySelector('.filters-sidebar');
  if (mobileBtn && sidebar) {
    mobileBtn.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }
}

function aplicarFiltrosERenderizar() {
  if (!window.db) return;

  let produtos = window.db.filtrar({
    categoria: estadoFiltros.categoria,
    formato: estadoFiltros.formato,
    material: estadoFiltros.material,
    genero: estadoFiltros.genero,
    marca: estadoFiltros.marca,
    busca: estadoFiltros.busca,
    apenasAtivos: true
  });

  // Ordenação
  if (estadoFiltros.ordenacao === 'preco-asc') {
    produtos.sort((a, b) => (a.precoReferencia || 0) - (b.precoReferencia || 0));
  } else if (estadoFiltros.ordenacao === 'preco-desc') {
    produtos.sort((a, b) => (b.precoReferencia || 0) - (a.precoReferencia || 0));
  } else if (estadoFiltros.ordenacao === 'nome') {
    produtos.sort((a, b) => a.nome.localeCompare(b.nome));
  } else {
    // Relevância: Destaques e Novidades primeiro
    produtos.sort((a, b) => (b.destaque ? 1 : 0) - (a.destaque ? 1 : 0));
  }

  // Atualizar contador
  const counterEl = document.getElementById('catalog-results-count');
  if (counterEl) {
    counterEl.textContent = `${produtos.length} armações encontradas`;
  }

  // Renderizar no grid
  const gridContainer = document.getElementById('catalog-products-grid');
  if (!gridContainer) return;

  if (produtos.length === 0) {
    gridContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">👓</div>
        <h3>Nenhuma armação encontrada</h3>
        <p>Não encontramos nenhum modelo com os filtros selecionados. Tente ajustar os termos ou limpar os filtros para ver todo o catálogo.</p>
        <button class="btn btn-outline-gold" onclick="document.getElementById('btn-reset-filters').click()">
          Limpar Filtros
        </button>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = produtos.map(prod => renderCardProduto(prod)).join('');
}
