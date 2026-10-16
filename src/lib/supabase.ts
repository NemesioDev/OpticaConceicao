import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eeuooesahfbkgpozpiwy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVldW9vZXNhaGZia2dwb3pwaXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIxNjI1NzEsImV4cCI6MjEwNzczODU3MX0.Szoydfc-AlREPsMIUqG_bUQj0DwIIwmFl72jCVzh3Hc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * URL Oficial da Logo no Bucket do Supabase Storage
 */
export const LOGO_URL = `${supabaseUrl}/storage/v1/object/public/fotos-armacoes/branding/logo.png`;

/**
 * Faz upload de uma imagem (File ou base64) para o bucket "fotos-armacoes" do Supabase Storage
 * e retorna a URL pública acessível.
 */
export async function uploadFotoArmacao(imagem: File | string, nomeArquivoOriginal?: string): Promise<string> {
  try {
    const timestamp = Date.now();
    const nomeLimpo = (nomeArquivoOriginal || 'armacao.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `armacao_${timestamp}_${nomeLimpo}`;

    let bodyData: Blob | File;

    if (typeof imagem === 'string') {
      // Se for Base64 (DataURL), converter para Blob
      const res = await fetch(imagem);
      bodyData = await res.blob();
    } else {
      bodyData = imagem;
    }

    const { error: uploadError } = await supabase.storage
      .from('fotos-armacoes')
      .upload(path, bodyData, {
        contentType: bodyData.type || 'image/jpeg',
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.warn('Erro ao enviar foto para o Supabase Storage, usando fallback base64:', uploadError);
      return typeof imagem === 'string' ? imagem : URL.createObjectURL(imagem);
    }

    // Obter URL pública
    const { data: publicUrlData } = supabase.storage
      .from('fotos-armacoes')
      .getPublicUrl(path);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Falha no upload da foto para o Supabase Storage:', err);
    return typeof imagem === 'string' ? imagem : '';
  }
}
