import React, { useState, useEffect } from 'react';
import { Produto, CategoriaProduto, FormatoArmacao, GeneroProduto } from '../types/produto';
import { useCatalog } from '../context/CatalogContext';

interface AdminProductModalProps {
  produtoEditando: Produto | null;
  onClose: () => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({ produtoEditando, onClose }) => {
  const { produtos, adicionarProduto, atualizarProduto } = useCatalog();

  const [codigo, setCodigo] = useState('');
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [categoria, setCategoria] = useState<CategoriaProduto>('Grau');
  const [formato, setFormato] = useState<FormatoArmacao>('Redondo');
  const [genero, setGenero] = useState<GeneroProduto>('Unissex');
  const [material, setMaterial] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [novidade, setNovidade] = useState(false);
  const [ativo, setAtivo] = useState(true);

  const [medLente, setMedLente] = useState('52mm');
  const [medPonte, setMedPonte] = useState('18mm');
  const [medHaste, setMedHaste] = useState('140mm');
  const [rostos, setRostos] = useState('Oval, Redondo');

  const [imagemBase64, setImagemBase64] = useState<string>('');
  const [nomeArquivo, setNomeArquivo] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (produtoEditando) {
      setCodigo(produtoEditando.codigo);
      setNome(produtoEditando.nome);
      setMarca(produtoEditando.marca);
      setCategoria(produtoEditando.categoria);
      setFormato(produtoEditando.formato);
      setGenero(produtoEditando.genero);
      setMaterial(produtoEditando.material);
      setPreco(produtoEditando.precoReferencia ? String(produtoEditando.precoReferencia) : '');
      setDescricao(produtoEditando.descricao);
      setDestaque(produtoEditando.destaque);
      setNovidade(produtoEditando.novidade);
      setAtivo(produtoEditando.ativo);
      setMedLente(produtoEditando.medidas.lente);
      setMedPonte(produtoEditando.medidas.ponte);
      setMedHaste(produtoEditando.medidas.haste);
      setRostos(produtoEditando.rostosRecomendados.join(', '));
      if (produtoEditando.imagens.length > 0) {
        setImagemBase64(produtoEditando.imagens[0]);
        setNomeArquivo('Foto cadastrada no catálogo');
      }
    } else {
      setCodigo('OC-' + (produtos.length + 101));
      setNome('');
      setMarca('');
      setCategoria('Grau');
      setFormato('Redondo');
      setGenero('Unissex');
      setMaterial('Acetato Italiano');
      setPreco('');
      setDescricao('');
      setDestaque(false);
      setNovidade(true);
      setAtivo(true);
      setImagemBase64('');
      setNomeArquivo('');
    }
  }, [produtoEditando, produtos.length]);

  const otimizarEReceberFoto = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Selecione um arquivo de imagem válido (JPG, PNG ou WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const max = 800;

        if (width > height && width > max) {
          height = Math.round((height * max) / width);
          width = max;
        } else if (height > max) {
          width = Math.round((width * max) / height);
          height = max;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagemBase64(dataUrl);
        setNomeArquivo(file.name);
      };
    };
    reader.readAsDataURL(file);
  };

  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const dadosArmacao: Omit<Produto, 'id'> = {
        codigo,
        nome,
        marca,
        categoria,
        formato,
        genero,
        material,
        precoReferencia: preco ? parseFloat(preco) : undefined,
        descricao,
        destaque,
        novidade,
        ativo,
        medidas: { lente: medLente, ponte: medPonte, haste: medHaste },
        rostosRecomendados: rostos.split(',').map(r => r.trim()).filter(Boolean),
        imagens: [
          imagemBase64 || 'https://images.unsplash.com/photo-1591076482161-42ce6da69f68?auto=format&fit=crop&w=800&q=80'
        ]
      };

      if (produtoEditando) {
        await atualizarProduto(produtoEditando.id, dadosArmacao, imagemBase64, nomeArquivo);
      } else {
        await adicionarProduto(dadosArmacao, imagemBase64, nomeArquivo);
      }

      onClose();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div style={{ padding: '2.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>
            {produtoEditando ? `Editar Armação: ${produtoEditando.codigo}` : 'Cadastrar Nova Armação'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
            Preencha os dados e anexe a foto da armação para o catálogo da Óptica Conceição.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Código / SKU *</label>
                <input 
                  type="text" 
                  value={codigo} 
                  onChange={e => setCodigo(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Nome do Modelo *</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                  placeholder="ex: Ray-Ban Round Classic"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Marca *</label>
                <input 
                  type="text" 
                  value={marca} 
                  onChange={e => setMarca(e.target.value)} 
                  required 
                  placeholder="ex: Ray-Ban"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Categoria *</label>
                <select 
                  value={categoria} 
                  onChange={e => setCategoria(e.target.value as CategoriaProduto)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                >
                  <option value="Grau">Grau</option>
                  <option value="Sol">Sol</option>
                  <option value="Infantil">Infantil</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Formato do Aro *</label>
                <select 
                  value={formato} 
                  onChange={e => setFormato(e.target.value as FormatoArmacao)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                >
                  <option value="Redondo">Redondo</option>
                  <option value="Quadrado">Quadrado</option>
                  <option value="Aviador">Aviador</option>
                  <option value="Gatinho">Gatinho</option>
                  <option value="Hexagonal">Hexagonal</option>
                  <option value="Retangular">Retangular</option>
                  <option value="Oval">Oval</option>
                </select>
              </div>
            </div>

            {/* Upload de Imagem com Drag & Drop */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Foto da Armação *
              </label>

              <input 
                type="file" 
                id="file-upload-input" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    otimizarEReceberFoto(e.target.files[0]);
                  }
                }}
              />

              {!imagemBase64 ? (
                <div 
                  className={`upload-dropzone ${isDragging ? 'drag-over' : ''}`}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      otimizarEReceberFoto(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>Clique para selecionar ou arraste a foto da armação aqui</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Formatos suportados: JPG, PNG, WEBP (Otimização automática)</div>
                </div>
              ) : (
                <div className="upload-preview-container active">
                  <img src={imagemBase64} alt="Prévia" className="upload-preview-thumb" />
                  <div style={{ flexGrow: 1 }}>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-primary)' }}>{nomeArquivo || 'Foto da armação'}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>✓ Foto otimizada para o catálogo</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      type="button" 
                      className="btn btn-dark btn-sm"
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                    >
                      🔄 Trocar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-gold btn-sm"
                      style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                      onClick={() => { setImagemBase64(''); setNomeArquivo(''); }}
                    >
                      ✕ Remover
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Material</label>
                <input 
                  type="text" 
                  value={material} 
                  onChange={e => setMaterial(e.target.value)} 
                  placeholder="ex: Acetato Italiano"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Preço de Referência (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={preco} 
                  onChange={e => setPreco(e.target.value)} 
                  placeholder="ex: 590.00"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.4rem' }}>Descrição do Produto</label>
              <textarea 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)} 
                rows={3} 
                placeholder="Detalhes de acabamento, estilo e conforto..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={destaque} onChange={e => setDestaque(e.target.checked)} />
                <strong>Destacar na Vitrine Principal</strong>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={novidade} onChange={e => setNovidade(e.target.checked)} />
                <span>Marcar como Lançamento/Novo</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} />
                <span>Ativo no Catálogo</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
              <button type="button" className="btn btn-outline-gold" onClick={onClose} disabled={salvando}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-gold" disabled={salvando}>
                {salvando ? 'Salvando no Banco...' : 'Salvar Armação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
