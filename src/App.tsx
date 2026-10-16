import React, { useState } from 'react';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { ProductModal } from './components/ProductModal';

const AppContent: React.FC = () => {
  const [pagina, setPagina] = useState<string>('home');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todos');
  const { isAdmin } = useCatalog();

  const navegarPara = (novaPagina: string, param?: string) => {
    if (novaPagina === 'catalogo') {
      setCategoriaFiltro(param || 'todos');
    }
    setPagina(novaPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (pagina === 'admin') {
    if (!isAdmin) {
      return <LoginPage navegarPara={navegarPara} />;
    }
    return <AdminPage navegarPara={navegarPara} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header paginaAtual={pagina} navegarPara={navegarPara} />

      <div style={{ flexGrow: 1 }}>
        {pagina === 'home' && <HomePage navegarPara={navegarPara} />}
        {pagina === 'catalogo' && <CatalogPage categoriaInicial={categoriaFiltro} />}
      </div>

      <Footer navegarPara={navegarPara} />
      <ProductModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CatalogProvider>
      <AppContent />
    </CatalogProvider>
  );
};

export default App;
