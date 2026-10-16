export type CategoriaProduto = 'Grau' | 'Sol' | 'Infantil';

export type FormatoArmacao = 
  | 'Redondo' 
  | 'Quadrado' 
  | 'Aviador' 
  | 'Gatinho' 
  | 'Hexagonal' 
  | 'Retangular' 
  | 'Oval';

export type GeneroProduto = 'Unissex' | 'Feminino' | 'Masculino' | 'Infantil';

export interface MedidasArmacao {
  lente: string;  // Ex: "52mm"
  ponte: string;  // Ex: "18mm"
  haste: string;  // Ex: "140mm"
}

export interface Produto {
  id: string;
  codigo: string;
  nome: string;
  marca: string;
  categoria: CategoriaProduto;
  formato: FormatoArmacao;
  material: string;
  genero: GeneroProduto;
  precoReferencia?: number;
  destaque: boolean;
  novidade: boolean;
  ativo: boolean;
  descricao: string;
  medidas: MedidasArmacao;
  rostosRecomendados: string[];
  imagens: string[];
}

export interface FiltrosCatalogo {
  categoria: string;
  formato: string;
  material: string;
  genero: string;
  marca: string;
  busca: string;
  ordenacao: 'relevancia' | 'preco-asc' | 'preco-desc' | 'nome';
}

export interface EstatisticasCatalogo {
  total: number;
  ativos: number;
  destaques: number;
  marcas: number;
}
