import React, { useEffect, useRef, useState } from 'react'
import aboutImg from '../assets/about.png'
import aboutStoryImg from '../assets/a2.png'

interface AboutProps {
  navigateToContact: (page: 1 | 2 | 3) => void;
}

const About: React.FC<AboutProps> = ({ navigateToContact }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])
  return (
    <>
      {/* About Section with desktop background image overlay */}
      <section id="about" className="w-full mt-24 relative min-h-[calc(100vh-6rem)] bg-black flex flex-col justify-center">
        {/* Desktop Background Image */}
        <div className="absolute inset-0 hidden lg:block opacity-40 pointer-events-none select-none">
          <img loading="lazy" 
            src={aboutImg} 
            alt="Galletrix Office and Brand Identity" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-start py-12">
          {/* Subtitle */}
          <span className="text-[15px] font-medium tracking-wide text-white/50 mb-5">
            About Galletrix
          </span>

          {/* Heading */}
          <h1 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-bold leading-[1.12] text-white tracking-tight mb-8 max-w-4xl">
            Building Intelligent Digital Solutions
          </h1>

          {/* Description */}
          <p className="scroll-reveal-target font-sans text-[16px] sm:text-[18px] md:text-[19px] leading-[1.65] text-white max-w-3xl mb-14">
            Galletrix helps businesses simplify operations through ERP, CRM, web, mobile, and automation solutions designed for productivity, scalability, and growth.
          </p>
        </div>

        {/* Mobile Block Image */}
        <div className="w-full lg:hidden">
          <img loading="lazy" 
            src={aboutImg} 
            alt="Galletrix Office and Brand Identity" 
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Our Story Section */}
      <section 
        id="about-story" 
        ref={sectionRef} 
        className="w-full min-h-[calc(100vh-6rem)] bg-black flex flex-col justify-center items-center overflow-hidden py-12"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left Column: Image (Slides up from down to top) */}
          <div className={`lg:col-span-6 w-full transition-all duration-1000 delay-100 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}>
            <img loading="lazy" 
              src={aboutStoryImg} 
              alt="Our Story - Built to simplify, engineered to scale" 
              className="w-full h-auto object-cover rounded-[28px] shadow-2xl"
            />
          </div>

          {/* Right Column: Text Content (Slides up from down to top, slightly staggered) */}
          <div className={`lg:col-span-6 flex flex-col items-start lg:pl-6 transition-all duration-1000 delay-300 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}>
            <span className="font-sans text-[15px] font-medium tracking-wide text-white/50 mb-5">
              Our Story
            </span>
            
            <h2 className="scroll-reveal-target font-serif text-[38px] sm:text-[48px] md:text-[56px] font-bold leading-[1.15] text-white tracking-tight mb-8">
              Built to simplify,<br />engineered to scale.
            </h2>

            <div className="flex flex-col gap-6 text-white font-sans text-[15px] sm:text-[16px] leading-[1.7] max-w-xl">
              <p>
                Galletrix was founded by a team of enterprise software engineers who saw a recurring problem: businesses were spending millions on technology that was too complex, too rigid, or simply the wrong fit.
              </p>
              <p>
                We built Galletrix to be different. Every solution we design starts with deep understanding of the business problem — not the technology trend. We believe the best software disappears into the workflow, empowering people without demanding their attention.
              </p>
              <p>
                Today, we serve enterprises across multiple industries, delivering ERP platforms, automation engines, and intelligent dashboards that drive measurable business outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Clients Choose Us Section */}
      <section id="about-why-us" className="w-full min-h-[calc(100vh-6rem)] bg-black flex flex-col justify-center items-center py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          {/* Section Header */}
          <div className="flex flex-col items-start mb-12 md:mb-16">
            <span className="font-sans text-[15px] font-medium tracking-wide text-white/50 mb-5">
              Why Clients Choose Us
            </span>
            <h2 className="scroll-reveal-target font-serif text-[38px] sm:text-[48px] md:text-[56px] font-bold leading-[1.15] text-white tracking-tight">
              Trust Built Through Results
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1: Proven Track Record */}
            <div className="border border-white/20 bg-black p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-white/40 transition-all duration-300">
              <h3 className="scroll-reveal-target font-serif text-[20px] md:text-[22px] font-bold text-white tracking-tight mb-5">
                Proven Track Record
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white">
                Over 120 delivered projects across diverse industries — on time, within scope, and exceeding expectations.
              </p>
            </div>

            {/* Card 2: Enterprise Security */}
            <div className="border border-white/20 bg-black p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-white/40 transition-all duration-300">
              <h3 className="scroll-reveal-target font-serif text-[20px] md:text-[22px] font-bold text-white tracking-tight mb-5">
                Enterprise Security
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white">
                ISO-aligned security practices, encrypted data pipelines, and compliance-ready architectures built into every solution.
              </p>
            </div>

            {/* Card 3: Long-term Partnership */}
            <div className="border border-white/20 bg-black p-8 md:p-10 rounded-[24px] flex flex-col justify-start hover:border-white/40 transition-all duration-300">
              <h3 className="scroll-reveal-target font-serif text-[20px] md:text-[22px] font-bold text-white tracking-tight mb-5">
                Long-term Partnership
              </h3>
              <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white">
                We do not disappear after launch. Our team remains engaged through every iteration, upgrade, and scale-up phase.
              </p>
            </div>
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

export default About
