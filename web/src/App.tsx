import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import './App.css'

function SPAFallbackHandler() {
  const navigate = useNavigate();
  
  useEffect(() => {
    const savedPath = sessionStorage.getItem('spa_redirect');
    if (savedPath) {
      sessionStorage.removeItem('spa_redirect');
      // Remove /coquchemas prefix if present
      const cleanPath = savedPath.replace(/^\/coquchemas/, '');
      navigate(cleanPath);
    }
  }, [navigate]);
  
  return null;
}

export default function App() {
  const basename = window.location.hostname === 'localhost' ? '/coquchemas' : 
                window.location.pathname.startsWith('/coquchemas') ? '/coquchemas' : ''
  
  return (
    <BrowserRouter basename={basename}>
      <SPAFallbackHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}