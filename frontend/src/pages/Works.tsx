import React, { useState, useEffect } from 'react'
import worksImg from '../assets/work.png'
import { getProjects } from '../utils/projectData'
import type { Project } from '../utils/projectData'

interface WorksProps {
  navigateToContact: (page: 1 | 2 | 3) => void;
}

const Works: React.FC<WorksProps> = ({ navigateToContact }) => {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  return (
    <>
      {/* Works Section with desktop background image overlay */}
      <section id="works" className="w-full mt-24 relative min-h-[calc(100vh-6rem)] bg-black flex flex-col justify-center">
        {/* Desktop Background Image */}
        <div className="absolute inset-0 hidden lg:block">
          <img loading="lazy" 
            src={worksImg} 
            alt="Galletrix Projects Portfolio Mockups" 
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col items-start">
          {/* Subtitle */}
          <span className="text-[15px] font-medium tracking-wide text-white/50 mb-5">
             Our Work
          </span>

          {/* Heading */}
          <h1 className="scroll-reveal-target font-serif text-[32px] sm:text-[42px] md:text-[52px] lg:text-[68px] font-bold leading-[1.12] text-white tracking-tight mb-8 max-w-4xl">
            Projects That Define Excellence
          </h1>

          {/* Description */}
          <p className="scroll-reveal-target font-sans text-[16px] sm:text-[18px] md:text-[19px] leading-[1.65] text-white max-w-3xl mb-14">
            A selection of enterprise solutions we have built, deployed, and continue to evolve for clients across industries.
          </p>
        </div>

        {/* Mobile Block Image */}
        <div className="w-full lg:hidden">
          <img loading="lazy" 
            src={worksImg} 
            alt="Galletrix Projects Portfolio Mockups" 
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Works Page 2: Case Studies Grid */}
      <section id="works-page-2" className="w-full bg-black py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {projects.map((proj) => (
              <div key={proj.id} className="border border-white/20 bg-black p-8 md:p-10 rounded-[28px] flex flex-col justify-between hover:border-white/40 transition-all duration-300">
                <div>
                  {/* Tag / Pill */}
                  <span className="px-4 py-2 rounded-full border border-white/20 text-[11px] font-medium tracking-wider text-white bg-black hover:border-white/40 hover:bg-white/10 hover:text-white transition-all cursor-default inline-block w-fit mb-6 uppercase">
                    {proj.tag}
                  </span>
                  {/* Title */}
                  <h3 className="scroll-reveal-target font-serif text-[22px] md:text-[24px] font-medium text-white tracking-tight mb-4">
                    {proj.title}
                  </h3>
                  {/* Description */}
                  <p className="scroll-reveal-target font-sans text-[14px] sm:text-[15px] leading-[1.65] text-white mb-6">
                    {proj.description}
                  </p>
                  {/* Divider */}
                  {proj.metrics && proj.metrics.length > 0 && (
                    <>
                      <div className="border-t border-white/20 my-6"></div>
                      {/* Metrics */}
                      <div className="font-sans text-[14px] sm:text-[15px] text-white space-y-2 mb-8">
                        {proj.metrics.map((m, idx) => (
                          <div key={idx}>{m}</div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Link */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToContact(2);
                  }}
                  className="flex items-center gap-2.5 text-[12px] font-bold tracking-widest text-white hover:bg-white/10 hover:text-white transition-colors duration-200 uppercase group cursor-pointer text-left mt-auto"
                >
                  <span>View Case Study</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
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

export default Works
