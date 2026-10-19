# 👓 Óptica Conceição

Plataforma digital para ótica com vitrine/catálogo interativo e painel administrativo integrado para gestão de armações, marcas e destaques.

---

## 🚀 Funcionalidades Principais

### 1. Portal do Cliente
- **Home com Estética Premium:** Vitrine com os modelos mais desejados, categorias dinâmicas (Grau, Sol, Infantil, Retrô), diferenciais técnicos e localização com mapa.
- **Catálogo Interativo Completo:**
  - Busca instantânea por nome, SKU, formato ou marca.
  - Filtros multifacetados por **Categoria**, **Formato do Aro** (Redondo, Quadrado, Aviador, Gatinho, Hexagonal, etc.), **Gênero**, **Marca** e **Material**.
  - Ordenação por destaques, menor/maior preço e nome.
- **Modal de Detalhes:**
  - Galeria de imagens com miniaturas selecionáveis.
  - Medidas técnicas detalhadas (haste, ponte, diâmetro da lente).
  - Recomendação por formato de rosto.
  - **Conversão via WhatsApp:** Botão com mensagem pronta contendo o nome e o código do modelo desejado.

### 2. Painel Administrativo (Admin Suite) & Supabase
- **Banco de Dados PostgreSQL (Supabase):** Tabela `public.produtos` conectada com RLS (Row Level Security).
- **Autenticação Real (Supabase Auth):** Contas administrativas ativas (`admin@opticaconceicao.com.br` / `opticaconceicao@gmail.com`).
- **Supabase Storage:** Bucket público `fotos-armacoes` para armazenamento de uploads de imagens de armações.
- **CRUD em Tempo Real:** Inserção, edição, exclusão e alternância de destaques refletem instantaneamente no banco de dados na nuvem.

---

## ⚡ Variáveis de Ambiente & Banco de Dados (Supabase)
As configurações estão centralizadas no arquivo `.env`:
- `VITE_SUPABASE_URL=https://eeuooesahfbkgpozpiwy.supabase.co`
- `VITE_SUPABASE_ANON_KEY=...`

### Credenciais de Acesso ao Painel Lojista:
- **E-mail:** `admin@opticaconceicao.com.br` (ou `opticaconceicao@gmail.com` ou atalho `admin`)
- **Senha:** `admin123`

---

## 📍 Localização & Contato Oficial
- **Endereço:** Rua Capitão Valdemar de Lima, 116 C, Centro, Maracanaú - CE
- **WhatsApp Oficial:** +55 85 8822-0984
- **Horário de Atendimento:** Segunda a Sexta: 08h às 17h | Sábados: 08h às 12h

---

## 📂 Estrutura de Arquivos

```
optica-conceicao/
├── index.html               # Vitrine institucional e destaques da loja
├── catalogo.html            # Catálogo interativo com filtros e busca
├── admin/
│   ├── index.html           # Dashboard administrativo e CRUD de produtos
│   └── login.html           # Tela de autenticação para gerentes
├── css/
│   ├── style.css            # Design System (paleta luxo ouro/ônix, tipografia, modals)
│   ├── catalogo.css         # Layout dos filtros, chips e grid de produtos
│   └── admin.css            # Estilos do painel admin, tabelas e formulários
└── js/
    ├── db.js                # Banco de dados e gerenciamento de estado (LocalStorage)
    ├── app.js               # Lógica global, menu mobile e modal de detalhes
    ├── catalogo.js          # Motor de filtros e busca em tempo real
    └── admin.js             # Lógica do painel de administração e validações
```

---

## 🔮 Roadmap Futuro
- **Fase 2:** Provador Virtual (Virtual Try-On com câmera) e Agendador de Exames de Vista.
- **Fase 3:** Envio digital de receitas oftalmológicas para orçamento de lentes sob medida.
- **Fase 4:** Integração de E-commerce com checkout transparente e cálculo de frete.
