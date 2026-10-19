import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CatalogProvider, useCatalog } from './context/CatalogContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { ProductModal } from './components/ProductModal';

/**
 * Redirecionador para links legados com hash (ex: #admin ou #catalogo)
 */
const HashRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#admin') {
      navigate('/admin', { replace: true });
    } else if (hash.startsWith('#catalogo')) {
      const paramMatch = hash.match(/categoria=([^&]+)/);
      if (paramMatch && paramMatch[1]) {
        navigate(`/catalogo?categoria=${paramMatch[1]}`, { replace: true });
      } else {
        navigate('/catalogo', { replace: true });
      }
    }
  }, [location, navigate]);

  return null;
};

/**
 * Layout padrão das páginas públicas (Header + Conteúdo + Footer + Modal)
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
      <Footer />
      <ProductModal />
    </div>
  );
};

/**
 * Rota protegida do painel administrativo
 * Mantém o lojista conectado mesmo após recarregar a página (F5)
 */
const AdminRoute: React.FC = () => {
  const { isAdmin, carregandoAuth } = useCatalog();

  if (carregandoAuth && !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem', animation: 'spin 1.5s infinite linear' }}>⏳</div>
          <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <LoginPage />;
  }

  return (
    <>
      <AdminPage />
      <ProductModal />
    </>
  );
};

export const App: React.FC = () => {
  return (
    <CatalogProvider>
      <BrowserRouter>
        <HashRedirectHandler />
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/catalogo" element={<MainLayout><CatalogPage /></MainLayout>} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CatalogProvider>
  );
};

export default App;
