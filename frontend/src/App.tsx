import { useState, useEffect, lazy, Suspense } from 'react'
import type { ViewState } from './types'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const About = lazy(() => import('./pages/About'))
const Works = lazy(() => import('./pages/Works'))
const Industry = lazy(() => import('./pages/Industry'))
const Contact = lazy(() => import('./pages/Contact'))
const Services = lazy(() => import('./pages/Services'))
const Erp = lazy(() => import('./pages/Erp'))
const Automation = lazy(() => import('./pages/Automation'))
const Web = lazy(() => import('./pages/Web'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Marketing = lazy(() => import('./pages/Marketing'))
const UIUX = lazy(() => import('./pages/UIUX'))
const Careers = lazy(() => import('./pages/Careers'))
const Other = lazy(() => import('./pages/Other'))
const ManpowerHR = lazy(() => import('./pages/ManpowerHR'))
const HRRecruitment = lazy(() => import('./pages/HRRecruitment'))
const LogisticsSupplyChain = lazy(() => import('./pages/LogisticsSupplyChain'))
const Healthcare = lazy(() => import('./pages/Healthcare'))
const Education = lazy(() => import('./pages/Education'))
const Retail = lazy(() => import('./pages/Retail'))
const Finance = lazy(() => import('./pages/Finance'))
const CorporateOperations = lazy(() => import('./pages/CorporateOperations'))
const CareersApply = lazy(() => import('./pages/CareersApply'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))

function App() {
  const [view, setView] = useState<ViewState>('other')
  const [contactScrollTarget, setContactScrollTarget] = useState<1 | 2 | 3 | null>(null)

  const navigateToContact = (page: 1 | 2 | 3) => {
    (window as any).__contactPageOverride = page
    setView('contact')
    setContactScrollTarget(page)
    window.location.hash = `#contact-page-${page}`
  }

  const scrollToContactPage = (page: 1 | 2 | 3) => {
    const tryScroll = (retries = 10) => {
      const element = document.getElementById(`contact-page-${page}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        if (page === 2) {
          setTimeout(() => {
            const input = document.getElementById('contact-form-name-input')
            if (input) input.focus()
          }, 500)
        }
      } else if (retries > 0) {
        setTimeout(() => tryScroll(retries - 1), 50)
      }
    }
    tryScroll()
  }

  useEffect(() => {
    const handleLocationChange = (isInitial = false) => {
      const hash = window.location.hash
      const path = window.location.pathname

      if (path === '/gallet' || path === '/gallet/') {
        if (!isInitial && hash && hash !== '#gallet' && hash !== '#/gallet') {
          window.history.pushState(null, '', '/' + hash)
        } else if (hash === '#gallet' || hash === '#/gallet' || !hash) {
          setView('admin')
          return
        }
      }

      if (hash.startsWith('#gallet') || hash.startsWith('#/gallet')) {
        setView('admin')
      } else if (hash.startsWith('#industry')) {
        setView('industry')
      } else if (hash.startsWith('#services')) {
        setView('services')
      } else if (hash.startsWith('#erp')) {
        setView('erp')
      } else if (hash.startsWith('#works')) {
        setView('works')
      } else if (hash.startsWith('#contact')) {
        setView('contact')
        const override = (window as any).__contactPageOverride
        if (override === 1 || override === 2 || override === 3) {
          setContactScrollTarget(override)
          delete (window as any).__contactPageOverride
        } else {
          const match = hash.match(/#contact-page-(\d+)/)
          if (match) {
            setContactScrollTarget(parseInt(match[1]) as 1 | 2 | 3)
          } else {
            setContactScrollTarget(1)
          }
        }
      } else if (hash.startsWith('#about')) {
        setView('about')
      } else if (hash.startsWith('#careers-apply')) {
        setView('careers-apply')
      } else if (hash.startsWith('#careers')) {
        setView('careers')
      } else if (hash.startsWith('#manpower-hr')) {
        setView('manpower-hr')
      } else if (hash.startsWith('#hr-recruitment')) {
        setView('hr-recruitment')
      } else if (hash.startsWith('#logistics-supply-chain')) {
        setView('logistics-supply-chain')
      } else if (hash.startsWith('#healthcare')) {
        setView('healthcare')
      } else if (hash.startsWith('#education')) {
        setView('education')
      } else if (hash.startsWith('#retail')) {
        setView('retail')
      } else if (hash.startsWith('#finance')) {
        setView('finance')
      } else if (hash.startsWith('#corporate-operations')) {
        setView('corporate-operations')
      } else if (hash.startsWith('#automation')) {
        setView('automation')
      } else if (hash.startsWith('#web')) {
        setView('web')
      } else if (hash.startsWith('#dashboard')) {
        setView('dashboard')
      } else if (hash.startsWith('#marketing')) {
        setView('marketing')
      } else if (hash.startsWith('#uiux')) {
        setView('uiux')
      } else if (hash === '' || hash === '#' || hash === '#other') {
        setView('other')
      } else {
        setView('other')
      }
    }

    handleLocationChange(true)

    const onLocationChange = () => handleLocationChange(false)
    window.addEventListener('hashchange', onLocationChange)
    window.addEventListener('popstate', onLocationChange)
    return () => {
      window.removeEventListener('hashchange', onLocationChange)
      window.removeEventListener('popstate', onLocationChange)
    }
  }, [])

  useEffect(() => {
    if (view === 'contact' && contactScrollTarget !== null) {
      const timer = setTimeout(() => {
        scrollToContactPage(contactScrollTarget)
        setContactScrollTarget(null)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [view, contactScrollTarget])

  useEffect(() => {
    if (view !== 'contact') {
      window.scrollTo(0, 0)
      // Force scroll to top to override native browser hash navigation
      const timers = [10, 50, 100].map(t => setTimeout(() => window.scrollTo(0, 0), t))
      return () => timers.forEach(clearTimeout)
    }
  }, [view])

  // Global Animation Engine
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-revealed')
        }
      })
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' })

    const observeElements = () => {
      const targets = document.querySelectorAll('.scroll-reveal-target:not(.scroll-revealed)')
      targets.forEach(t => observer.observe(t))
    }

    observeElements()
    const mutationObserver = new MutationObserver(() => observeElements())
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-100 font-sans flex flex-col justify-between overflow-clip">
      <Navbar view={view} setView={setView} navigateToContact={navigateToContact} />

      <main className="w-full flex flex-col items-center min-h-[50vh]">
        <Suspense fallback={<div className="w-full h-[50vh] flex items-center justify-center bg-[#07080a] text-white/50 text-[15px]">Loading content...</div>}>
          {view === 'about' && <About navigateToContact={navigateToContact} />}
          {view === 'works' && <Works navigateToContact={navigateToContact} />}
          {view === 'industry' && <Industry navigateToContact={navigateToContact} />}
          {view === 'manpower-hr' && <ManpowerHR navigateToContact={navigateToContact} />}
          {view === 'hr-recruitment' && <HRRecruitment navigateToContact={navigateToContact} />}
          {view === 'logistics-supply-chain' && <LogisticsSupplyChain navigateToContact={navigateToContact} />}
          {view === 'healthcare' && <Healthcare navigateToContact={navigateToContact} />}
          {view === 'education' && <Education navigateToContact={navigateToContact} />}
          {view === 'retail' && <Retail navigateToContact={navigateToContact} />}
          {view === 'finance' && <Finance navigateToContact={navigateToContact} />}
          {view === 'corporate-operations' && <CorporateOperations navigateToContact={navigateToContact} />}
          {view === 'contact' && <Contact navigateToContact={navigateToContact} />}
          {view === 'services' && <Services view={view} setView={setView} navigateToContact={navigateToContact} />}
          {view === 'erp' && <Erp navigateToContact={navigateToContact} />}
          {view === 'automation' && <Automation navigateToContact={navigateToContact} />}
          {view === 'web' && <Web navigateToContact={navigateToContact} />}
          {view === 'dashboard' && <Dashboard navigateToContact={navigateToContact} />}
          {view === 'marketing' && <Marketing navigateToContact={navigateToContact} />}
          {view === 'uiux' && <UIUX navigateToContact={navigateToContact} />}
          {view === 'careers' && <Careers navigateToContact={navigateToContact} />}
          {view === 'careers-apply' && <CareersApply navigateToContact={navigateToContact} />}
          {view === 'other' && <Other setView={setView} navigateToContact={navigateToContact} />}
          {view === 'admin' && <AdminLogin navigateToContact={navigateToContact} />}
        </Suspense>
      </main>

      {view !== 'admin' && <Footer setView={setView} navigateToContact={navigateToContact} />}
    </div>
  )
}

export default App
