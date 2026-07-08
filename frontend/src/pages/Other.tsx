import React, { useState, useEffect, useRef } from 'react'
import type { ViewState } from '../types'
import { getProjects } from '../utils/projectData'
import type { Project } from '../utils/projectData'
import vMp4 from '../assets/v.mp4'
import g1Img from '../assets/g1.png'
import g2Img from '../assets/g2.png'
import g3Img from '../assets/g3.png'
import maVid from '../assets/ma.mp4'
import g0Img from '../assets/g0.png'
import l3Img from '../assets/l3.png'

interface OtherProps {
  setView: (view: ViewState) => void;
  navigateToContact: (page: 1 | 2 | 3) => void;
}

const subheadings = [
  <React.Fragment key="2"><span className="text-[#cc6f2a] transition-colors duration-700">UI/UX</span> Design</React.Fragment>,
  <React.Fragment key="3"><span className="text-[#cc6f2a] transition-colors duration-700">Web Application</span> Development</React.Fragment>,
  <React.Fragment key="4"><span className="text-[#cc6f2a] transition-colors duration-700">Mobile App</span> Development</React.Fragment>,
  <React.Fragment key="5"><span className="text-[#cc6f2a] transition-colors duration-700">ERP & CRM</span> Solutions</React.Fragment>,
  <React.Fragment key="6"><span className="text-[#cc6f2a] transition-colors duration-700">Digital</span> Marketing</React.Fragment>
]

const testimonialsData = [
  {
    quote: "Galletrix’s Billing Solutions completely transformed our revenue cycle. We’ve seen a 30% reduction in late payments thanks to their automation.",
    initials: "SJ",
    name: "Ganesh",
    company: "Novel Interiors",
    color: "bg-[#7a1a1c]"
  },
  {
    quote: "The custom ERP system they built for us streamlined our entire supply chain. Our team's productivity has skyrocketed.",
    initials: "MR",
    name: "Meera Reddy",
    company: "Logix Solutions",
    color: "bg-black border border-white/20"
  },
  {
    quote: "Outstanding web application development. The user experience is flawless, and it has significantly boosted our customer engagement.",
    initials: "AK",
    name: "Arjun Kumar",
    company: "RetailTech Inc.",
    color: "bg-[#cc6f2a]"
  }
];

const Other: React.FC<OtherProps> = ({ setView, navigateToContact }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [textIndex, setTextIndex] = useState(0)
  const [fade, setFade] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  // Scroll-linked sticky refs
  const trackRef = useRef<HTMLDivElement>(null)
  const stickyContainerRef = useRef<HTMLDivElement>(null)
  const img1Ref = useRef<HTMLImageElement>(null)
  const img2Ref = useRef<HTMLImageElement>(null)
  const vid3Ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (!trackRef.current || !stickyContainerRef.current) return;
      
      const trackRect = trackRef.current.getBoundingClientRect();
      const stickyHeight = stickyContainerRef.current.offsetHeight;
      const windowH = window.innerHeight;
      
      // Pin when the card is perfectly centered in the viewport
      let pinOffset = (windowH - stickyHeight) / 2;
      // Ensure it never pins higher than the navbar (approx 100px) so the top is always visible
      pinOffset = Math.max(100, pinOffset);
      
      let progress = 0;
      
      if (trackRect.top <= pinOffset) {
        const maxTranslate = trackRect.height - stickyHeight;
        const scrollDistance = pinOffset - trackRect.top;
        
        const translate = Math.max(0, Math.min(maxTranslate, scrollDistance));
        // Use translate3d to force GPU acceleration
        stickyContainerRef.current.style.transform = `translate3d(0, ${translate}px, 0)`;
        
        progress = maxTranslate > 0 ? translate / maxTranslate : 0;
      } else {
        stickyContainerRef.current.style.transform = `translate3d(0, 0px, 0)`;
      }
      
      // Add dead zones so the user can see the pinned card before the animation starts
      if (img2Ref.current) {
        // img2 slides up between 10% and 50% of the scroll track
        const p2 = Math.min(1, Math.max(0, (progress - 0.10) / 0.40));
        img2Ref.current.style.transform = `translate3d(0, ${(1 - p2) * 100}%, 0)`;
        img2Ref.current.style.opacity = p2 > 0 ? "1" : "0";
      }
      
      if (vid3Ref.current) {
        // vid3 slides up between 55% and 95% of the scroll track
        const p3 = Math.min(1, Math.max(0, (progress - 0.55) / 0.40));
        vid3Ref.current.style.transform = `translate3d(0, ${(1 - p3) * 100}%, 0)`;
        vid3Ref.current.style.opacity = p3 > 0 ? "1" : "0";
      }
      
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateScroll() // initial check
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const allProjects = getProjects()
    let featured = allProjects.filter(p => p.selectedWork)
    if (featured.length === 0) {
      featured = allProjects.slice(0, 3)
    }
    setProjects(featured.slice(0, 6))
  }, [])

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % subheadings.length)
        setFade(true)
      }, 500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Page 1: Hero Section (v.mp4) */}
      <section id="other-page" className="w-full h-screen relative bg-black flex items-center justify-center overflow-hidden animate-fade-in">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video 
            src={vMp4} 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        {/* Overlay Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-16 w-full max-w-6xl mx-auto">
          {/* Core Heading */}
          <div className="w-full mb-4">
            <h1 className={`text-[36px] sm:text-[48px] md:text-[64px] lg:text-[80px] font-['Space_Grotesk'] font-bold text-white tracking-tighter leading-[1.1] transition-all duration-1000 ease-out delay-100 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              We build systems that <br className="hidden sm:block" />
              <span className="text-[#cc6f2a]">move business forward</span>
            </h1>
          </div>

          {/* Animated Subheading Text */}
          <div className="h-16 md:h-20 flex items-center justify-center w-full mt-2">
            <h2 className={`text-[24px] sm:text-[32px] md:text-[40px] font-sans font-medium text-white/80 transition-all duration-700 ease-in-out ${
              fade ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'
            }`}>
              {subheadings[textIndex]}
            </h2>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-32 md:mt-40 w-full transition-opacity duration-1000 ease-in delay-300 opacity-100">
            <a 
              href="#services"
              onClick={(e) => {
                e.preventDefault()
                setView('services')
              }}
              className="bg-[#cc6f2a] hover:bg-[#b86120] text-white px-8 py-4 rounded-full text-[15px] md:text-[16px] font-semibold transition-all duration-300 shadow-lg hover:scale-105 min-w-[200px]"
            >
              Explore Services
            </a>
            <a 
              href="#contact-page-2"
              onClick={(e) => {
                e.preventDefault()
                navigateToContact(2)
              }}
              className="bg-transparent border border-white/40 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-full text-[15px] md:text-[16px] font-semibold transition-all duration-300 shadow-lg hover:scale-105 min-w-[200px]"
            >
              Book Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Page 2: Who We Are Section */}
      <section id="other-page-2" className="w-full bg-black py-16 md:py-32 lg:py-40 border-t border-slate-900/60 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start animate-fade-in">
          {/* Heading */}
          <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-medium leading-[1.12] text-white tracking-tight mb-6">
            WHO WE ARE
          </h2>

          {/* Progress Status Bar */}
          <div className="w-full max-w-7xl h-[3px] bg-slate-800 mb-12 flex rounded-full overflow-hidden">
            <div className="w-[45%] h-full bg-[#cc6f2a]" />
          </div>

          {/* Description Paragraph */}
          <p className="scroll-reveal-target font-sans text-[16px] sm:text-[18px] md:text-[20px] leading-[1.7] text-white max-w-6xl mb-20">
            Galletrix is built with a vision to transform business operations through intelligent digital solutions. We help companies automate workflows, improve productivity, and grow with reliable ERP, CRM, web, mobile, and automation systems.
          </p>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center w-full">
            {/* Left Side: Why Choose Us & Pills */}
            <div className="lg:col-span-6 flex flex-col items-start w-full">
              <h3 className="scroll-reveal-target font-sans text-[22px] md:text-[26px] font-semibold text-white tracking-tight mb-8">
                Why Choose Us ?
              </h3>

              <div className="w-full space-y-4 max-w-md">
                {[
                  "Scalable ERP & CRM Systems",
                  "Clean Web & App Experiences",
                  "Reliable Digital Support"
                ].map((text, idx) => (
                  <div 
                    key={idx} 
                    className="border border-slate-700/60 bg-black/40 px-6 py-4.5 rounded-xl text-[16px] font-medium text-white transition-all duration-300 hover:border-[#cc6f2a]/60 hover:text-white"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Image g1.png */}
            <div className="lg:col-span-6 flex justify-center w-full">
              <img loading="lazy" 
                src={g1Img} 
                alt="Why Choose Galletrix - Innovation in Hand" 
                className="w-full max-w-lg h-auto object-cover rounded-[28px] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Page 3: Real Business Problems Section */}
      <section id="other-page-3" className="w-full bg-black border-t border-slate-900/60 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-16 md:pt-32 pb-12">
          {/* Heading - scrolls normally */}
          <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[60px] font-medium leading-[1.12] text-white tracking-tight shrink-0">
            Built to solve real business problems
          </h2>
        </div>

        {/* Scroll Track for Sticky Mockup Container */}
        <div ref={trackRef} className="w-full h-[120vh] md:h-[250vh] relative px-6 md:px-12 pb-16 md:pb-24">
          {/* The Pinned Container - controlled height to prevent taking up the whole screen */}
          <div 
            ref={stickyContainerRef} 
            className="w-full max-w-6xl mx-auto relative aspect-video md:aspect-auto md:h-[85vh] max-h-[850px] rounded-[24px] md:rounded-[32px] overflow-hidden border border-white/20 shadow-2xl bg-black will-change-transform"
          >
            {/* Image 1 */}
            <img loading="lazy" 
              ref={img1Ref}
              src={l3Img} 
              alt="Built to solve real business problems" 
              className="absolute inset-0 w-full h-full object-contain md:object-cover object-center z-10"
            />
            
            {/* Image 2 (Overlays Image 1) */}
            <img loading="lazy" 
              ref={img2Ref}
              src={g3Img} 
              alt="Workflow Solution" 
              className="absolute inset-0 w-full h-full object-contain md:object-cover object-center z-20 will-change-transform"
              style={{ transform: 'translate3d(0, 100%, 0)', opacity: 0 }}
            />

            {/* Video 3 (Overlays Image 2) */}
            <video 
              ref={vid3Ref}
              src={maVid} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-contain md:object-cover object-center z-30 will-change-transform"
              style={{ transform: 'translate3d(0, 100%, 0)', opacity: 0 }}
            />
          </div>
        </div>
      </section>

      {/* Page 6: Enterprise Solutions Card Grid Section */}
      <section id="other-page-6" className="w-full relative bg-black py-16 md:py-32 border-t border-slate-900/60 min-h-screen flex items-center overflow-hidden">
        {/* Blurred background solutions image overlay */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none select-none">
          <img loading="lazy" 
            src={g2Img} 
            alt="" 
            className="w-full h-full object-cover filter blur-[4px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start animate-fade-in">
          {/* Subtitle */}
          <span className="font-sans text-[15px] font-medium tracking-wide text-white/50 mb-5">
            What We Do
          </span>
          
          {/* Heading */}
          <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-medium leading-[1.12] text-white tracking-tight mb-20">
            Enterprise Solutions, Engineered
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {/* Card 1: ERP Solutions */}
            <a 
              href="#erp"
              onClick={() => setView('erp')}
              className="border border-white/20 bg-black/20 p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-black/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 text-left cursor-pointer group/card"
            >
              <div className="text-white mb-6 transition-transform group-hover/card:scale-105 duration-300">
                <svg className="w-6 h-6 text-white group-hover/card:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
                </svg>
              </div>
              <h3 className="scroll-reveal-target font-sans text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-4 transition-colors group-hover/card:text-white">
                ERP Solutions
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white group-hover/card:text-white transition-colors duration-200">
                Unified enterprise resource planning systems that integrate every facet of your operations into a single, intelligent platform.
              </p>
            </a>

            {/* Card 2: Business Automation */}
            <a 
              href="#automation"
              onClick={() => setView('automation')}
              className="border border-white/20 bg-black/20 p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-black/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 text-left cursor-pointer group/card"
            >
              <div className="text-white mb-6 transition-transform group-hover/card:scale-105 duration-300">
                <svg className="w-6 h-6 text-white group-hover/card:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v4M12 10H5v4M12 10h7v4M12 10v4M10 2h4v4h-4zM3 14h4v4H3zM10 14h4v4h-4zM17 14h4v4h-4z" />
                </svg>
              </div>
              <h3 className="scroll-reveal-target font-sans text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-4 transition-colors group-hover/card:text-white">
                Business Automation
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white group-hover/card:text-white transition-colors duration-200">
                Eliminate manual processes with intelligent automation that adapts to your workflows and scales with your growth.
              </p>
            </a>

            {/* Card 3: Web Application Development */}
            <a 
              href="#web"
              onClick={() => setView('web')}
              className="border border-white/20 bg-black/20 p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-black/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 text-left cursor-pointer group/card"
            >
              <div className="text-white mb-6 transition-transform group-hover/card:scale-105 duration-300">
                <svg className="w-6 h-6 text-white group-hover/card:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <h3 className="scroll-reveal-target font-sans text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-4 transition-colors group-hover/card:text-white">
                Web Application Development
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white group-hover/card:text-white transition-colors duration-200">
                Custom-built, high-performance web applications designed for scalability, security, and exceptional user experience.
              </p>
            </a>

            {/* Card 4: Dashboard & Analytics */}
            <a 
              href="#dashboard"
              onClick={() => setView('dashboard')}
              className="border border-white/20 bg-black/20 p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-black/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 text-left cursor-pointer group/card"
            >
              <div className="text-white mb-6 transition-transform group-hover/card:scale-105 duration-300">
                <svg className="w-6 h-6 text-white group-hover/card:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
              </div>
              <h3 className="scroll-reveal-target font-sans text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-4 transition-colors group-hover/card:text-white">
                Dashboard & Analytics
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white group-hover/card:text-white transition-colors duration-200">
                Real-time data visualization and business intelligence tools that transform raw data into actionable insights.
              </p>
            </a>

            {/* Card 5: Digital Marketing */}
            <a 
              href="#marketing"
              onClick={() => setView('marketing')}
              className="border border-white/20 bg-black/20 p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-black/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 text-left cursor-pointer group/card"
            >
              <div className="text-white mb-6 transition-transform group-hover/card:scale-105 duration-300">
                <svg className="w-6 h-6 text-white group-hover/card:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-9 4 18 3-12h5" />
                </svg>
              </div>
              <h3 className="scroll-reveal-target font-sans text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-4 transition-colors group-hover/card:text-white">
                Digital Marketing
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white group-hover/card:text-white transition-colors duration-200">
                Streamline complex business processes with visual workflow builders and automated task orchestration.
              </p>
            </a>

            {/* Card 6: UIUX Design */}
            <a 
              href="#uiux"
              onClick={() => setView('uiux')}
              className="border border-white/20 bg-black/20 p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-black/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 text-left cursor-pointer group/card"
            >
              <div className="text-white mb-6 transition-transform group-hover/card:scale-105 duration-300">
                <svg className="w-6 h-6 text-white group-hover/card:text-white transition-colors duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
                </svg>
              </div>
              <h3 className="scroll-reveal-target font-sans text-[20px] md:text-[22px] font-semibold text-white tracking-tight mb-4 transition-colors group-hover/card:text-white">
                UIUX Design
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white group-hover/card:text-white transition-colors duration-200">
                End-to-end digital transformation strategies that modernize legacy systems and unlock new business potential.
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Page 7: Snapshots & Partner Section */}
      <section id="other-page-7" className="w-full bg-black py-16 md:py-32 lg:py-40 border-t border-slate-900/60 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch animate-fade-in">
          
          {/* Left Side: White Snapshots Card */}
          <div className="bg-white text-[#07080a] rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
            <span className="font-serif text-[24px] md:text-[28px] text-slate-500 mb-2">
              A snapshot of
            </span>
            <h2 className="scroll-reveal-target font-serif text-[28px] md:text-[38px] font-bold text-[#07080a] mb-16 text-center">
              What We deliver
            </h2>

            {/* 2x2 Grid with dividers */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-12 w-full relative">
              {/* Horizontal Divider */}
              <div className="absolute left-0 right-0 top-[50%] h-[1px] bg-slate-200" />
              {/* Vertical Divider */}
              <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-slate-200" />
              {/* Intersection Diamond */}
              <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-2.5 h-2.5 rotate-45 bg-slate-300 border border-white" />

              {/* Sector 1: ERP & CRM */}
              <div className="flex flex-col items-center text-center space-y-2 relative z-10 py-2">
                <svg className="w-6 h-6 text-slate-700 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7c0-1.657 3.582-3 8-3s8 1.343 8 3M4 7c0 1.657 3.582 3 8 3s8-1.343 8-3M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7M4 12c0 1.657 3.582 3 8 3s8-1.343 8-3" />
                </svg>
                <h3 className="scroll-reveal-target font-serif text-[18px] md:text-[20px] font-semibold text-[#07080a]">
                  ERP & CRM
                </h3>
                <p className="scroll-reveal-target font-sans text-[13px] md:text-[14px] font-medium text-slate-500">
                  Business Systems
                </p>
              </div>

              {/* Sector 2: Web & Mobile */}
              <div className="flex flex-col items-center text-center space-y-2 relative z-10 py-2">
                <svg className="w-6 h-6 text-slate-700 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
                </svg>
                <h3 className="scroll-reveal-target font-serif text-[18px] md:text-[20px] font-semibold text-[#07080a]">
                  Web & Mobile
                </h3>
                <p className="scroll-reveal-target font-sans text-[13px] md:text-[14px] font-medium text-slate-500">
                  Digital Products
                </p>
              </div>

              {/* Sector 3: Automation */}
              <div className="flex flex-col items-center text-center space-y-2 relative z-10 py-2">
                <svg className="w-6 h-6 text-slate-700 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="scroll-reveal-target font-serif text-[18px] md:text-[20px] font-semibold text-[#07080a]">
                  Automation
                </h3>
                <p className="scroll-reveal-target font-sans text-[13px] md:text-[14px] font-medium text-slate-500">
                  Workflow Efficiency
                </p>
              </div>

              {/* Sector 4: Analytics */}
              <div className="flex flex-col items-center text-center space-y-2 relative z-10 py-2">
                <svg className="w-6 h-6 text-slate-700 mb-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
                <h3 className="scroll-reveal-target font-serif text-[18px] md:text-[20px] font-semibold text-[#07080a]">
                  Analytics
                </h3>
                <p className="scroll-reveal-target font-sans text-[13px] md:text-[14px] font-medium text-slate-500">
                  Actionable insights
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Dark Card with g0.png Background */}
          <div className="relative rounded-[32px] overflow-hidden p-8 md:p-12 flex flex-col justify-between shadow-2xl text-white min-h-[500px] lg:min-h-0">
            {/* Background Image g0.png */}
            <div className="absolute inset-0 z-0">
              <img loading="lazy" 
                src={g0Img} 
                alt="" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
            </div>

            {/* Content (Title, Description, CTA Buttons) */}
            <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
              <div className="space-y-6">
                <h2 className="scroll-reveal-target font-serif text-[28px] md:text-[38px] lg:text-[42px] font-medium leading-[1.2] text-white tracking-tight">
                  Looking for a trusted technology partner ? Let's build smarter syystems together.
                </h2>
                <p className="scroll-reveal-target font-sans text-[15px] md:text-[16px] leading-[1.65] text-white/90 max-w-lg">
                  Galletrix delivers ERP, CRM, Website, mobile app, and automation solutions that help businesses simplify operations and grow with confidence.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                {/* Arrow Circular Button */}
                <button 
                  onClick={() => navigateToContact(1)}
                  className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  aria-label="Contact Galletrix"
                >
                  <svg className="w-5 h-5 text-slate-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                {/* Book a Demo Button */}
                <button 
                  onClick={() => navigateToContact(2)}
                  className="bg-white text-slate-900 font-semibold px-8 py-4 rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Page 8: Selected Work Projects Section */}
      <section id="other-page-8" className="w-full bg-black py-16 md:py-32 border-t border-slate-900/60 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start animate-fade-in">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between w-full mb-20">
            <div className="space-y-4">
              <span className="font-sans text-[15px] font-medium tracking-wide text-white">
                Selected Work
              </span>
              <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-medium leading-[1.12] text-white tracking-tight">
                Projects That Define Us
              </h2>
            </div>

            <a 
              href="#works" 
              onClick={() => setView('works')}
              className="flex items-center gap-2 text-[15px] font-semibold text-white hover:text-white transition-colors duration-200 mt-4 sm:mt-0 cursor-pointer group"
            >
              <span>View All Work</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {projects.map((proj) => (
              <a 
                key={proj.id}
                href="#works" 
                onClick={() => setView('works')}
                className="border border-white/20 bg-black p-8 md:p-10 rounded-[24px] flex flex-col justify-between hover:border-[#cc6f2a]/60 hover:scale-[1.02] hover:bg-slate-900/40 hover:shadow-2xl hover:shadow-[#cc6f2a]/5 transition-all duration-300 min-h-[340px] text-left cursor-pointer group/card"
              >
                <div className="space-y-6">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-[#cc6f2a]">
                    {proj.tag}
                  </span>
                  <h3 className="scroll-reveal-target font-serif text-[24px] font-medium text-white tracking-tight leading-snug">
                    {proj.title}
                  </h3>
                  <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white">
                    {proj.description}
                  </p>
                </div>
                <div className="pt-8">
                  <div 
                    className="flex items-center gap-2 text-[14px] font-bold text-white group-hover/card:text-white transition-colors duration-200"
                  >
                    <span>View Case Study</span>
                    <svg className="w-4 h-4 transition-transform group-hover/card:translate-x-1 duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Page 9: Testimonials Section */}
      <section id="other-page-9" className="w-full bg-black py-16 md:py-32 border-t border-slate-900/60 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-start animate-fade-in">
          {/* Header Row */}
          <div className="flex flex-col items-start space-y-4 mb-16">
            <span className="font-sans text-[15px] font-semibold tracking-wide text-white">
              Testimonials
            </span>
            <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-medium leading-[1.12] text-white tracking-tight">
              What Our Clients Say
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
            {testimonialsData.map((t, idx) => (
              <div key={idx} className="bg-white text-slate-800 p-8 md:p-10 rounded-[28px] shadow-2xl flex flex-col justify-between min-h-[340px] hover:scale-[1.01] transition-all duration-300 relative">
                <div className="space-y-6">
                  {/* Top Row: Stars and Quote Mark */}
                  <div className="flex justify-between items-center">
                    {/* 5 Stars */}
                    <div className="flex items-center gap-1 text-[#e2942b]">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote SVG */}
                    <svg className="w-12 h-12 text-[#e0f7fc] fill-current" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.987z" />
                    </svg>
                  </div>

                  {/* Testimonial text */}
                  <p className="scroll-reveal-target font-sans text-[15px] sm:text-[16px] leading-[1.65] text-slate-700">
                    “{t.quote}”
                  </p>
                </div>

                {/* Bottom Profile Row */}
                <div className="flex items-center gap-4 mt-6">
                  {/* Avatar circular badge */}
                  <div className={`w-12 h-12 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-[15px] shadow-sm select-none`}>
                    {t.initials}
                  </div>

                  {/* Name & Title */}
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold text-[#07080a]">
                      {t.name}
                    </span>
                    <span className="text-[13px] font-medium text-white">
                      {t.company}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Get In Touch */}
      <section className="w-full min-h-[calc(100vh-6rem)] bg-white text-slate-900 flex flex-col justify-center items-center py-12">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
          <span className="text-[15px] font-semibold tracking-wide text-white/50 mb-5 uppercase font-sans">
            Get In Touch
          </span>
          
          <h2 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-medium leading-[1.15] text-slate-900 tracking-tight mb-6 max-w-3xl">
            Ready to transform <br />
            your business <br />
            <span className="text-white font-medium">digitally?</span>
          </h2>
          
          <p className="scroll-reveal-target font-sans text-[16px] sm:text-[17px] leading-relaxed text-slate-500 max-w-2xl mb-10">
            Let us architect the digital infrastructure your business deserves.
          </p>
          
          <button 
            onClick={() => navigateToContact(2)}
            className="bg-black hover:bg-slate-900 text-white px-9 py-4 rounded-full text-[15px] font-semibold flex items-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
          >
            Let's Talk
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>
    </>
  )
}

export default Other
