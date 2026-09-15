import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Menu, 
  X, 
  ChevronDown, 
  Stethoscope, 
  Video, 
  ShieldCheck, 
  PhoneCall, 
  UserCheck 
} from 'lucide-react';
import { CITIES } from '../data/mockData';
import { Appointment } from '../types';

interface NavbarProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  appointments: Appointment[];
  onOpenAppointments: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onSelectSpecialty: (specialtyName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  appointments,
  onOpenAppointments,
  onNavigateToSection,
  onSelectSpecialty,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setCityDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeAppointmentsCount = appointments.filter(
    (a) => a.status === 'confirmed'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top emergency announcement bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              24/7 Medical Care
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">Instant video consultations in under 60 seconds</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
              Emergency: <strong className="text-white">1800-425-7228</strong>
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <button 
              id="top-security-badge"
              onClick={() => onNavigateToSection('trust-stats')}
              className="hidden md:inline text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              100% Verified Practitioners
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & City Selector */}
          <div className="flex items-center gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigateToSection('hero-section')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#28328c] to-[#14bef0] flex items-center justify-center text-white shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-[#28328c]">practo</span>
                  <span className="w-2 h-2 rounded-full bg-[#14bef0]"></span>
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase block -mt-0.5">
                  Doctor Care
                </span>
              </div>
            </button>

            {/* City Dropdown Selector */}
            <div ref={cityDropdownRef} className="relative hidden lg:block">
              <button
                id="city-picker-btn"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#14bef0]" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Your City
                  </div>
                  {CITIES.map((city) => (
                    <button
                      key={city.name}
                      id={`city-option-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => {
                        onSelectCity(city.name);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-sky-50 transition-colors ${
                        selectedCity === city.name ? 'text-[#28328c] font-bold bg-sky-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>{city.name}</span>
                      <span className="text-[10px] text-slate-400">{city.state}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-find-doctors-btn"
              onClick={() => onNavigateToSection('doctors-section')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#28328c] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Find Doctors
            </button>
            <button
              id="nav-video-consult-btn"
              onClick={() => {
                onNavigateToSection('doctors-section');
              }}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#28328c] hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-[#14bef0]" />
              Video Consult
            </button>
            <button
              id="nav-specialties-btn"
              onClick={() => onNavigateToSection('specialties-section')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#28328c] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Specialties
            </button>
            <button
              id="nav-testimonials-btn"
              onClick={() => onNavigateToSection('testimonials-section')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#28328c] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Patient Stories
            </button>
            <button
              id="nav-faqs-btn"
              onClick={() => onNavigateToSection('faqs-section')}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-[#28328c] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Help & FAQ
            </button>
          </nav>

          {/* Header Action: My Bookings & Emergency Call */}
          <div className="flex items-center gap-3">
            <button
              id="header-my-appointments-btn"
              onClick={onOpenAppointments}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#28328c] hover:bg-[#1f276f] transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>My Appointments</span>
              {activeAppointmentsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#14bef0] text-white text-[11px] font-extrabold flex items-center justify-center">
                  {activeAppointmentsCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="pb-2 border-b border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select City
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => {
                    onSelectCity(city.name);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center border ${
                    selectedCity === city.name
                      ? 'border-[#28328c] bg-blue-50 text-[#28328c]'
                      : 'border-slate-200 text-slate-700 bg-slate-50'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateToSection('doctors-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>Find Doctors</span>
              <span className="text-xs text-slate-400">100k+ Clinics</span>
            </button>
            <button
              onClick={() => {
                onNavigateToSection('doctors-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#14bef0]" />
                Video Consult
              </span>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full font-bold">
                Instant 60s
              </span>
            </button>
            <button
              onClick={() => {
                onNavigateToSection('specialties-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Explore Specialties
            </button>
            <button
              onClick={() => {
                onNavigateToSection('testimonials-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Doctor Testimonials & Reviews
            </button>
            <button
              onClick={() => {
                onNavigateToSection('faqs-section');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Help & FAQ
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onOpenAppointments();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#28328c] hover:bg-[#1f276f] flex items-center justify-center gap-2 shadow-xs"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>View Booked Appointments ({activeAppointmentsCount})</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
