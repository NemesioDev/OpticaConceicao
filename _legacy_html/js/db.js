/**
 * Óptica Conceição - Camada de Dados (DB Manager)
 * Gerencia o catálogo de produtos e configurações via LocalStorage com suporte a expansão para Supabase/API.
 */

const STORAGE_KEY = 'optica_conceicao_produtos_v1';
const ADMIN_SESSION_KEY = 'optica_conceicao_admin_session';

// Coleção inicial rica para vitrine com imagens selecionadas de alta resolução
const PRODUTOS_INICIAIS = [
  {
    id: 'prod-001',
    codigo: 'OC-101',
    nome: 'Armação Vogue Elegance Chic',
    marca: 'Vogue Eyewear',
    categoria: 'Grau',
    formato: 'Gatinho',
    material: 'Acetato Italiano',
    genero: 'Feminino',
    precoReferencia: 499.00,
    destaque: true,
    novidade: true,
    ativo: true,
    descricao: 'Design contemporâneo com curvas sofisticadas estilo gatinho. Leveza e durabilidade no acetato premium com detalhes dourados na haste.',
    medidas: { lente: '53mm', ponte: '17mm', haste: '140mm' },
    rostosRecomendados: ['Oval', 'Redondo', 'Coração'],
    imagens: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-002',
    codigo: 'OC-102',
    nome: 'Ray-Ban Aviador Clássico Gold',
    marca: 'Ray-Ban',
    categoria: 'Sol',
    formato: 'Aviador',
    material: 'Metal Nobre',
    genero: 'Unissex',
    precoReferencia: 729.00,
    destaque: true,
    novidade: false,
    ativo: true,
    descricao: 'Ícone atemporal que nunca sai de moda. Estrutura metálica dourada ultra resistente com lentes clássicas verde G-15 e proteção total UV400.',
    medidas: { lente: '58mm', ponte: '14mm', haste: '135mm' },
    rostosRecomendados: ['Quadrado', 'Oval', 'Coração'],
    imagens: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-003',
    codigo: 'OC-103',
    nome: 'Oakley Holbrook Stealth Matte',
    marca: 'Oakley',
    categoria: 'Sol',
    formato: 'Quadrado',
    material: 'O Matter™ Injetado',
    genero: 'Masculino',
    precoReferencia: 689.00,
    destaque: true,
    novidade: true,
    ativo: true,
    descricao: 'Visual descolado com alta tecnologia de absorção de impactos. Lentes polarizadas Prizm™ que realçam as cores e o contraste.',
    medidas: { lente: '55mm', ponte: '18mm', haste: '137mm' },
    rostosRecomendados: ['Redondo', 'Oval'],
    imagens: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-004',
    codigo: 'OC-104',
    nome: 'Persol Sartoria Vintage Redondo',
    marca: 'Persol',
    categoria: 'Grau',
    formato: 'Redondo',
    material: 'Acetato & Prata',
    genero: 'Unissex',
    precoReferencia: 849.00,
    destaque: false,
    novidade: true,
    ativo: true,
    descricao: 'Artesanato italiano tradicional com a clássica Flecha Supreme. Perfeito para quem busca intelectualidade e requinte no dia a dia.',
    medidas: { lente: '50mm', ponte: '20mm', haste: '145mm' },
    rostosRecomendados: ['Quadrado', 'Retangular'],
    imagens: [
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-005',
    codigo: 'OC-105',
    nome: 'Armação Titanium Ultralight Minimal',
    marca: 'Silhouette',
    categoria: 'Grau',
    formato: 'Retangular',
    material: 'Titânio Puro',
    genero: 'Masculino',
    precoReferencia: 980.00,
    destaque: true,
    novidade: false,
    ativo: true,
    descricao: 'Pesa menos de 10 gramas. Haste sem parafusos em titânio cirúrgico antialérgico, proporcionando conforto inigualável para uso contínuo.',
    medidas: { lente: '54mm', ponte: '16mm', haste: '142mm' },
    rostosRecomendados: ['Oval', 'Redondo'],
    imagens: [
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-006',
    codigo: 'OC-106',
    nome: 'Prada Cinema Hexagonal Dourado',
    marca: 'Prada',
    categoria: 'Sol',
    formato: 'Hexagonal',
    material: 'Metal & Policarbonato',
    genero: 'Feminino',
    precoReferencia: 1190.00,
    destaque: true,
    novidade: true,
    ativo: true,
    descricao: 'Geometria marcante com acabamento acetinado e detalhes requintados. Lentes dégradé com filtro UV de máxima eficiência.',
    medidas: { lente: '52mm', ponte: '19mm', haste: '140mm' },
    rostosRecomendados: ['Oval', 'Coração', 'Redondo'],
    imagens: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-007',
    codigo: 'OC-107',
    nome: 'Armação Kids Flexível Antichoque',
    marca: 'Miraflex',
    categoria: 'Infantil',
    formato: 'Oval',
    material: 'Silicone e Polímero Flex',
    genero: 'Infantil',
    precoReferencia: 289.00,
    destaque: false,
    novidade: false,
    ativo: true,
    descricao: 'Armação sem partes metálicas totalmente flexível e anatômica. Ideal para crianças ativas com máxima segurança e ajuste com elástico regulável.',
    medidas: { lente: '44mm', ponte: '15mm', haste: '120mm' },
    rostosRecomendados: ['Infantil'],
    imagens: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-008',
    codigo: 'OC-108',
    nome: 'Clubmaster Heritage Tortoise',
    marca: 'Ray-Ban',
    categoria: 'Grau',
    formato: 'Retangular',
    material: 'Acetato Tartaruga & Metal',
    genero: 'Unissex',
    precoReferencia: 679.00,
    destaque: true,
    novidade: false,
    ativo: true,
    descricao: 'O estilo retrô intelectual dos anos 50 redefinido para a era moderna. Padrão tartaruga exclusivo com ponte metálica entalhada.',
    medidas: { lente: '51mm', ponte: '21mm', haste: '145mm' },
    rostosRecomendados: ['Oval', 'Redondo', 'Diamante'],
    imagens: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

class OpticaDB {
  constructor() {
    this.init();
  }

  init() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      this.salvar(PRODUTOS_INICIAIS);
    }
  }

  obterTodos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : PRODUTOS_INICIAIS;
    } catch (e) {
      console.error('Erro ao ler DB:', e);
      return PRODUTOS_INICIAIS;
    }
  }

  salvar(produtos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
  }

  obterPorId(id) {
    return this.obterTodos().find(p => p.id === id) || null;
  }

  filtrar({ categoria, formato, material, genero, marca, busca, apenasDestaques, apenasAtivos = true }) {
    let produtos = this.obterTodos();

    if (apenasAtivos) {
      produtos = produtos.filter(p => p.ativo !== false);
    }

    if (apenasDestaques) {
      produtos = produtos.filter(p => p.destaque === true);
    }

    if (categoria && categoria !== 'todos') {
      produtos = produtos.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
    }

    if (formato && formato !== 'todos') {
      produtos = produtos.filter(p => p.formato.toLowerCase() === formato.toLowerCase());
    }

    if (material && material !== 'todos') {
      produtos = produtos.filter(p => p.material.toLowerCase().includes(material.toLowerCase()));
    }

    if (genero && genero !== 'todos') {
      produtos = produtos.filter(p => p.genero.toLowerCase() === genero.toLowerCase() || p.genero.toLowerCase() === 'unissex');
    }

    if (marca && marca !== 'todos') {
      produtos = produtos.filter(p => p.marca.toLowerCase() === marca.toLowerCase());
    }

    if (busca && busca.trim()) {
      const termo = busca.toLowerCase().trim();
      produtos = produtos.filter(p => 
        p.nome.toLowerCase().includes(termo) ||
        p.marca.toLowerCase().includes(termo) ||
        p.codigo.toLowerCase().includes(termo) ||
        p.formato.toLowerCase().includes(termo) ||
        p.descricao.toLowerCase().includes(termo)
      );
    }

    return produtos;
  }

  adicionar(produto) {
    const produtos = this.obterTodos();
    const novo = {
      ...produto,
      id: 'prod-' + Date.now(),
      codigo: produto.codigo || 'OC-' + (produtos.length + 101),
      ativo: produto.ativo !== undefined ? produto.ativo : true,
      destaque: Boolean(produto.destaque),
      novidade: Boolean(produto.novidade),
      imagens: Array.isArray(produto.imagens) && produto.imagens.length > 0 
        ? produto.imagens 
        : ['https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80']
    };
    produtos.unshift(novo);
    this.salvar(produtos);
    return novo;
  }

  atualizar(id, dadosAtualizados) {
    const produtos = this.obterTodos();
    const index = produtos.findIndex(p => p.id === id);
    if (index === -1) return null;

    produtos[index] = {
      ...produtos[index],
      ...dadosAtualizados
    };
    this.salvar(produtos);
    return produtos[index];
  }

  remover(id) {
    let produtos = this.obterTodos();
    produtos = produtos.filter(p => p.id !== id);
    this.salvar(produtos);
    return true;
  }

  toggleDestaque(id) {
    const produtos = this.obterTodos();
    const p = produtos.find(item => item.id === id);
    if (p) {
      p.destaque = !p.destaque;
      this.salvar(produtos);
      return p.destaque;
    }
    return null;
  }

  toggleAtivo(id) {
    const produtos = this.obterTodos();
    const p = produtos.find(item => item.id === id);
    if (p) {
      p.ativo = !p.ativo;
      this.salvar(produtos);
      return p.ativo;
    }
    return null;
  }

  obterMarcas() {
    const produtos = this.obterTodos();
    const marcas = [...new Set(produtos.map(p => p.marca))];
    return marcas.sort();
  }

  obterFormatos() {
    const produtos = this.obterTodos();
    const formatos = [...new Set(produtos.map(p => p.formato))];
    return formatos.sort();
  }

  obterEstatisticas() {
    const produtos = this.obterTodos();
    return {
      total: produtos.length,
      ativos: produtos.filter(p => p.ativo !== false).length,
      destaques: produtos.filter(p => p.destaque).length,
      grau: produtos.filter(p => p.categoria === 'Grau').length,
      sol: produtos.filter(p => p.categoria === 'Sol').length,
      infantil: produtos.filter(p => p.categoria === 'Infantil').length,
      marcas: this.obterMarcas().length
    };
  }

  resetarCatalogo() {
    this.salvar(PRODUTOS_INICIAIS);
    return PRODUTOS_INICIAIS;
  }

  // Helpers de Sessão Administrativa
  isAdminAutenticado() {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  }

  loginAdmin(usuario, senha) {
    // Autenticação local segura padrão para o MVP
    if ((usuario === 'admin' || usuario === 'conceicao') && senha === 'admin123') {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      return true;
    }
    return false;
  }

  logoutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

// Instância global para todas as páginas
window.db = new OpticaDB();
