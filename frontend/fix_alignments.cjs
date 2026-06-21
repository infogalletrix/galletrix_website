const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Automation.tsx',
  'src/pages/Dashboard.tsx',
  'src/pages/Marketing.tsx',
  'src/pages/UIUX.tsx',
  'src/pages/Web.tsx',
  'src/pages/CorporateOperations.tsx',
  'src/pages/Education.tsx',
  'src/pages/Finance.tsx',
  'src/pages/Healthcare.tsx',
  'src/pages/HRRecruitment.tsx',
  'src/pages/LogisticsSupplyChain.tsx',
  'src/pages/ManpowerHR.tsx',
  'src/pages/Retail.tsx',
  'src/pages/Careers.tsx',
  'src/pages/CareersApply.tsx',
  'src/pages/Contact.tsx',
  'src/pages/Erp.tsx',
  'src/pages/Industry.tsx',
  'src/pages/Services.tsx',
  'src/pages/Works.tsx',
  'src/pages/Other.tsx'
];

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // CTA Sections
  content = replaceAll(content, 
    'className="w-full bg-white text-slate-900 py-24 md:py-32 flex flex-col items-center"', 
    'className="w-full min-h-[calc(100vh-6rem)] bg-white text-slate-900 flex flex-col justify-center items-center py-12"');
  content = replaceAll(content, 
    'className="w-full bg-white text-slate-900 py-32 md:py-40 flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] border-t border-slate-200"', 
    'className="w-full min-h-[calc(100vh-6rem)] bg-white text-slate-900 py-12 flex flex-col justify-center items-center border-t border-slate-200"');

  // Section 2
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] pt-24 md:pt-32 lg:pt-40 pb-0 border-t border-slate-900/60 flex flex-col items-center"', 
    'className="w-full bg-[#07080a] min-h-[calc(100vh-6rem)] py-12 border-t border-slate-900/60 flex flex-col justify-center items-center"');

  // Section 3
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] pt-16 md:pt-20 lg:pt-24 pb-24 md:pb-32 lg:pb-40 min-h-screen flex items-center"', 
    'className="w-full bg-[#07080a] min-h-[calc(100vh-6rem)] py-12 flex flex-col justify-center items-center"');

  // Hero sections (Services/Industry)
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] pt-32 md:pt-40 pb-20 flex flex-col justify-center min-h-[calc(100vh-6rem)] lg:min-h-0"', 
    'className="w-full bg-[#07080a] mt-24 py-12 flex flex-col justify-center min-h-[calc(100vh-6rem)]"');

  // Works/Industry overlay section
  content = replaceAll(content, 
    'className="w-full relative lg:aspect-[3/2] bg-[#07080a] flex flex-col justify-between lg:justify-center"', 
    'className="w-full mt-24 relative min-h-[calc(100vh-6rem)] bg-[#07080a] flex flex-col justify-center"');
  content = replaceAll(content, 
    'className="w-full relative lg:aspect-[3/2] bg-[#07080a] flex flex-col justify-between lg:justify-center min-h-[calc(100vh-6rem)] lg:min-h-0"', 
    'className="w-full mt-24 relative min-h-[calc(100vh-6rem)] bg-[#07080a] flex flex-col justify-center"');

  // Erp specific
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] min-h-[calc(100vh-6rem)] flex items-center pt-28 pb-20 md:pt-36 md:pb-28 animate-fade-in"', 
    'className="w-full bg-[#07080a] mt-24 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center py-12 animate-fade-in"');

  // Contact.tsx page 2
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] pt-32 pb-24 border-t border-slate-900/60 min-h-[calc(100vh-6rem)] flex items-center"', 
    'className="w-full bg-[#07080a] py-12 border-t border-slate-900/60 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center"');

  // CareersApply.tsx
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] pt-32 md:pt-40 pb-20 min-h-[calc(100vh-6rem)] flex items-center animate-fade-in"', 
    'className="w-full bg-[#07080a] mt-24 py-12 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center animate-fade-in"');

  // Other.tsx subsequent sections
  content = replaceAll(content, 
    'className="w-full bg-[#07080a] pt-32 pb-24 border-t border-slate-900/60 min-h-[calc(100vh-6rem)] flex items-center"', 
    'className="w-full bg-[#07080a] py-12 border-t border-slate-900/60 min-h-[calc(100vh-6rem)] flex flex-col justify-center items-center"');

  // Generic fallback for any missed pt-32 / pt-28 in hero divs
  content = content.replace(/className="(relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12[^"]*?) pt-28 lg:pt-0([^"]*?)"/g, 
    'className="$1 py-12$2"');
  content = content.replace(/className="(w-full max-w-7xl mx-auto px-6 md:px-12[^"]*?) mb-32([^"]*?)"/g, 
    'className="$1 mb-16$2"');

  fs.writeFileSync(fullPath, content, 'utf8');
});
console.log('Replacements completed.');
