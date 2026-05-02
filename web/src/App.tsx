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
  // Detect environment by hostname
  // Vercel: hostname includes 'vercel.app', serves from root (/)
  // GitHub Pages: hostname includes 'github.io', serves from /coquchemas/
  // Localhost: serves from /coquchemas
  const isVercel = window.location.hostname.includes('vercel.app')
  const isGitHubPages = window.location.hostname.includes('github.io')
  const basename = isVercel ? '/' : isGitHubPages ? '/coquchemas' : '/coquchemas'
  
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