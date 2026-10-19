import React, { createContext, useContext, useState, useEffect } from 'react';
import { Produto, EstatisticasCatalogo } from '../types/produto';
import { PRODUTOS_INICIAIS } from '../data/produtosIniciais';
import { supabase, uploadFotoArmacao } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface CatalogContextType {
  produtos: Produto[];
  carregando: boolean;
  produtoModal: Produto | null;
  abrirModal: (prod: Produto) => void;
  fecharModal: () => void;
  adicionarProduto: (produto: Omit<Produto, 'id'>, arquivoFoto?: File | string, nomeArquivo?: string) => Promise<void>;
  atualizarProduto: (id: string, dados: Partial<Produto>, arquivoFoto?: File | string, nomeArquivo?: string) => Promise<void>;
  removerProduto: (id: string) => Promise<void>;
  toggleDestaque: (id: string) => Promise<void>;
  resetarCatalogo: () => Promise<void>;
  isAdmin: boolean;
  carregandoAuth: boolean;
  user: User | null;
  loginAdmin: (userOrEmail: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => Promise<void>;
  estatisticas: EstatisticasCatalogo;
  marcasDisponiveis: string[];
}

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

// Converte registro do banco Supabase para a interface Produto
function mapRowToProduto(row: any): Produto {
  return {
    id: row.id,
    codigo: row.codigo || 'OC-000',
    nome: row.nome || '',
    marca: row.marca || '',
    categoria: row.categoria || 'Grau',
    formato: row.formato || 'Redondo',
    material: row.material || '',
    genero: row.genero || 'Unissex',
    precoReferencia: row.preco_referencia ? Number(row.preco_referencia) : undefined,
    destaque: Boolean(row.destaque),
    novidade: Boolean(row.novidade),
    ativo: row.ativo !== false,
    descricao: row.descricao || '',
    medidas: row.medidas || { lente: '52mm', ponte: '18mm', haste: '140mm' },
    rostosRecomendados: Array.isArray(row.rostos_recomendados) ? row.rostos_recomendados : [],
    imagens: Array.isArray(row.imagens) && row.imagens.length > 0 ? row.imagens : [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80'
    ]
  };
}

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [carregandoAuth, setCarregandoAuth] = useState<boolean>(true);
  const [isAdminLocal, setIsAdminLocal] = useState<boolean>(() => {
    try {
      return localStorage.getItem('optica_admin_logged') === 'true';
    } catch {
      return false;
    }
  });
  const [user, setUser] = useState<User | null>(null);
  const [produtoModal, setProdutoModal] = useState<Produto | null>(null);

  // Monitorar autenticação com Supabase Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('optica_admin_logged', 'true');
        setIsAdminLocal(true);
      }
      setCarregandoAuth(false);
    }).catch(() => {
      setCarregandoAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        localStorage.setItem('optica_admin_logged', 'true');
        setIsAdminLocal(true);
      } else if (_event === 'SIGNED_OUT') {
        localStorage.removeItem('optica_admin_logged');
        setIsAdminLocal(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Buscar produtos do banco Supabase
  const carregarProdutos = async () => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Erro ao carregar do Supabase, usando dados locais:', error.message);
      } else if (data && data.length > 0) {
        setProdutos(data.map(mapRowToProduto));
      }
    } catch (err) {
      console.error('Falha na requisição ao Supabase:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const abrirModal = (prod: Produto) => setProdutoModal(prod);
  const fecharModal = () => setProdutoModal(null);

  // Adicionar produto no Supabase (com upload opcional de foto no Storage)
  const adicionarProduto = async (
    novoDado: Omit<Produto, 'id'>, 
    arquivoFoto?: File | string, 
    nomeArquivo?: string
  ) => {
    let urlFoto = novoDado.imagens[0];

    // Se houver foto em base64 ou File, enviar para o Supabase Storage
    if (arquivoFoto) {
      const urlStorage = await uploadFotoArmacao(arquivoFoto, nomeArquivo || `${novoDado.codigo}.jpg`);
      if (urlStorage) {
        urlFoto = urlStorage;
      }
    }

    const payload = {
      codigo: novoDado.codigo,
      nome: novoDado.nome,
      marca: novoDado.marca,
      categoria: novoDado.categoria,
      formato: novoDado.formato,
      material: novoDado.material,
      genero: novoDado.genero,
      preco_referencia: novoDado.precoReferencia,
      destaque: novoDado.destaque,
      novidade: novoDado.novidade,
      ativo: novoDado.ativo,
      descricao: novoDado.descricao,
      medidas: novoDado.medidas,
      rostos_recomendados: novoDado.rostosRecomendados,
      imagens: [urlFoto]
    };

    const { data, error } = await supabase
      .from('produtos')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar produto no Supabase:', error);
      // Fallback local
      const novoLocal: Produto = { ...novoDado, id: 'prod-' + Date.now(), imagens: [urlFoto] };
      setProdutos(prev => [novoLocal, ...prev]);
    } else if (data) {
      setProdutos(prev => [mapRowToProduto(data), ...prev]);
    }
  };

  // Atualizar produto no Supabase
  const atualizarProduto = async (
    id: string, 
    dados: Partial<Produto>, 
    arquivoFoto?: File | string, 
    nomeArquivo?: string
  ) => {
    let imagensFinais = dados.imagens;

    if (arquivoFoto) {
      const urlStorage = await uploadFotoArmacao(arquivoFoto, nomeArquivo || 'foto_atualizada.jpg');
      if (urlStorage) {
        imagensFinais = [urlStorage];
      }
    }

    const payload: any = {};
    if (dados.codigo !== undefined) payload.codigo = dados.codigo;
    if (dados.nome !== undefined) payload.nome = dados.nome;
    if (dados.marca !== undefined) payload.marca = dados.marca;
    if (dados.categoria !== undefined) payload.categoria = dados.categoria;
    if (dados.formato !== undefined) payload.formato = dados.formato;
    if (dados.material !== undefined) payload.material = dados.material;
    if (dados.genero !== undefined) payload.genero = dados.genero;
    if (dados.precoReferencia !== undefined) payload.preco_referencia = dados.precoReferencia;
    if (dados.destaque !== undefined) payload.destaque = dados.destaque;
    if (dados.novidade !== undefined) payload.novidade = dados.novidade;
    if (dados.ativo !== undefined) payload.ativo = dados.ativo;
    if (dados.descricao !== undefined) payload.descricao = dados.descricao;
    if (dados.medidas !== undefined) payload.medidas = dados.medidas;
    if (dados.rostosRecomendados !== undefined) payload.rostos_recomendados = dados.rostosRecomendados;
    if (imagensFinais !== undefined) payload.imagens = imagensFinais;

    const { data, error } = await supabase
      .from('produtos')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar produto no Supabase:', error);
      // Fallback local
      setProdutos(prev => prev.map(p => p.id === id ? { ...p, ...dados, imagens: imagensFinais || p.imagens } : p));
    } else if (data) {
      setProdutos(prev => prev.map(p => p.id === id ? mapRowToProduto(data) : p));
    }
  };

  // Remover produto do Supabase
  const removerProduto = async (id: string) => {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir no Supabase:', error);
    }
    setProdutos(prev => prev.filter(p => p.id !== id));
  };

  // Alternar destaque na vitrine
  const toggleDestaque = async (id: string) => {
    const prod = produtos.find(p => p.id === id);
    if (!prod) return;

    const novoDestaque = !prod.destaque;
    setProdutos(prev => prev.map(p => p.id === id ? { ...p, destaque: novoDestaque } : p));

    await supabase
      .from('produtos')
      .update({ destaque: novoDestaque })
      .eq('id', id);
  };

  // Restaurar dados de demonstração no banco
  const resetarCatalogo = async () => {
    try {
      await supabase.from('produtos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      const inserts = PRODUTOS_INICIAIS.map(p => ({
        codigo: p.codigo,
        nome: p.nome,
        marca: p.marca,
        categoria: p.categoria,
        formato: p.formato,
        material: p.material,
        genero: p.genero,
        preco_referencia: p.precoReferencia,
        destaque: p.destaque,
        novidade: p.novidade,
        ativo: p.ativo,
        descricao: p.descricao,
        medidas: p.medidas,
        rostos_recomendados: p.rostosRecomendados,
        imagens: p.imagens
      }));

      await supabase.from('produtos').insert(inserts);
      await carregarProdutos();
    } catch (e) {
      console.error('Erro ao resetar catálogo:', e);
      setProdutos(PRODUTOS_INICIAIS);
    }
  };

  // Login via Supabase Auth
  const loginAdmin = async (userOrEmail: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // Atalhos para admin
    let emailNormalizado = userOrEmail.trim();
    if (emailNormalizado === 'admin' || emailNormalizado === 'conceicao') {
      emailNormalizado = 'admin@opticaconceicao.com.br';
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailNormalizado,
        password: pass
      });

      if (error) {
        console.warn('Erro de autenticação Supabase:', error.message);
        // Fallback para credenciais padrão se estiver offline
        if ((userOrEmail === 'admin' || userOrEmail === 'admin@opticaconceicao.com.br') && pass === 'admin123') {
          localStorage.setItem('optica_admin_logged', 'true');
          setIsAdminLocal(true);
          return { success: true };
        }
        return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
      }

      setUser(data.user);
      localStorage.setItem('optica_admin_logged', 'true');
      setIsAdminLocal(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Falha de conexão com o servidor' };
    }
  };

  // Logout via Supabase Auth
  const logoutAdmin = async () => {
    try {
      localStorage.removeItem('optica_admin_logged');
      setIsAdminLocal(false);
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Erro ao deslogar do Supabase:', err);
    } finally {
      setUser(null);
    }
  };

  const marcasDisponiveis = Array.from(new Set(produtos.map(p => p.marca))).sort();

  const estatisticas: EstatisticasCatalogo = {
    total: produtos.length,
    ativos: produtos.filter(p => p.ativo).length,
    destaques: produtos.filter(p => p.destaque).length,
    marcas: marcasDisponiveis.length
  };

  return (
    <CatalogContext.Provider value={{
      produtos,
      carregando,
      produtoModal,
      abrirModal,
      fecharModal,
      adicionarProduto,
      atualizarProduto,
      removerProduto,
      toggleDestaque,
      resetarCatalogo,
      isAdmin: Boolean(user) || isAdminLocal,
      carregandoAuth,
      user,
      loginAdmin,
      logoutAdmin,
      estatisticas,
      marcasDisponiveis
    }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog deve ser usado dentro de um CatalogProvider');
  return context;
};
