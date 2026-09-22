import React, { useState, useEffect } from 'react'
import { getProjects, saveProjects } from '../utils/projectData'
import { getProducts, saveProducts } from '../utils/productData'
import type { Project } from '../utils/projectData'
import type { Product } from '../utils/productData'

interface Submission {
  id: number
  type: 'contact' | 'career'
  name: string
  detail: string
  time: string
  status: 'new' | 'reviewed'
}

const initialSubmissions: Submission[] = [
  { id: 1, type: 'career', name: 'Jane Doe', detail: 'Senior Frontend Engineer | Applied with resume.pdf', time: '2 hours ago', status: 'new' },
  { id: 2, type: 'contact', name: 'Alice Johnson', detail: 'Acme Corp | Interested in ERP implementation & Automation', time: '3 hours ago', status: 'new' },
  { id: 3, type: 'contact', name: 'Bob Miller', detail: 'BuildIT | Requesting quote for custom React/Node SPA', time: '5 hours ago', status: 'reviewed' },
  { id: 4, type: 'career', name: 'John Smith', detail: 'Technical Project Manager | Experience: 6 years', time: '1 day ago', status: 'reviewed' },
]

interface AdminLoginProps {
  navigateToContact: (page: 1 | 2 | 3) => void
}

type AdminTab = 'overview' | 'products' | 'portfolio' | 'submissions' | 'console'

const AUTHORIZED_EMAILS = ['ceo@galletrix.com', 'admin@galletrix.com']
const SESSION_KEY = 'galletrix_admin_session'

const AdminLogin: React.FC<AdminLoginProps> = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('overview')

  // Dashboard state
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'contact' | 'career'>('all')
  const [logs, setLogs] = useState<string[]>([
    `[INFO] ${new Date().toLocaleTimeString()} - Admin portal initialized`,
    `[INFO] ${new Date().toLocaleTimeString()} - Database connection pool healthy`,
    `[INFO] 10:42:01 - Server container started on port 5252`,
    `[INFO] 09:30:15 - Background routine cleared temporary upload cache`,
  ])

  // Project manager state
  const [projectsList, setProjectsList] = useState<Project[]>([])
  const [newTag, setNewTag] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newMetric1, setNewMetric1] = useState('')
  const [newMetric2, setNewMetric2] = useState('')
  const [newMetric3, setNewMetric3] = useState('')
  const [newSelectedWork, setNewSelectedWork] = useState(false)

  // Product manager state
  const [productsList, setProductsList] = useState<Product[]>([])
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [prodName, setProdName] = useState('')
  const [prodTagline, setProdTagline] = useState('')
  const [prodCategory, setProdCategory] = useState<Product['category']>('ERP & Finance')
  const [prodBadge, setProdBadge] = useState('')
  const [prodDescription, setProdDescription] = useState('')
  const [prodTier, setProdTier] = useState('')
  const [prodStatus, setProdStatus] = useState<Product['status']>('Live')
  const [prodFeatured, setProdFeatured] = useState(false)
  const [prodFeatures, setProdFeatures] = useState('')

  // Auth flow
  type AuthStage = 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset'
  const [stage, setStage] = useState<AuthStage>('login')
  const [adminPassword, setAdminPassword] = useState('admin123')
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [successText, setSuccessText] = useState('')

  // Session restore on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === 'active') {
      setIsLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      setProjectsList(getProjects())
      setProductsList(getProducts())
    }
  }, [isLoggedIn])

  // ── Project CRUD ────────────────────────────────────────────────────────────

  const handleDeleteProject = (id: string) => {
    const updated = projectsList.filter(p => p.id !== id)
    setProjectsList(updated)
    saveProjects(updated)
    addLog(`[ACTION] Deleted project with ID: ${id}`)
  }

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim() || !newTitle.trim() || !newDescription.trim()) {
      alert('Please fill out Tag, Title, and Description.')
      return
    }
    const metrics: string[] = []
    if (newMetric1.trim()) metrics.push(newMetric1.trim())
    if (newMetric2.trim()) metrics.push(newMetric2.trim())
    if (newMetric3.trim()) metrics.push(newMetric3.trim())

    const newProj: Project = {
      id: Date.now().toString(),
      tag: newTag.trim(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      metrics,
      selectedWork: newSelectedWork,
    }
    const updated = [...projectsList, newProj]
    setProjectsList(updated)
    saveProjects(updated)
    setNewTag(''); setNewTitle(''); setNewDescription('')
    setNewMetric1(''); setNewMetric2(''); setNewMetric3('')
    setNewSelectedWork(false)
    addLog(`[ACTION] Created new project: "${newProj.title}"`)
  }

  // ── Product CRUD ────────────────────────────────────────────────────────────

  const resetProdForm = () => {
    setEditingProductId(null)
    setProdName(''); setProdTagline(''); setProdBadge('')
    setProdDescription(''); setProdTier(''); setProdFeatures('')
    setProdCategory('ERP & Finance'); setProdStatus('Live'); setProdFeatured(false)
  }

  const handleEditProduct = (p: Product) => {
    setEditingProductId(p.id)
    setProdName(p.name); setProdTagline(p.tagline); setProdBadge(p.badge)
    setProdDescription(p.description); setProdTier(p.tier)
    setProdCategory(p.category); setProdStatus(p.status); setProdFeatured(p.isFeatured)
    setProdFeatures(p.features.join('\n'))
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prodName.trim() || !prodTagline.trim() || !prodDescription.trim()) {
      alert('Name, Tagline, and Description are required.')
      return
    }
    const features = prodFeatures.split('\n').map(f => f.trim()).filter(Boolean)
    const iconMap: Record<Product['category'], string> = {
      'ERP & Finance': 'erp',
      'Automation': 'automation',
      'CRM & Sales': 'crm',
      'HR & Workforce': 'hr',
      'Analytics & BI': 'analytics',
      'Service Operations': 'service',
    }

    if (editingProductId) {
      const updated = productsList.map(p =>
        p.id === editingProductId
          ? { ...p, name: prodName, tagline: prodTagline, badge: prodBadge, description: prodDescription, tier: prodTier, category: prodCategory, status: prodStatus, isFeatured: prodFeatured, features, icon: iconMap[prodCategory] }
          : p
      )
      setProductsList(updated)
      saveProducts(updated)
      addLog(`[ACTION] Updated product: "${prodName}"`)
    } else {
      const newProd: Product = {
        id: Date.now().toString(),
        name: prodName, tagline: prodTagline, badge: prodBadge,
        description: prodDescription, tier: prodTier,
        category: prodCategory, status: prodStatus, isFeatured: prodFeatured,
        features, highlights: [], icon: iconMap[prodCategory],
      }
      const updated = [...productsList, newProd]
      setProductsList(updated)
      saveProducts(updated)
      addLog(`[ACTION] Created new product: "${prodName}"`)
    }
    resetProdForm()
  }

  const handleDeleteProduct = (id: string) => {
    const updated = productsList.filter(p => p.id !== id)
    setProductsList(updated)
    saveProducts(updated)
    addLog(`[ACTION] Deleted product with ID: ${id}`)
  }

  const handleToggleFeatured = (id: string) => {
    const updated = productsList.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p)
    setProductsList(updated)
    saveProducts(updated)
    const prod = updated.find(p => p.id === id)
    addLog(`[ACTION] Toggled featured status for: "${prod?.name}"`)
  }

  // ── Auth ────────────────────────────────────────────────────────────────────

  const addLog = (msg: string) => {
    setLogs(prev => [`${msg} @ ${new Date().toLocaleTimeString()}`, ...prev])
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorText(''); setSuccessText('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) { setErrorText('Please enter a valid email address.'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      const emailLower = email.trim().toLowerCase()
      const isAuthorized = AUTHORIZED_EMAILS.some(e => e === emailLower)
      if (isAuthorized && password === adminPassword) {
        sessionStorage.setItem(SESSION_KEY, 'active')
        setIsLoggedIn(true)
        setIsSubmitting(false)
      } else {
        setErrorText('Invalid email or password. Please try again.')
        setIsSubmitting(false)
      }
    }, 1200)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorText('')
    const emailLower = forgotEmail.trim().toLowerCase()
    if (!AUTHORIZED_EMAILS.some(a => a === emailLower)) {
      setErrorText('Recovery OTP can only be sent to an authorized administrator email.')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ceo@galletrix.com' }),
      })
      if (response.ok) {
        setIsSubmitting(false); setStage('forgot-otp')
        addLog(`[SECURITY] Recovery OTP sent to admin email`)
      } else {
        const err = await response.text()
        setErrorText(err || 'Failed to send OTP. Please try again.'); setIsSubmitting(false)
      }
    } catch {
      setErrorText('A network error occurred while sending OTP.'); setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorText(''); setIsSubmitting(true)
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ceo@galletrix.com', otp: otpInput.trim() }),
      })
      if (response.ok) { setStage('forgot-reset'); setIsSubmitting(false) }
      else { const err = await response.text(); setErrorText(err || 'Invalid OTP code.'); setIsSubmitting(false) }
    } catch { setErrorText('A network error occurred while verifying OTP.'); setIsSubmitting(false) }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault(); setErrorText('')
    if (!newPassword.trim()) { setErrorText('Password cannot be empty.'); return }
    if (newPassword !== confirmNewPassword) { setErrorText('Passwords do not match.'); return }
    setIsSubmitting(true)
    setTimeout(() => {
      setAdminPassword(newPassword)
      setSuccessText('Password reset successfully. Log in using your new credentials.')
      setForgotEmail(''); setOtpInput(''); setNewPassword(''); setConfirmNewPassword('')
      setIsSubmitting(false); setStage('login')
      addLog(`[SECURITY] Admin password reset successfully`)
    }, 1000)
  }

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setIsLoggedIn(false); setEmail(''); setPassword(''); setErrorText(''); setActiveTab('overview')
  }

  const handleMarkReviewed = (id: number) => {
    setSubmissions(prev => prev.map(sub => sub.id === id ? { ...sub, status: 'reviewed' as const } : sub))
    addLog(`[ACTION] Marked submission #${id} as reviewed`)
  }

  const handleDeleteSubmission = (id: number) => {
    setSubmissions(prev => prev.filter(sub => sub.id !== id))
    addLog(`[ACTION] Deleted submission #${id}`)
  }

  const filteredSubmissions = submissions.filter(s =>
    submissionFilter === 'all' ? true : s.type === submissionFilter
  )

  const tabClass = (t: AdminTab) =>
    `px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
      activeTab === t
        ? 'bg-[#cc6f2a] text-white shadow-md'
        : 'text-slate-400 hover:text-white hover:bg-white/8'
    }`

  const inputClass = "w-full bg-black border border-white/20 rounded-xl px-4 py-2.5 text-[14px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all"

  // ── Logged-in Dashboard ─────────────────────────────────────────────────────

  if (isLoggedIn) {
    return (
      <div className="w-full min-h-[calc(100vh-6rem)] mt-24 py-10 px-4 md:px-8 lg:px-12 bg-black animate-fade-in">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-8">
            <div>
              <span className="text-[13px] font-semibold tracking-wider text-[#cc6f2a] uppercase font-sans">
                Galletrix Admin Portal
              </span>
              <h1 className="font-serif text-[36px] sm:text-[42px] font-bold text-white tracking-tight mt-1">
                Control Hub
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black border border-white/20 text-[13px] text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Admin session active
              </div>
              <button
                onClick={handleLogout}
                className="bg-black hover:bg-slate-900 border border-white/20 text-white px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 cursor-pointer active:scale-95"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Submissions', value: String(submissions.length), sub: 'contact & career', change: '+12%' },
              { label: 'Products Catalog', value: String(productsList.length), sub: 'active products', change: '' },
              { label: 'Portfolio Works', value: String(projectsList.length), sub: 'case studies', change: '' },
              { label: 'Avg API Response', value: '84ms', sub: '99.9% uptime', change: '' },
            ].map((m) => (
              <div key={m.label} className="bg-black border border-slate-900 rounded-2xl p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
                <span className="text-[12px] font-medium text-white/60">{m.label}</span>
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-[28px] font-serif font-bold text-white">{m.value}</span>
                  {m.change && <span className="text-[11px] font-semibold text-emerald-400">{m.change}</span>}
                </div>
                <span className="text-[11px] text-slate-500 mt-1">{m.sub}</span>
              </div>
            ))}
          </div>

          {/* Tab Nav */}
          <div className="flex gap-2 overflow-x-auto pb-1 border-b border-slate-900">
            <button className={tabClass('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={tabClass('products')} onClick={() => setActiveTab('products')}>Products Manager</button>
            <button className={tabClass('portfolio')} onClick={() => setActiveTab('portfolio')}>Portfolio Works</button>
            <button className={tabClass('submissions')} onClick={() => setActiveTab('submissions')}>Submissions</button>
            <button className={tabClass('console')} onClick={() => setActiveTab('console')}>System Console</button>
          </div>

          {/* ── Tab: Overview ── */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-black border border-slate-900 rounded-2xl p-6 space-y-4">
                <h2 className="text-[17px] font-semibold text-white">Recent Activity</h2>
                {submissions.slice(0, 4).map(sub => (
                  <div key={sub.id} className="flex items-start gap-3 p-3 rounded-xl bg-black border border-slate-900 hover:border-white/20 transition-all">
                    <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${sub.status === 'new' ? 'bg-[#cc6f2a]' : 'bg-slate-600'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${sub.type === 'career' ? 'bg-[#cc6f2a]/20 text-[#cc6f2a]' : 'bg-blue-500/20 text-blue-400'}`}>{sub.type}</span>
                        <span className="text-[14px] font-semibold text-white">{sub.name}</span>
                      </div>
                      <p className="text-[12px] text-slate-400 mt-0.5">{sub.detail}</p>
                      <span className="text-[11px] text-slate-600">{sub.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-4 bg-black border border-slate-900 rounded-2xl p-6 space-y-4">
                <h2 className="text-[17px] font-semibold text-white">System Status</h2>
                {[
                  { label: 'API Server', status: 'Operational', color: 'bg-emerald-500' },
                  { label: 'MySQL DB', status: 'Connected', color: 'bg-emerald-500' },
                  { label: 'SMTP Service', status: 'Active', color: 'bg-emerald-500' },
                  { label: 'Redis Cache', status: 'Healthy', color: 'bg-emerald-500' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-400">{s.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      <span className="text-[12px] text-emerald-400 font-medium">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: Products Manager ── */}
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Product List */}
              <div className="lg:col-span-7 bg-black border border-slate-900 rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                  <h2 className="text-[17px] font-semibold text-white">Products Catalog</h2>
                  <span className="text-[12px] text-slate-400">{productsList.length} products</span>
                </div>
                {productsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-[14px]">No products defined yet.</div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {productsList.map(prod => (
                      <div key={prod.id} className="p-4 rounded-xl bg-black border border-slate-900 hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/15">{prod.category}</span>
                              {prod.isFeatured && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25">Featured</span>}
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${prod.status === 'Live' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>{prod.status}</span>
                            </div>
                            <h4 className="text-[14px] font-semibold text-white truncate">{prod.name}</h4>
                            <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-1">{prod.tagline}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button
                              onClick={() => handleToggleFeatured(prod.id)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${prod.isFeatured ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/8 text-slate-400 border border-white/15 hover:border-white/30'}`}
                            >
                              {prod.isFeatured ? '★ Featured' : '☆ Feature'}
                            </button>
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/8 text-slate-400 border border-white/15 hover:border-white/30 hover:text-white transition-all cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-rose-950/20 text-rose-400 border border-rose-900/40 hover:bg-rose-950/40 transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add / Edit Product Form */}
              <div className="lg:col-span-5 bg-black border border-slate-900 rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                  <h2 className="text-[17px] font-semibold text-white">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
                  {editingProductId && (
                    <button onClick={resetProdForm} className="text-[12px] text-slate-500 hover:text-white cursor-pointer transition-colors">Cancel</button>
                  )}
                </div>
                <form onSubmit={handleSaveProduct} className="space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Product Name *</label>
                    <input type="text" placeholder="e.g. Galletrix ERP Suite" value={prodName} onChange={e => setProdName(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Tagline *</label>
                    <input type="text" placeholder="Short compelling tagline" value={prodTagline} onChange={e => setProdTagline(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Category</label>
                      <select value={prodCategory} onChange={e => setProdCategory(e.target.value as Product['category'])} className={inputClass}>
                        <option value="ERP & Finance">ERP & Finance</option>
                        <option value="Automation">Automation</option>
                        <option value="CRM & Sales">CRM & Sales</option>
                        <option value="HR & Workforce">HR & Workforce</option>
                        <option value="Analytics & BI">Analytics & BI</option>
                        <option value="Service Operations">Service Operations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Status</label>
                      <select value={prodStatus} onChange={e => setProdStatus(e.target.value as Product['status'])} className={inputClass}>
                        <option value="Live">Live</option>
                        <option value="Beta">Beta</option>
                        <option value="Enterprise">Enterprise</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Badge</label>
                      <input type="text" placeholder="e.g. Flagship ERP" value={prodBadge} onChange={e => setProdBadge(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Tier</label>
                      <input type="text" placeholder="e.g. Enterprise" value={prodTier} onChange={e => setProdTier(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Description *</label>
                    <textarea rows={3} placeholder="Full product description..." value={prodDescription} onChange={e => setProdDescription(e.target.value)} className={`${inputClass} resize-none`} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Features (one per line)</label>
                    <textarea rows={4} placeholder={"Real-time reporting\nRole-based access\nCustom modules"} value={prodFeatures} onChange={e => setProdFeatures(e.target.value)} className={`${inputClass} resize-none`} />
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <input type="checkbox" id="prodFeatured" checked={prodFeatured} onChange={e => setProdFeatured(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-black text-[#cc6f2a] cursor-pointer" />
                    <label htmlFor="prodFeatured" className="text-[13px] text-white cursor-pointer select-none">Feature on Products Page</label>
                  </div>
                  <button type="submit" className="w-full bg-[#cc6f2a] hover:bg-[#b86120] text-white py-3 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.01] cursor-pointer">
                    {editingProductId ? 'Update Product' : 'Add Product'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── Tab: Portfolio Works ── */}
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 bg-black border border-slate-900 rounded-2xl p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                  <h2 className="text-[17px] font-semibold text-white">Project Portfolio</h2>
                  <span className="text-[12px] text-slate-400">{projectsList.length} works</span>
                </div>
                {projectsList.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-[14px]">No project works defined.</div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {projectsList.map(proj => (
                      <div key={proj.id} className="p-4 rounded-xl bg-black border border-slate-900 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">{proj.tag}</span>
                            {proj.selectedWork && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">Featured</span>}
                          </div>
                          <h4 className="text-[14px] font-semibold text-white">{proj.title}</h4>
                          <p className="text-[12px] text-slate-500 line-clamp-2">{proj.description}</p>
                        </div>
                        <button onClick={() => handleDeleteProject(proj.id)} className="bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer self-start sm:self-center flex-shrink-0">Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 bg-black border border-slate-900 rounded-2xl p-6 space-y-5">
                <div className="border-b border-slate-900 pb-4">
                  <h2 className="text-[17px] font-semibold text-white">Add New Work</h2>
                </div>
                <form onSubmit={handleAddProject} className="space-y-4 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Project Tag *</label>
                    <input type="text" placeholder="e.g. ERP System" value={newTag} onChange={e => setNewTag(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Project Title *</label>
                    <input type="text" placeholder="e.g. Enterprise Resource Planning Platform" value={newTitle} onChange={e => setNewTitle(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Description *</label>
                    <textarea rows={3} placeholder="Short description..." value={newDescription} onChange={e => setNewDescription(e.target.value)} className={`${inputClass} resize-none`} required />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-white/60 uppercase tracking-wider mb-1.5">Metrics (Optional)</label>
                    <div className="space-y-2">
                      <input type="text" placeholder="Metric 1" value={newMetric1} onChange={e => setNewMetric1(e.target.value)} className={inputClass} />
                      <input type="text" placeholder="Metric 2" value={newMetric2} onChange={e => setNewMetric2(e.target.value)} className={inputClass} />
                      <input type="text" placeholder="Metric 3" value={newMetric3} onChange={e => setNewMetric3(e.target.value)} className={inputClass} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <input type="checkbox" id="selectedWork" checked={newSelectedWork} onChange={e => setNewSelectedWork(e.target.checked)} className="w-4 h-4 rounded border-white/20 bg-black text-[#cc6f2a] cursor-pointer" />
                    <label htmlFor="selectedWork" className="text-[13px] text-white cursor-pointer select-none">Feature on Landing Page</label>
                  </div>
                  <button type="submit" className="w-full bg-[#cc6f2a] hover:bg-[#b86120] text-white py-3 rounded-xl text-[14px] font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer">
                    Add Project
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── Tab: Submissions ── */}
          {activeTab === 'submissions' && (
            <div className="bg-black border border-slate-900 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
                <h2 className="text-[17px] font-semibold text-white">Inbox Submissions</h2>
                <div className="flex items-center gap-2">
                  {(['all', 'contact', 'career'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setSubmissionFilter(f)}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold capitalize cursor-pointer transition-all ${submissionFilter === f ? 'bg-[#cc6f2a] text-white' : 'bg-white/8 text-slate-400 hover:text-white border border-white/15'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-[14px]">No submissions found.</div>
              ) : (
                <div className="space-y-3">
                  {filteredSubmissions.map(sub => (
                    <div key={sub.id} className="p-4 rounded-xl bg-black border border-slate-900 hover:border-white/20 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${sub.type === 'career' ? 'bg-[#cc6f2a]/20 text-[#cc6f2a]' : 'bg-blue-500/20 text-blue-400'}`}>{sub.type}</span>
                          <span className="text-[14px] font-semibold text-white">{sub.name}</span>
                          {sub.status === 'new' && <span className="w-2 h-2 rounded-full bg-[#cc6f2a]" />}
                        </div>
                        <p className="text-[12px] text-slate-400 leading-relaxed">{sub.detail}</p>
                        <span className="text-[11px] text-slate-600">{sub.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {sub.status === 'new' && (
                          <button onClick={() => handleMarkReviewed(sub.id)} className="bg-slate-900 hover:bg-slate-800 border border-white/20 text-white px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer">Mark Reviewed</button>
                        )}
                        <button onClick={() => handleDeleteSubmission(sub.id)} className="bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Tab: Console ── */}
          {activeTab === 'console' && (
            <div className="bg-black border border-slate-900 rounded-2xl p-6 space-y-5">
              <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                <h2 className="text-[17px] font-semibold text-white">System Console</h2>
                <button onClick={() => setLogs([`[INFO] ${new Date().toLocaleTimeString()} - Console cleared`])} className="text-[12px] text-slate-500 hover:text-white transition-colors cursor-pointer">Clear</button>
              </div>
              <div className="bg-[#050608] border border-slate-900 rounded-xl p-5 font-mono text-[12px] text-white space-y-2 h-[420px] overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    <span className={log.includes('[ACTION]') ? 'text-[#cc6f2a]' : log.includes('[SECURITY]') ? 'text-rose-400' : 'text-slate-400'}>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  // ── Login Screen ─────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-[calc(100vh-6rem)] mt-24 flex items-center justify-center py-12 px-6 bg-black">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-[#cc6f2a]/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8 space-y-2">
          <span className="text-[12px] font-semibold tracking-[0.2em] text-[#cc6f2a] uppercase font-sans">
            Secure Terminal Access
          </span>
          <h1 className="scroll-reveal-target font-serif text-[32px] sm:text-[36px] font-bold text-white tracking-tight leading-tight">
            {stage === 'login' ? 'Administrator Login' : stage === 'forgot-email' || stage === 'forgot-otp' ? 'Recovery Verification' : 'Reset Password'}
          </h1>
          <p className="scroll-reveal-target text-[14px] text-white/60 leading-normal max-w-xs mx-auto">
            {stage === 'login' ? 'Authorized personnel only. Sessions are encrypted and monitored.' : 'Verify authorization credentials to proceed with password recovery.'}
          </p>
        </div>

        <div className="backdrop-blur-xl bg-black border border-slate-900/90 shadow-2xl rounded-2xl p-6 sm:p-8">
          {stage === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-white font-sans tracking-wide">Email Address</label>
                <input id="admin-email-input" type="email" placeholder="admin@galletrix.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all" required disabled={isSubmitting} />
              </div>
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-white font-sans tracking-wide">Secure Password</label>
                <input id="admin-password-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all" required disabled={isSubmitting} />
                <div className="flex justify-end pt-1">
                  <button type="button" onClick={() => { setStage('forgot-email'); setErrorText(''); setSuccessText('') }} className="text-[12px] font-semibold text-[#cc6f2a] hover:text-[#b86120] hover:underline cursor-pointer focus:outline-none transition-colors">
                    Forgot Password?
                  </button>
                </div>
              </div>
              {errorText && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-[13px] text-center font-medium animate-fade-in">{errorText}</div>}
              {successText && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-[13px] text-center font-medium animate-fade-in">{successText}</div>}
              <button id="admin-login-btn" type="submit" disabled={isSubmitting} className="w-full bg-[#cc6f2a] hover:bg-[#b86120] text-white py-4 rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <><svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg><span>Authenticating...</span></>
                ) : (
                  <><span>Sign In</span><svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h16.5a1.5 1.5 0 001.5-1.5V12a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 12v8.25a1.5 1.5 0 001.5 1.5z" /></svg></>
                )}
              </button>
            </form>
          )}

          {stage === 'forgot-email' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="block text-[13px] font-semibold text-white font-sans tracking-wide">Recovery Email Address</label>
                <p className="text-[12px] text-white/50">OTP recovery emails will be sent to the administrator recovery address.</p>
                <input type="email" placeholder="admin@galletrix.com" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all" required disabled={isSubmitting} />
              </div>
              {errorText && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-[13px] text-center font-medium">{errorText}</div>}
              <div className="flex flex-col gap-3">
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#cc6f2a] hover:bg-[#b86120] text-white py-4 rounded-xl text-[15px] font-semibold transition-all cursor-pointer">{isSubmitting ? 'Sending OTP...' : 'Send OTP'}</button>
                <button type="button" onClick={() => { setStage('login'); setErrorText('') }} className="w-full bg-slate-900 hover:bg-slate-800 border border-white/20 text-white py-3.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer">Back to Login</button>
              </div>
            </form>
          )}

          {stage === 'forgot-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="block text-[13px] font-semibold text-white font-sans tracking-wide">Enter Verification OTP</label>
                <p className="text-[12px] text-white/50">Please enter the 6-digit recovery code sent to your authorized email address.</p>
                <input type="text" placeholder="••••••" value={otpInput} onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))} maxLength={6} className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-[18px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all text-center tracking-[0.3em] font-mono" required disabled={isSubmitting} />
              </div>
              {errorText && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-[13px] text-center font-medium">{errorText}</div>}
              <div className="flex flex-col gap-3">
                <button type="submit" className="w-full bg-[#cc6f2a] hover:bg-[#b86120] text-white py-4 rounded-xl text-[15px] font-semibold transition-all cursor-pointer">Verify Code</button>
                <button type="button" onClick={() => { setStage('forgot-email'); setErrorText('') }} className="w-full bg-slate-900 hover:bg-slate-800 border border-white/20 text-white py-3.5 rounded-xl text-[14px] font-semibold transition-colors cursor-pointer">Change Email</button>
              </div>
            </form>
          )}

          {stage === 'forgot-reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-white font-sans tracking-wide">New Secure Password</label>
                  <input type="password" placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all" required disabled={isSubmitting} />
                </div>
                <div className="space-y-2">
                  <label className="block text-[13px] font-semibold text-white font-sans tracking-wide">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full bg-black border border-white/20 rounded-xl px-5 py-4 text-[15px] text-white placeholder-slate-600 focus:outline-none focus:border-[#cc6f2a] focus:ring-1 focus:ring-[#cc6f2a] transition-all" required disabled={isSubmitting} />
                </div>
              </div>
              {errorText && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-[13px] text-center font-medium">{errorText}</div>}
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#cc6f2a] hover:bg-[#b86120] text-white py-4 rounded-xl text-[15px] font-semibold transition-all cursor-pointer">
                {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
