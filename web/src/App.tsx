import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { useEffect, Suspense, lazy } from 'react'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Catalog = lazy(() => import('./pages/Catalog'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

function SPAFallbackHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedPath = sessionStorage.getItem('spa_redirect');
    if (savedPath) {
      sessionStorage.removeItem('spa_redirect');
      const cleanPath = savedPath.replace(/^\/coquchemas/, '');
      navigate(cleanPath);
    }
  }, [navigate]);
  
  return null;
}

function LoadingFallback() {
  return (
    <div className="loading-fallback">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default function App() {
  const isVercel = window.location.hostname.includes('vercel.app')
  const isGitHubPages = window.location.hostname.includes('github.io')
  const basename = isVercel ? '/' : isGitHubPages ? '/coquchemas' : '/coquchemas'
  
  return (
    <BrowserRouter basename={basename}>
      <SPAFallbackHandler />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
