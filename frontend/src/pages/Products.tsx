import React, { useState, useEffect, useRef } from 'react'
import { getProducts } from '../utils/productData'
import type { Product } from '../utils/productData'

interface ProductsProps {
  navigateToContact: (page: 1 | 2 | 3) => void;
}

const categoryColors: Record<string, string> = {
  'ERP & Finance': 'from-amber-500/20 to-amber-800/5 border-amber-600/30',
  'Automation': 'from-blue-500/20 to-blue-800/5 border-blue-600/30',
  'CRM & Sales': 'from-violet-500/20 to-violet-800/5 border-violet-600/30',
  'HR & Workforce': 'from-emerald-500/20 to-emerald-800/5 border-emerald-600/30',
  'Analytics & BI': 'from-cyan-500/20 to-cyan-800/5 border-cyan-600/30',
  'Service Operations': 'from-rose-500/20 to-rose-800/5 border-rose-600/30',
}

const categoryBadgeColors: Record<string, string> = {
  'ERP & Finance': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Automation': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'CRM & Sales': 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  'HR & Workforce': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Analytics & BI': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  'Service Operations': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
}

const statusColors: Record<string, string> = {
  'Live': 'bg-emerald-500/15 text-emerald-400',
  'Beta': 'bg-blue-500/15 text-blue-400',
  'Enterprise': 'bg-[#cc6f2a]/15 text-[#cc6f2a]',
}

const ProductIcon: React.FC<{ icon: string }> = ({ icon }) => {
  const iconClass = "w-7 h-7 text-white"
  switch (icon) {
    case 'erp':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
        </svg>
      )
    case 'automation':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    case 'crm':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    case 'hr':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    case 'analytics':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    case 'service':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M9 15h4" />
        </svg>
      )
  }
}

const ALL_CATEGORIES = ['All', 'ERP & Finance', 'Automation', 'CRM & Sales', 'HR & Workforce', 'Analytics & BI', 'Service Operations']

const Products: React.FC<ProductsProps> = ({ navigateToContact }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setProducts(getProducts())
    setTimeout(() => setIsLoaded(true), 50)
  }, [])

  // Close modal on escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedProduct(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Lock body scroll when modal open
  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selectedProduct])

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory
    const q = searchQuery.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  const featuredProducts = products.filter(p => p.isFeatured)

  return (
    <>
      {/* Hero Section */}
      <section
        id="products"
        className="w-full min-h-screen bg-[#07080a] mt-24 relative flex flex-col justify-center overflow-hidden animate-fade-in"
      >
        {/* Atmospheric glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#cc6f2a]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full py-20">
          {/* Eyebrow label */}
          <div className={`transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-[#cc6f2a]" />
              <span className="text-[13px] font-bold tracking-[0.2em] text-[#cc6f2a] uppercase font-sans">
                Galletrix Products
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <div className={`transition-all duration-1000 ease-out delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="font-serif text-[42px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-bold leading-[1.05] text-white tracking-tight mb-8 max-w-5xl">
              Enterprise Software<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cc6f2a] via-amber-400 to-[#cc6f2a]">
                Built to Scale
              </span>
            </h1>
          </div>

          <div className={`transition-all duration-1000 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="font-sans text-[17px] sm:text-[19px] md:text-[21px] leading-[1.7] text-slate-300 max-w-3xl mb-14">
              Six mission-critical software products covering every dimension of enterprise operations — from unified ERP and intelligent automation to real-time analytics and field service management.
            </p>
          </div>

          {/* Stat Badges */}
          <div className={`flex flex-wrap gap-4 mb-16 transition-all duration-1000 ease-out delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { label: 'Products', value: '6+' },
              { label: 'Deployments', value: '350+' },
              { label: 'Industries Served', value: '12' },
              { label: 'Uptime SLA', value: '99.9%' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 backdrop-blur-sm"
              >
                <span className="font-sans text-[15px] font-bold text-white">{stat.value}</span>
                <span className="font-sans text-[12px] text-slate-400">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-out delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={() => navigateToContact(2)}
              className="bg-[#cc6f2a] hover:bg-[#b86120] text-white px-8 py-4 rounded-full text-[15px] font-semibold flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg shadow-[#cc6f2a]/20 cursor-pointer"
              id="products-book-demo-btn"
            >
              <span>Book a Free Demo</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('products-catalog')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-full text-[15px] font-semibold transition-all duration-300 cursor-pointer"
              id="products-explore-btn"
            >
              Explore Products
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[11px] text-white tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent animate-pulse" />
        </div>
      </section>

      {/* Featured Products Spotlight */}
      {featuredProducts.length > 0 && (
        <section className="w-full bg-[#07080a] py-24 md:py-32 border-t border-slate-900/60">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#cc6f2a]" />
              <span className="text-[12px] font-bold tracking-[0.2em] text-[#cc6f2a] uppercase">Flagship Products</span>
            </div>
            <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] font-medium text-white tracking-tight mb-16">
              Powering Enterprise Operations
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`relative bg-gradient-to-br ${categoryColors[product.category] || 'from-slate-500/10 to-slate-800/5 border-slate-600/20'} border rounded-[28px] p-8 md:p-10 overflow-hidden group cursor-pointer hover:scale-[1.01] transition-all duration-400`}
                  onClick={() => setSelectedProduct(product)}
                  id={`products-featured-${product.id}`}
                >
                  {/* Background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                  <div className="relative z-10">
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                          <ProductIcon icon={product.icon} />
                        </div>
                        <div>
                          <span className={`text-[11px] font-bold uppercase tracking-wider border rounded-full px-2.5 py-0.5 ${categoryBadgeColors[product.category] || 'bg-white/10 text-white border-white/20'}`}>
                            {product.badge}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColors[product.status]}`}>
                          ● {product.status}
                        </span>
                      </div>
                    </div>

                    <h3 className="scroll-reveal-target font-serif text-[26px] md:text-[30px] font-bold text-white tracking-tight mb-3">
                      {product.name}
                    </h3>
                    <p className="scroll-reveal-target text-[15px] text-slate-300 leading-[1.7] mb-8 max-w-md">
                      {product.description.substring(0, 180)}...
                    </p>

                    {/* Highlights Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {product.highlights.slice(0, 4).map((h, i) => (
                        <div key={i} className="bg-black/30 rounded-xl p-4 backdrop-blur-sm border border-white/8">
                          <div className="font-serif text-[22px] font-bold text-white leading-none mb-1">{h.value}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{h.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Key features preview */}
                    <div className="space-y-2 mb-8">
                      {product.features.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-[13px] text-slate-300">
                          <svg className="w-3.5 h-3.5 text-[#cc6f2a] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </div>
                      ))}
                      <div className="text-[12px] text-slate-500 pl-6">
                        +{product.features.length - 3} more capabilities
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigateToContact(2) }}
                        className="bg-white text-[#07080a] hover:bg-slate-100 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        id={`products-demo-${product.id}`}
                      >
                        Request Demo
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProduct(product) }}
                        className="flex items-center gap-1.5 text-[13px] font-semibold text-white/70 hover:text-white transition-colors cursor-pointer group/link"
                      >
                        <span>Explore Specs</span>
                        <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Catalog */}
      <section id="products-catalog" className="w-full bg-[#07080a] py-24 md:py-32 border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Section header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#cc6f2a]" />
                <span className="text-[12px] font-bold tracking-[0.2em] text-[#cc6f2a] uppercase">Full Catalog</span>
              </div>
              <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] font-medium text-white tracking-tight">
                All Products
              </h2>
            </div>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-full pl-10 pr-4 py-3 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#cc6f2a] transition-all"
                id="products-search-input"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2.5 mb-12">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#cc6f2a] text-white shadow-lg shadow-[#cc6f2a]/20'
                    : 'bg-white/5 border border-white/15 text-slate-400 hover:border-white/30 hover:text-white'
                }`}
                id={`products-filter-${cat.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 text-slate-500 text-[15px]">
              No products found for your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white/3 border border-white/10 rounded-[24px] p-7 flex flex-col justify-between hover:border-white/25 hover:bg-white/5 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProduct(product)}
                  id={`products-card-${product.id}`}
                >
                  {/* Top area */}
                  <div>
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-11 h-11 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
                        <ProductIcon icon={product.icon} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[product.status]}`}>
                          {product.status}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider border rounded-full px-2 py-0.5 ${categoryBadgeColors[product.category] || 'bg-white/10 text-slate-300 border-white/20'}`}>
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="scroll-reveal-target font-serif text-[21px] font-bold text-white tracking-tight mb-2 group-hover:text-white transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[13px] text-slate-400 leading-relaxed mb-6">
                      {product.tagline}
                    </p>

                    {/* Feature list */}
                    <div className="space-y-2 mb-7">
                      {product.features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex items-start gap-2 text-[12px] text-slate-400">
                          <svg className="w-3 h-3 text-[#cc6f2a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tier badge */}
                    <div className="flex items-center gap-2 pb-6 border-b border-white/8">
                      <span className="text-[11px] text-slate-500">Tier:</span>
                      <span className="text-[11px] font-semibold text-slate-300">{product.tier}</span>
                    </div>
                  </div>

                  {/* Bottom actions */}
                  <div className="flex items-center justify-between pt-5">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigateToContact(2) }}
                      className="bg-[#cc6f2a]/20 hover:bg-[#cc6f2a] border border-[#cc6f2a]/40 hover:border-[#cc6f2a] text-[#cc6f2a] hover:text-white px-5 py-2 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer"
                    >
                      Request Demo
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedProduct(product) }}
                      className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group/link"
                    >
                      <span>View Specs</span>
                      <svg className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Enterprise Capabilities Matrix */}
      <section className="w-full bg-black py-24 md:py-32 border-t border-slate-900/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-[#cc6f2a]" />
                <span className="text-[12px] font-bold tracking-[0.2em] text-[#cc6f2a] uppercase">Enterprise Grade</span>
              </div>
              <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] font-medium text-white tracking-tight mb-8">
                Built for Mission-Critical Operations
              </h2>
              <p className="scroll-reveal-target text-[16px] md:text-[17px] text-slate-400 leading-[1.8] mb-10">
                Every Galletrix product ships with enterprise-grade infrastructure commitments, security compliance, and deployment flexibility to meet the demands of regulated industries and scale-intensive organizations.
              </p>
              <button
                onClick={() => navigateToContact(2)}
                className="bg-[#cc6f2a] hover:bg-[#b86120] text-white px-8 py-4 rounded-full text-[15px] font-semibold flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#cc6f2a]/20 cursor-pointer"
                id="products-enterprise-cta"
              >
                <span>Talk to Our Enterprise Team</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Right: SLA & Compliance Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Uptime SLA', value: '99.9%', sub: 'Guaranteed across all products', icon: '⚡' },
                { label: 'Data Encryption', value: 'AES-256', sub: 'At rest & in transit', icon: '🔒' },
                { label: 'Deployment Options', value: '3 modes', sub: 'Cloud, On-premise, Hybrid', icon: '☁️' },
                { label: 'Automated Backups', value: 'Daily', sub: 'Point-in-time restore ready', icon: '💾' },
                { label: 'Role-Based Access', value: 'RBAC', sub: 'Granular permission control', icon: '🛡️' },
                { label: 'Response SLA', value: '< 4 hrs', sub: 'Priority enterprise support', icon: '🎯' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-serif text-[22px] font-bold text-white mb-1">{item.value}</div>
                  <div className="text-[12px] font-semibold text-[#cc6f2a] mb-1">{item.label}</div>
                  <div className="text-[11px] text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#07080a] py-24 md:py-32 border-t border-slate-900/60">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <div className="relative">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#cc6f2a]/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <span className="text-[12px] font-bold tracking-[0.2em] text-[#cc6f2a] uppercase block mb-6">Get Started</span>
              <h2 className="scroll-reveal-target font-serif text-[36px] sm:text-[48px] md:text-[60px] font-bold text-white tracking-tight mb-6 leading-[1.1]">
                Ready to transform<br />your operations?
              </h2>
              <p className="scroll-reveal-target text-[16px] sm:text-[18px] text-slate-400 leading-[1.8] max-w-2xl mx-auto mb-12">
                Book a personalized demo with our solutions engineers and see exactly how Galletrix products will fit into your enterprise workflow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigateToContact(2)}
                  className="bg-[#cc6f2a] hover:bg-[#b86120] text-white px-10 py-4.5 rounded-full text-[16px] font-bold flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-[#cc6f2a]/20 cursor-pointer"
                  id="products-final-cta"
                >
                  Book Free Consultation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button
                  onClick={() => navigateToContact(1)}
                  className="bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white px-10 py-4.5 rounded-full text-[16px] font-semibold transition-all duration-300 cursor-pointer"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null) }}
          id="products-modal-overlay"
        >
          <div
            ref={modalRef}
            className="relative w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[88vh] bg-[#0a0a0f] border border-white/15 sm:rounded-[28px] rounded-t-[28px] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur-md border-b border-white/10 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center">
                  <ProductIcon icon={selectedProduct.icon} />
                </div>
                <div>
                  <h3 className="font-serif text-[18px] font-bold text-white">{selectedProduct.name}</h3>
                  <span className="text-[11px] text-slate-400">{selectedProduct.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                id="products-modal-close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-8 space-y-10">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2.5">
                <span className={`text-[11px] font-bold uppercase tracking-wider border rounded-full px-3 py-1 ${categoryBadgeColors[selectedProduct.category] || 'bg-white/10 text-slate-300 border-white/20'}`}>
                  {selectedProduct.badge}
                </span>
                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full ${statusColors[selectedProduct.status]}`}>
                  ● {selectedProduct.status}
                </span>
                <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/8 text-slate-300">
                  {selectedProduct.tier} Tier
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-3">Overview</h4>
                <p className="text-[15px] text-slate-300 leading-[1.8]">{selectedProduct.description}</p>
              </div>

              {/* Highlights */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-5">Key Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedProduct.highlights.map((h, i) => (
                    <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4 text-center">
                      <div className="font-serif text-[24px] font-bold text-white mb-1">{h.value}</div>
                      <div className="text-[11px] text-slate-400">{h.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-5">Full Feature Set</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProduct.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 text-[#cc6f2a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-[13px] text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment options */}
              <div>
                <h4 className="text-[13px] font-bold uppercase tracking-widest text-slate-500 mb-5">Deployment Options</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['☁️ Cloud SaaS', '🖥️ On-Premise', '⚙️ Hybrid'].map((opt) => (
                    <div key={opt} className="bg-white/4 border border-white/8 rounded-xl p-4 text-center">
                      <div className="text-[13px] text-slate-300 font-medium">{opt}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compliance note */}
              <div className="bg-[#cc6f2a]/8 border border-[#cc6f2a]/25 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#cc6f2a] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <div className="text-[13px] font-bold text-[#cc6f2a] mb-1">Compliance & Security</div>
                    <div className="text-[13px] text-slate-400 leading-relaxed">
                      All Galletrix products are built with AES-256 encryption, role-based access control (RBAC), full audit trails, and are designed to support SOC2, HIPAA, and GDPR compliance frameworks.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/10 px-8 py-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => { setSelectedProduct(null); navigateToContact(2) }}
                className="flex-1 bg-[#cc6f2a] hover:bg-[#b86120] text-white py-3.5 rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                id="products-modal-demo-btn"
              >
                Request a Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="sm:w-36 bg-white/8 hover:bg-white/15 border border-white/15 text-white py-3.5 rounded-xl text-[14px] font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Products
