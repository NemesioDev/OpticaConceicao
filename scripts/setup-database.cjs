const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const connectionString = 'postgresql://postgres.eeuooesahfbkgpozpiwy:OOsGWSgINqhnVfLg@aws-1-us-west-2.pooler.supabase.com:5432/postgres';
const supabaseUrl = 'https://eeuooesahfbkgpozpiwy.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldW9vZXNhaGZia2dwb3pwaXd5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjE2MjU3MSwiZXhwIjoyMTA3NzM4NTcxfQ.GIEVh6PY5WnBHgyvS5gmV5FmPD0AhPTr3m-USM9XWaU';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket }
});

const PRODUTOS_INICIAIS = [
  {
    codigo: 'OC-101',
    nome: 'Armação Vogue Elegance Chic',
    marca: 'Vogue Eyewear',
    categoria: 'Grau',
    formato: 'Gatinho',
    material: 'Acetato Italiano',
    genero: 'Feminino',
    preco_referencia: 499.00,
    destaque: true,
    novidade: true,
    ativo: true,
    descricao: 'Design contemporâneo com curvas sofisticadas estilo gatinho. Leveza e durabilidade no acetato premium com detalhes dourados na haste.',
    medidas: { lente: '53mm', ponte: '17mm', haste: '140mm' },
    rostos_recomendados: ['Oval', 'Redondo', 'Coração'],
    imagens: [
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-102',
    nome: 'Ray-Ban Aviador Clássico Gold',
    marca: 'Ray-Ban',
    categoria: 'Sol',
    formato: 'Aviador',
    material: 'Metal Nobre',
    genero: 'Unissex',
    preco_referencia: 729.00,
    destaque: true,
    novidade: false,
    ativo: true,
    descricao: 'Ícone atemporal que nunca sai de moda. Estrutura metálica dourada ultra resistente com lentes clássicas verde G-15 e proteção total UV400.',
    medidas: { lente: '58mm', ponte: '14mm', haste: '135mm' },
    rostos_recomendados: ['Quadrado', 'Oval', 'Coração'],
    imagens: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-103',
    nome: 'Oakley Holbrook Stealth Matte',
    marca: 'Oakley',
    categoria: 'Sol',
    formato: 'Quadrado',
    material: 'O Matter™ Injetado',
    genero: 'Masculino',
    preco_referencia: 689.00,
    destaque: true,
    novidade: true,
    ativo: true,
    descricao: 'Visual descolado com alta tecnologia de absorção de impactos. Lentes polarizadas Prizm™ que realçam as cores e o contraste.',
    medidas: { lente: '55mm', ponte: '18mm', haste: '137mm' },
    rostos_recomendados: ['Redondo', 'Oval'],
    imagens: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-104',
    nome: 'Persol Sartoria Vintage Redondo',
    marca: 'Persol',
    categoria: 'Grau',
    formato: 'Redondo',
    material: 'Acetato & Prata',
    genero: 'Unissex',
    preco_referencia: 849.00,
    destaque: false,
    novidade: true,
    ativo: true,
    descricao: 'Artesanato italiano tradicional com a clássica Flecha Supreme. Perfeito para quem busca intelectualidade e requinte no dia a dia.',
    medidas: { lente: '50mm', ponte: '20mm', haste: '145mm' },
    rostos_recomendados: ['Quadrado', 'Retangular'],
    imagens: [
      'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-105',
    nome: 'Armação Titanium Ultralight Minimal',
    marca: 'Silhouette',
    categoria: 'Grau',
    formato: 'Retangular',
    material: 'Titânio Puro',
    genero: 'Masculino',
    preco_referencia: 980.00,
    destaque: true,
    novidade: false,
    ativo: true,
    descricao: 'Pesa menos de 10 gramas. Haste sem parafusos em titânio cirúrgico antialérgico, proporcionando conforto inigualável para uso contínuo.',
    medidas: { lente: '54mm', ponte: '16mm', haste: '142mm' },
    rostos_recomendados: ['Oval', 'Redondo'],
    imagens: [
      'https://images.unsplash.com/photo-1582142306909-195724d33ffc?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-106',
    nome: 'Prada Cinema Hexagonal Dourado',
    marca: 'Prada',
    categoria: 'Sol',
    formato: 'Hexagonal',
    material: 'Metal & Policarbonato',
    genero: 'Feminino',
    preco_referencia: 1190.00,
    destaque: true,
    novidade: true,
    ativo: true,
    descricao: 'Geometria marcante com acabamento acetinado e detalhes requintados. Lentes dégradé com filtro UV de máxima eficiência.',
    medidas: { lente: '52mm', ponte: '19mm', haste: '140mm' },
    rostos_recomendados: ['Oval', 'Coração', 'Redondo'],
    imagens: [
      'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-107',
    nome: 'Armação Kids Flexível Antichoque',
    marca: 'Miraflex',
    categoria: 'Infantil',
    formato: 'Oval',
    material: 'Silicone e Polímero Flex',
    genero: 'Infantil',
    preco_referencia: 289.00,
    destaque: false,
    novidade: false,
    ativo: true,
    descricao: 'Armação sem partes metálicas totalmente flexível e anatômica. Ideal para crianças ativas com máxima segurança e ajuste com elástico regulável.',
    medidas: { lente: '44mm', ponte: '15mm', haste: '120mm' },
    rostos_recomendados: ['Infantil'],
    imagens: [
      'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    codigo: 'OC-108',
    nome: 'Clubmaster Heritage Tortoise',
    marca: 'Ray-Ban',
    categoria: 'Grau',
    formato: 'Retangular',
    material: 'Acetato Tartaruga & Metal',
    genero: 'Unissex',
    preco_referencia: 679.00,
    destaque: true,
    novidade: false,
    ativo: true,
    descricao: 'O estilo retrô intelectual dos anos 50 redefinido para a era moderna. Padrão tartaruga exclusivo com ponte metálica entalhada.',
    medidas: { lente: '51mm', ponte: '21mm', haste: '145mm' },
    rostos_recomendados: ['Oval', 'Redondo', 'Diamante'],
    imagens: [
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

async function setup() {
  console.log('🚀 Conectando ao banco de dados PostgreSQL do Supabase...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Conexão com o banco estabelecida com sucesso!');

    // 1. Criar Tabela produtos
    console.log('📦 Criando tabela "produtos"...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.produtos (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo TEXT NOT NULL,
        nome TEXT NOT NULL,
        marca TEXT NOT NULL,
        categoria TEXT NOT NULL,
        formato TEXT NOT NULL,
        material TEXT,
        genero TEXT NOT NULL DEFAULT 'Unissex',
        preco_referencia NUMERIC(10, 2),
        destaque BOOLEAN DEFAULT false,
        novidade BOOLEAN DEFAULT false,
        ativo BOOLEAN DEFAULT true,
        descricao TEXT,
        medidas JSONB DEFAULT '{"lente": "52mm", "ponte": "18mm", "haste": "140mm"}'::jsonb,
        rostos_recomendados TEXT[] DEFAULT '{}',
        imagens TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Leitura pública de produtos" ON public.produtos;
      CREATE POLICY "Leitura pública de produtos" ON public.produtos FOR SELECT USING (true);

      DROP POLICY IF EXISTS "Inserção de produtos" ON public.produtos;
      CREATE POLICY "Inserção de produtos" ON public.produtos FOR INSERT WITH CHECK (true);

      DROP POLICY IF EXISTS "Atualização de produtos" ON public.produtos;
      CREATE POLICY "Atualização de produtos" ON public.produtos FOR UPDATE USING (true);

      DROP POLICY IF EXISTS "Exclusão de produtos" ON public.produtos;
      CREATE POLICY "Exclusão de produtos" ON public.produtos FOR DELETE USING (true);
    `);
    console.log('✅ Tabela "produtos" e políticas RLS configuradas!');

    // 2. Verificar se já existem produtos
    const resCount = await client.query('SELECT count(*) FROM public.produtos');
    const totalProdutos = parseInt(resCount.rows[0].count, 10);
    console.log(`📊 Total de produtos existentes: ${totalProdutos}`);

    if (totalProdutos === 0) {
      console.log('✨ Inserindo catálogo inicial com 8 modelos...');
      for (const p of PRODUTOS_INICIAIS) {
        await client.query(`
          INSERT INTO public.produtos (
            codigo, nome, marca, categoria, formato, material, genero,
            preco_referencia, destaque, novidade, ativo, descricao,
            medidas, rostos_recomendados, imagens
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        `, [
          p.codigo, p.nome, p.marca, p.categoria, p.formato, p.material, p.genero,
          p.preco_referencia, p.destaque, p.novidade, p.ativo, p.descricao,
          JSON.stringify(p.medidas), p.rostos_recomendados, p.imagens
        ]);
      }
      console.log('✅ 8 armações padrão inseridas com sucesso no banco!');
    }

    // 3. Criar Bucket de Storage para fotos
    console.log('📁 Verificando bucket de Storage "fotos-armacoes"...');
    const { data: buckets } = await supabaseAdmin.storage.listBuckets();
    const existeBucket = buckets && buckets.some(b => b.name === 'fotos-armacoes');

    if (!existeBucket) {
      const { error: errBucket } = await supabaseAdmin.storage.createBucket('fotos-armacoes', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      if (errBucket) {
        console.warn('Aviso ao criar bucket:', errBucket.message);
      } else {
        console.log('✅ Bucket "fotos-armacoes" criado com acesso público!');
      }
    } else {
      console.log('✅ Bucket "fotos-armacoes" já existe e está pronto para uso!');
    }

    // 4. Criar Usuários Administradores no Supabase Auth
    console.log('👤 Configurando contas de Administrador no Supabase Auth...');
    const adminEmails = ['admin@opticaconceicao.com.br', 'opticaconceicao@gmail.com'];

    for (const email of adminEmails) {
      const { data: userExists } = await supabaseAdmin.auth.admin.listUsers();
      const jaExiste = userExists && userExists.users.some(u => u.email === email);

      if (!jaExiste) {
        const { data: novoUser, error: errUser } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: 'admin123',
          email_confirm: true,
          user_metadata: { role: 'admin', nome: 'Administrador Óptica Conceição' }
        });
        if (errUser) {
          console.warn(`Aviso ao criar usuário ${email}:`, errUser.message);
        } else {
          console.log(`✅ Usuário administrador criado: ${email} (senha: admin123)`);
        }
      } else {
        // Atualizar senha garantindo acesso com admin123
        const u = userExists.users.find(usr => usr.email === email);
        if (u) {
          await supabaseAdmin.auth.admin.updateUserById(u.id, {
            password: 'admin123',
            email_confirm: true
          });
          console.log(`✅ Usuário ${email} atualizado e confirmado com senha "admin123"!`);
        }
      }
    }

    console.log('\n🎉 SUPABASE TOTALMENTE CONFIGURADO COM SUCESSO!');
  } catch (err) {
    console.error('❌ Erro durante setup do Supabase:', err);
  } finally {
    await client.end();
  }
}

setup();
