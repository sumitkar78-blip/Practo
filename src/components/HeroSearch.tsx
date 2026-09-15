import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Crosshair, 
  ChevronDown, 
  Clock, 
  Stethoscope, 
  User, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
import { CITIES, SPECIALTIES, DOCTORS } from '../data/mockData';
import { findClosestCity } from '../utils/storage';

interface HeroSearchProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedArea: string;
  onSelectArea: (area: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExecuteSearch: () => void;
  onSelectSpecialtyChip: (specialty: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  selectedCity,
  onSelectCity,
  selectedArea,
  onSelectArea,
  searchQuery,
  onSearchChange,
  onExecuteSearch,
  onSelectSpecialtyChip,
}) => {
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [locationDetecting, setLocationDetecting] = useState(false);
  const [locationStatus, setLocationStatus] = useState<{ text: string; isError: boolean } | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const locationContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
      if (
        locationContainerRef.current &&
        !locationContainerRef.current.contains(e.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Find popular areas for current city
  const currentCityObj = CITIES.find(
    (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
  ) || CITIES[0];

  const handleDetectLocation = () => {
    setLocationStatus(null);
    if (!navigator.geolocation) {
      setLocationStatus({
        text: 'Geolocation is not supported by your browser. Please choose your city manually.',
        isError: true,
      });
      return;
    }

    setLocationDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationDetecting(false);
        const { latitude, longitude } = position.coords;
        // Find closest supported city using Haversine calculation
        const closestCity = findClosestCity(latitude, longitude, CITIES);
        onSelectCity(closestCity.name);
        // Set default popular area for that city
        if (closestCity.popularAreas.length > 0) {
          onSelectArea(closestCity.popularAreas[0]);
        } else {
          onSelectArea('');
        }
        setLocationStatus({
          text: `Detected nearest service city: ${closestCity.name} (${closestCity.popularAreas[0] || 'All Areas'})`,
          isError: false,
        });
        setShowLocationDropdown(false);
      },
      (error) => {
        setLocationDetecting(false);
        let errorMsg = 'Unable to detect your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Location permission was denied. Please select your city manually below.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Location information is currently unavailable. Please select your city manually.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Location request timed out. Please select your city manually.';
            break;
          default:
            errorMsg = 'Could not determine location. Please choose from the supported cities below.';
            break;
        }
        setLocationStatus({
          text: errorMsg,
          isError: true,
        });
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  };

  // Filter suggestion items based on user input
  const queryLower = searchQuery.toLowerCase().trim();
  const matchedSpecialties = queryLower
    ? SPECIALTIES.filter(
        (s) =>
          s.name.toLowerCase().includes(queryLower) ||
          s.popularSymptoms.some((sym) => sym.toLowerCase().includes(queryLower))
      ).slice(0, 3)
    : SPECIALTIES.slice(0, 3);

  const matchedDoctors = queryLower
    ? DOCTORS.filter(
        (d) =>
          d.name.toLowerCase().includes(queryLower) ||
          d.specialty.toLowerCase().includes(queryLower) ||
          d.clinicName.toLowerCase().includes(queryLower) ||
          d.city.toLowerCase().includes(queryLower) ||
          d.area.toLowerCase().includes(queryLower)
      ).slice(0, 3)
    : DOCTORS.slice(0, 2);

  const popularChips = [
    'Cardiologist',
    'Dermatologist',
    'General Physician',
    'Gynecologist',
    'Pediatrician',
    'Orthopedist',
    'Dentist',
    'Viral Fever',
    'Back Pain',
  ];

  const handleKeyDownSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setShowSearchSuggestions(false);
      onExecuteSearch();
    }
  };

  return (
    <section id="hero-section" className="relative bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-10 pb-16 border-b border-slate-200/80">
      {/* Decorative background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 right-5 w-96 h-96 rounded-full bg-cyan-100/40 blur-3xl"></div>
        <div className="absolute top-48 -left-20 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-[#28328c] text-xs font-bold mb-3 border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-[#14bef0]" />
            <span>India's Most Trusted Doctor Discovery & Appointment Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Find and book top doctors near you with{' '}
            <span className="text-[#28328c] relative inline-block">
              confidence
              <span className="absolute bottom-1 left-0 w-full h-1.5 bg-[#14bef0]/30 -z-10 rounded-sm"></span>
            </span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto">
            Book verified in-clinic appointments or consult online via HD video call in just 60 seconds. Zero convenience fee.
          </p>
        </div>

        {/* Location Status Message if any */}
        {locationStatus && (
          <div className="max-w-4xl mx-auto mb-3">
            <div className={`p-3 rounded-xl text-xs flex items-center justify-between border ${
              locationStatus.isError
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center gap-2">
                {locationStatus.isError ? (
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                <span>{locationStatus.text}</span>
              </div>
              <button
                onClick={() => setLocationStatus(null)}
                aria-label="Dismiss message"
                className="p-1 hover:bg-black/5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Search Bar Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-2 sm:p-2.5 shadow-xl shadow-blue-900/10 border border-slate-200/90 flex flex-col md:flex-row gap-2 items-stretch">
            
            {/* Location Selector (Left Section) */}
            <div ref={locationContainerRef} className="relative md:w-5/12">
              <div
                id="location-input-box"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/60 transition-colors cursor-pointer h-full"
              >
                <MapPin className="w-5 h-5 text-[#14bef0] shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    City & Locality
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                    {selectedCity} {selectedArea ? `• ${selectedArea}` : '• All Areas'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showLocationDropdown ? 'rotate-180' : ''}`} />
              </div>

              {/* Location Dropdown Menu */}
              {showLocationDropdown && (
                <div className="absolute left-0 top-full mt-2 w-full md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* Real GPS Geolocation Trigger */}
                  <button
                    id="detect-gps-location-btn"
                    onClick={handleDetectLocation}
                    disabled={locationDetecting}
                    className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-blue-50/70 hover:bg-blue-100/70 text-[#28328c] text-xs font-bold transition-colors mb-3 cursor-pointer disabled:opacity-50"
                  >
                    <Crosshair className={`w-4 h-4 text-[#14bef0] ${locationDetecting ? 'animate-spin' : ''}`} />
                    <span>{locationDetecting ? 'Detecting current GPS location...' : 'Detect My Exact Location'}</span>
                  </button>

                  {/* City Selector list */}
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                    Select Supported City
                  </div>
                  <div className="space-y-1 max-h-40 overflow-y-auto mb-3">
                    {CITIES.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => {
                          onSelectCity(c.name);
                          onSelectArea(''); // reset area on city switch
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedCity === c.name
                            ? 'bg-[#28328c] text-white'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className={selectedCity === c.name ? 'text-blue-200 text-[10px]' : 'text-slate-400 text-[10px]'}>
                          {c.state}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Popular Areas for Selected City */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between px-2 mb-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Areas in {selectedCity}
                      </span>
                      {selectedArea && (
                        <button
                          onClick={() => {
                            onSelectArea('');
                            setShowLocationDropdown(false);
                          }}
                          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Clear Area
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
                      <button
                        onClick={() => {
                          onSelectArea('');
                          setShowLocationDropdown(false);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                          !selectedArea
                            ? 'bg-blue-100 text-[#28328c] font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All Areas
                      </button>
                      {currentCityObj.popularAreas.map((area) => (
                        <button
                          key={area}
                          onClick={() => {
                            onSelectArea(area);
                            setShowLocationDropdown(false);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            selectedArea === area
                              ? 'bg-[#28328c] text-white font-bold'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Doctor / Specialty Search Input (Right Section) */}
            <div ref={searchContainerRef} className="relative flex-1">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/60 focus-within:border-blue-400 focus-within:bg-white transition-all h-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    Doctors, Specialties, Clinics or Symptoms
                  </span>
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      setShowSearchSuggestions(true);
                    }}
                    onFocus={() => setShowSearchSuggestions(true)}
                    onKeyDown={handleKeyDownSearch}
                    placeholder="Search Cardiologist, Dermatologist, Fever, Acne, Clinic..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search input"
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Box */}
              {showSearchSuggestions && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  
                  {/* Matched Specialties */}
                  <div className="mb-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-[#14bef0]" />
                      <span>Medical Specialties</span>
                    </div>
                    <div className="space-y-1">
                      {matchedSpecialties.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSearchChange(s.name);
                            setShowSearchSuggestions(false);
                            onSelectSpecialtyChip(s.name);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-[#28328c] flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span>{s.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({s.popularSymptoms.slice(0, 2).join(', ')})
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-600">
                            {s.doctorCount}+ Specialists
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Matched Doctors */}
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#28328c]" />
                      <span>Verified Practitioners</span>
                    </div>
                    <div className="space-y-1">
                      {matchedDoctors.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            onSearchChange(doc.name);
                            setShowSearchSuggestions(false);
                            onExecuteSearch();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-blue-50/70 hover:text-[#28328c] flex items-center justify-between transition-colors"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-[11px] text-slate-500">{doc.specialty} • {doc.clinicName} ({doc.city})</div>
                          </div>
                          <span className="text-xs font-bold text-[#28328c]">
                            ₹{doc.consultationFee}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Execute Search CTA Button */}
            <button
              id="hero-search-submit-btn"
              onClick={() => {
                setShowSearchSuggestions(false);
                onExecuteSearch();
              }}
              className="px-6 py-3.5 rounded-2xl bg-[#28328c] hover:bg-[#1f276f] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/20 active:scale-95 cursor-pointer shrink-0"
            >
              <span>Search Doctors</span>
              <ArrowRight className="w-4 h-4 text-cyan-300" />
            </button>

          </div>
        </div>

        {/* Popular Symptom & Specialty Tags */}
        <div className="max-w-4xl mx-auto mt-5 flex items-center gap-2 flex-wrap justify-center text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Popular searches:
          </span>
          {popularChips.map((chip) => (
            <button
              key={chip}
              id={`popular-chip-${chip.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onSelectSpecialtyChip(chip)}
              className="px-3 py-1 rounded-full bg-white hover:bg-blue-50 border border-slate-200/90 text-slate-600 hover:text-[#28328c] font-medium transition-all shadow-2xs cursor-pointer hover:border-blue-300"
            >
              {chip}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
