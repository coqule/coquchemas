import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import './App.css'

export default function App() {
  const basename = window.location.hostname === 'localhost' ? '/coquchemas' : 
                  window.location.pathname.startsWith('/coquchemas') ? '/coquchemas' : ''
  
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:category" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  )
}