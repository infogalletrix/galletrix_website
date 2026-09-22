export interface ProductHighlight {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: 'ERP & Finance' | 'Automation' | 'CRM & Sales' | 'HR & Workforce' | 'Analytics & BI' | 'Service Operations';
  badge: string;
  description: string;
  features: string[];
  highlights: ProductHighlight[];
  status: 'Live' | 'Beta' | 'Enterprise';
  tier: string;
  isFeatured: boolean;
  icon: string; // SVG path string identifier
}

export const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Galletrix ERP Suite',
    tagline: 'The unified command center for your entire enterprise',
    category: 'ERP & Finance',
    badge: 'Flagship ERP',
    description: 'A comprehensive, modular enterprise resource planning platform that unifies procurement, finance, HR, inventory, production scheduling, and reporting into a single intelligent command center. Built for scale, designed for clarity.',
    features: [
      'Unified procurement & supplier management',
      'Real-time financial reporting & ledger',
      'Multi-department workflow orchestration',
      'Role-based access & audit trail',
      'Custom module builder',
      'Automated compliance reporting',
      'Production & inventory sync',
      'Executive dashboard & KPI alerts',
    ],
    highlights: [
      { label: 'Active Deployments', value: '120+' },
      { label: 'Avg. Data Entry Reduction', value: '82%' },
      { label: 'Modules Available', value: '18' },
      { label: 'Avg. Implementation', value: '6 weeks' },
    ],
    status: 'Live',
    tier: 'Enterprise',
    isFeatured: true,
    icon: 'erp',
  },
  {
    id: '2',
    name: 'Galletrix Flow',
    tagline: 'Intelligent automation for every business workflow',
    category: 'Automation',
    badge: 'AI-Powered',
    description: 'A no-code / low-code workflow automation platform that eliminates manual processes and orchestrates complex multi-step business operations. From document routing and approvals to scheduled data pipelines and alert systems.',
    features: [
      'Visual drag-and-drop workflow builder',
      'Multi-trigger rule engine',
      'Cross-system integration connectors',
      'Smart document routing & e-signatures',
      'Scheduled task orchestration',
      'Real-time monitoring & failure alerts',
      'Audit logs & version control',
      'API webhook & REST integrations',
    ],
    highlights: [
      { label: 'Workflows Automated', value: '10,000+' },
      { label: 'Processing Time Reduction', value: '74%' },
      { label: 'Pre-built Templates', value: '200+' },
      { label: 'Integration Connectors', value: '50+' },
    ],
    status: 'Live',
    tier: 'Professional',
    isFeatured: true,
    icon: 'automation',
  },
  {
    id: '3',
    name: 'Galletrix CRM',
    tagline: 'Close more deals with a pipeline that thinks ahead',
    category: 'CRM & Sales',
    badge: 'Sales Accelerator',
    description: 'A relationship-first CRM platform purpose-built for B2B enterprises. Manage leads, track deal stages, automate follow-ups, and get intelligent win-probability scoring to focus your team on the opportunities that matter most.',
    features: [
      'Visual sales pipeline management',
      'AI-driven lead scoring & prioritization',
      'Automated email follow-up sequences',
      'Activity timeline & communication log',
      'Quotation & proposal builder',
      'Revenue forecasting dashboard',
      'Team collaboration & task assignment',
      'Customer segmentation & tagging',
    ],
    highlights: [
      { label: 'Avg. Deal Cycle Reduction', value: '38%' },
      { label: 'Lead Conversion Uplift', value: '45%' },
      { label: 'Companies Managed', value: '5,000+' },
      { label: 'Data Points Tracked', value: '60+/lead' },
    ],
    status: 'Live',
    tier: 'Business',
    isFeatured: false,
    icon: 'crm',
  },
  {
    id: '4',
    name: 'Galletrix Workforce',
    tagline: 'Complete HR lifecycle from hire to retire',
    category: 'HR & Workforce',
    badge: 'HR Suite',
    description: 'An end-to-end human resource management system covering recruitment pipelines, onboarding, attendance, payroll, performance reviews, leave management, and offboarding — all in one integrated platform.',
    features: [
      'Applicant tracking & job pipeline',
      'Digital onboarding & document collection',
      'Biometric-ready attendance system',
      'Automated payroll & tax computation',
      'Performance review cycles',
      'Leave & shift management',
      'Employee self-service portal',
      'HR analytics & headcount reports',
    ],
    highlights: [
      { label: 'Employees Managed', value: '25,000+' },
      { label: 'Onboarding Time Reduction', value: '82%' },
      { label: 'Payroll Accuracy', value: '99.9%' },
      { label: 'Compliance Frameworks', value: '12+' },
    ],
    status: 'Live',
    tier: 'Enterprise',
    isFeatured: false,
    icon: 'hr',
  },
  {
    id: '5',
    name: 'Galletrix Insight',
    tagline: 'Turn your data into your most powerful business asset',
    category: 'Analytics & BI',
    badge: 'Business Intelligence',
    description: 'A real-time analytics and business intelligence platform that aggregates data from multiple sources, renders live dashboards, and generates responsive executive reports — enabling data-driven decisions at every level.',
    features: [
      'Multi-source data aggregation',
      'Custom real-time dashboard builder',
      'Predictive analytics & trend modeling',
      'Scheduled auto-generated reports',
      'Department-level KPI tracking',
      'Geographic heatmaps & drill-downs',
      'Export to PDF / Excel / PowerBI',
      'Role-based report access',
    ],
    highlights: [
      { label: 'Data Sources Supported', value: '40+' },
      { label: 'Avg. Report Build Time', value: '< 2 min' },
      { label: 'Dashboard Widgets', value: '80+' },
      { label: 'Decision Cycle Reduction', value: '55%' },
    ],
    status: 'Live',
    tier: 'Enterprise',
    isFeatured: false,
    icon: 'analytics',
  },
  {
    id: '6',
    name: 'Galletrix ServiceOps',
    tagline: 'Field service and support desk, fully unified',
    category: 'Service Operations',
    badge: 'Field-Ready',
    description: 'An integrated service operations platform combining help desk ticketing, field technician dispatch, SLA tracking, preventive maintenance scheduling, and customer satisfaction management into one seamless system.',
    features: [
      'Omnichannel ticket intake (email, web, WhatsApp)',
      'Automated SLA escalation engine',
      'Field technician dispatch & live GPS tracking',
      'Preventive maintenance scheduler',
      'Spare parts & inventory integration',
      'Customer satisfaction (CSAT) surveys',
      'Service contract & warranty tracking',
      'Executive service dashboard',
    ],
    highlights: [
      { label: 'First-Response Time Reduction', value: '68%' },
      { label: 'SLA Compliance Rate', value: '97%+' },
      { label: 'Field Technicians Managed', value: '3,500+' },
      { label: 'Tickets Processed/month', value: '50,000+' },
    ],
    status: 'Enterprise',
    tier: 'Enterprise',
    isFeatured: false,
    icon: 'service',
  },
]

const LOCAL_STORAGE_KEY = 'galletrix_products'

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return defaultProducts
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProducts))
      return defaultProducts
    }
    return JSON.parse(data)
  } catch {
    return defaultProducts
  }
}

export const saveProducts = (products: Product[]): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products))
  } catch {
    console.error('Failed to save products to localStorage')
  }
}

export const addProduct = (product: Product): Product[] => {
  const current = getProducts()
  const updated = [...current, product]
  saveProducts(updated)
  return updated
}

export const updateProduct = (id: string, updates: Partial<Product>): Product[] => {
  const current = getProducts()
  const updated = current.map(p => p.id === id ? { ...p, ...updates } : p)
  saveProducts(updated)
  return updated
}

export const deleteProduct = (id: string): Product[] => {
  const current = getProducts()
  const updated = current.filter(p => p.id !== id)
  saveProducts(updated)
  return updated
}
