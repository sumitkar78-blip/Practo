import React from 'react';

interface MedicalWatermarksProps {
  intensity?: 'subtle' | 'prominent';
}

export const MedicalWatermarks: React.FC<MedicalWatermarksProps> = ({
  intensity = 'subtle',
}) => {
  const isProminent = intensity === 'prominent';
  const photoOpacity = isProminent ? 'opacity-20' : 'opacity-[0.06]';
  const equipmentOpacity = isProminent ? 'opacity-25' : 'opacity-[0.05]';

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ========================================================= */}
      {/* 1. DOCTOR PHOTO WATERMARKS (Duotone slate-sapphire portraits) */}
      {/* ========================================================= */}

      {/* Top Right Doctor Watermark: Senior Physician with Stethoscope */}
      <div 
        className={`absolute -top-10 right-0 sm:right-6 lg:right-16 w-[340px] sm:w-[460px] h-[480px] sm:h-[600px] transition-opacity duration-700 ${photoOpacity}`}
        style={{
          maskImage: 'radial-gradient(ellipse 65% 65% at 50% 45%, black 20%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 50% 45%, black 20%, transparent 85%)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale contrast-125 brightness-95 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[#1e40af]/15 mix-blend-color"></div>
      </div>

      {/* Mid Left Doctor Watermark: Compassionate Female Specialist consulting with medical tablet */}
      <div 
        className={`absolute top-[900px] -left-12 sm:left-4 w-[320px] sm:w-[440px] h-[460px] sm:h-[580px] transition-opacity duration-700 ${photoOpacity}`}
        style={{
          maskImage: 'radial-gradient(ellipse 65% 65% at 45% 45%, black 15%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 45% 45%, black 15%, transparent 80%)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1594824813586-7a8e7e1694f4?auto=format&fit=crop&w=800&q=80"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale contrast-130 brightness-90 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[#0369a1]/20 mix-blend-color"></div>
      </div>

      {/* Mid Right Doctor Watermark: Caring Senior Cardiologist Doctor */}
      <div 
        className={`absolute top-[1800px] -right-10 sm:right-8 w-[300px] sm:w-[420px] h-[450px] sm:h-[550px] transition-opacity duration-700 ${photoOpacity}`}
        style={{
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 15%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 15%, transparent 80%)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=800&q=80"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale contrast-125 brightness-95 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[#2563eb]/15 mix-blend-color"></div>
      </div>

      {/* Bottom Medical Team Watermark: Multi-specialty Clinical Doctors in Lab Coats */}
      <div 
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-[600px] sm:w-[850px] h-[350px] sm:h-[450px] transition-opacity duration-700 ${photoOpacity}`}
        style={{
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 10%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 50%, black 10%, transparent 80%)',
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover grayscale contrast-125 brightness-90 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-[#1e3a8a]/20 mix-blend-color"></div>
      </div>


      {/* ========================================================= */}
      {/* 2. DOCTORS' MEDICAL EQUIPMENT WATERMARKS (Detailed Vector Art) */}
      {/* ========================================================= */}

      {/* Equipment 1: Detailed Medical Stethoscope (Top Left Behind Hero) */}
      <svg
        className={`absolute top-12 left-4 sm:left-14 w-72 sm:w-96 h-72 sm:h-96 text-[#0284c7] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Earpieces and Binaural Tubes */}
        <path d="M50 35 C 50 25, 60 20, 70 20" />
        <path d="M110 35 C 110 25, 100 20, 90 20" />
        <circle cx="50" cy="35" r="4" fill="currentColor" />
        <circle cx="110" cy="35" r="4" fill="currentColor" />
        <path d="M70 20 C 70 45, 80 55, 80 75" />
        <path d="M90 20 C 90 45, 80 55, 80 75" />
        {/* Flexible Tubing curving down */}
        <path d="M80 75 C 80 115, 60 145, 85 165 C 110 185, 145 165, 145 130 C 145 105, 130 95, 130 80" />
        {/* Chestpiece Diaphragm & Bell */}
        <circle cx="130" cy="72" r="14" strokeWidth="3" />
        <circle cx="130" cy="72" r="6" fill="currentColor" />
        {/* Subtle soundwave rings */}
        <path d="M130 46 C 145 46, 156 57, 156 72" strokeDasharray="3 3" strokeWidth="1.5" />
        <path d="M130 38 C 151 38, 164 51, 164 72" strokeDasharray="4 4" strokeWidth="1.5" />
      </svg>

      {/* Equipment 2: Clinical ECG / Electrocardiogram Heart Wave Line (Hero to Categories) */}
      <svg
        className={`absolute top-[420px] left-0 w-full h-32 text-[#2563eb] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 1200 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M0 60 L 220 60 L 240 50 L 255 70 L 270 10 L 285 110 L 300 45 L 315 65 L 330 60 L 580 60 L 600 50 L 615 70 L 630 10 L 645 110 L 660 45 L 675 65 L 690 60 L 920 60 L 940 50 L 955 70 L 970 10 L 985 110 L 1000 45 L 1015 65 L 1030 60 L 1200 60" />
      </svg>

      {/* Equipment 3: Caduceus & Rod of Asclepius (Symbol of Medicine, Right of Categories) */}
      <svg
        className={`absolute top-[680px] right-4 sm:right-16 w-64 sm:w-80 h-80 sm:h-96 text-[#1e3a8a] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 200 240"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Central staff */}
        <line x1="100" y1="20" x2="100" y2="220" strokeWidth="4" />
        <circle cx="100" cy="18" r="8" fill="currentColor" />
        <path d="M96 220 L 104 220" strokeWidth="4" />
        {/* Entwined healing serpent 1 */}
        <path d="M100 45 C 130 55, 130 85, 100 95 C 70 105, 70 135, 100 145 C 130 155, 130 185, 100 195" strokeWidth="2.5" />
        {/* Entwined healing serpent 2 (symmetric caduceus wings) */}
        <path d="M100 45 C 70 55, 70 85, 100 95 C 130 105, 130 135, 100 145 C 70 155, 70 185, 100 195" strokeWidth="2.5" />
        {/* Wings of Hermes / Asclepius */}
        <path d="M100 35 C 80 20, 50 25, 45 45 C 55 50, 75 45, 95 45" strokeWidth="2" />
        <path d="M100 35 C 120 20, 150 25, 155 45 C 145 50, 125 45, 105 45" strokeWidth="2" />
      </svg>

      {/* Equipment 4: Laboratory Microscope & Specimen Slide (Mid Listing section) */}
      <svg
        className={`absolute top-[1350px] right-6 sm:right-20 w-64 sm:w-80 h-72 sm:h-88 text-[#0284c7] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Base */}
        <path d="M40 180 L 140 180 C 150 180, 155 170, 145 165 L 125 160 C 115 158, 65 158, 55 160 L 35 165 C 25 170, 30 180, 40 180 Z" />
        {/* Curved Arm */}
        <path d="M130 160 C 160 140, 165 90, 135 60 C 120 45, 95 45, 95 45" strokeWidth="4" />
        {/* Eyepiece / Tube */}
        <rect x="70" y="30" width="18" height="40" rx="3" transform="rotate(-30 70 30)" />
        <circle cx="85" cy="22" r="7" />
        {/* Revolving Nosepiece and Objectives */}
        <path d="M72 85 L 85 92" strokeWidth="5" />
        <line x1="75" y1="92" x2="70" y2="110" strokeWidth="3" />
        <line x1="85" y1="98" x2="88" y2="115" strokeWidth="3" />
        {/* Stage and Specimen clips */}
        <rect x="45" y="118" width="65" height="8" rx="2" />
        <circle cx="78" cy="122" r="3" fill="currentColor" />
        {/* Condenser and mirror */}
        <circle cx="78" cy="142" r="9" />
        <line x1="78" y1="133" x2="78" y2="151" strokeWidth="2" />
      </svg>

      {/* Equipment 5: Clinical Syringe with Graduation Marks & Needle (Mid Listing Left) */}
      <svg
        className={`absolute top-[1600px] left-4 sm:left-12 w-64 sm:w-72 h-64 sm:h-72 text-[#1e3a8a] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Barrel tilted at 45 degrees */}
        <rect x="65" y="65" width="70" height="28" rx="4" transform="rotate(45 100 79)" />
        {/* Plunger */}
        <line x1="145" y1="124" x2="175" y2="154" strokeWidth="4" />
        <line x1="165" y1="165" x2="185" y2="145" strokeWidth="4" />
        {/* Needle */}
        <line x1="60" y1="39" x2="25" y2="4" strokeWidth="2" />
        {/* Graduation tick marks */}
        <line x1="88" y1="70" x2="94" y2="76" strokeWidth="1.5" />
        <line x1="98" y1="80" x2="104" y2="86" strokeWidth="1.5" />
        <line x1="108" y1="90" x2="114" y2="96" strokeWidth="1.5" />
        <line x1="118" y1="100" x2="124" y2="106" strokeWidth="1.5" />
      </svg>

      {/* Equipment 6: Sphygmomanometer (Blood pressure gauge and dial, near trust stats) */}
      <svg
        className={`absolute top-[2350px] left-8 sm:left-24 w-60 sm:w-72 h-60 sm:h-72 text-[#0284c7] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Pressure gauge circle */}
        <circle cx="100" cy="90" r="45" strokeWidth="3" />
        <circle cx="100" cy="90" r="38" strokeDasharray="3 4" strokeWidth="1.5" />
        {/* Dial pointer */}
        <line x1="100" y1="90" x2="120" y2="75" strokeWidth="2.5" />
        <circle cx="100" cy="90" r="4" fill="currentColor" />
        {/* Pressure numbers marks */}
        <line x1="100" y1="52" x2="100" y2="58" strokeWidth="2" />
        <line x1="62" y1="90" x2="68" y2="90" strokeWidth="2" />
        <line x1="138" y1="90" x2="132" y2="90" strokeWidth="2" />
        {/* Hose and inflation bulb */}
        <path d="M100 135 C 100 160, 130 160, 130 180" strokeWidth="3" />
        <ellipse cx="130" cy="180" rx="14" ry="9" strokeWidth="2" />
      </svg>

      {/* Equipment 7: Cross emblem & Pulse Wave (Bottom Trust / FAQ area) */}
      <svg
        className={`absolute top-[2800px] right-8 sm:right-28 w-64 sm:w-80 h-64 sm:h-80 text-[#2563eb] transition-opacity duration-700 ${equipmentOpacity}`}
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {/* Medical Cross */}
        <path
          d="M80 40 H 120 V 80 H 160 V 120 H 120 V 160 H 80 V 120 H 40 V 80 H 80 Z"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="100" cy="100" r="85" strokeDasharray="5 5" strokeWidth="1.5" />
      </svg>
    </div>
  );
};
