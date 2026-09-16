import React from 'react';
import { 
  Doctor, 
  FilterState 
} from '../types';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Video, 
  ThumbsUp, 
  Check, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  Calendar,
  Building2,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';
import { SPECIALTIES, CITIES } from '../data/mockData';

interface DoctorListingProps {
  doctors: Doctor[];
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onBookDoctor: (doctor: Doctor, mode: 'in_clinic' | 'video') => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
}

export const DoctorListing: React.FC<DoctorListingProps> = ({
  doctors,
  filters,
  onUpdateFilters,
  onResetFilters,
  onBookDoctor,
  onViewDoctorProfile,
}) => {
  const hasActiveFilters = 
    Boolean(filters.specialty) || 
    Boolean(filters.area) ||
    filters.mode !== 'all' || 
    filters.gender !== 'all' || 
    filters.minExperience > 0 || 
    filters.maxFee < 2000 || 
    filters.availableTodayOnly || 
    Boolean(filters.searchQuery);

  const currentCityObj = CITIES.find(
    (c) => c.name.toLowerCase() === filters.city.toLowerCase()
  ) || CITIES[0];

  return (
    <section id="doctors-section" className="py-12 bg-transparent border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subhead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#1e3a8a] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
              <span>Practo Verified Doctors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {filters.specialty ? `${filters.specialty} Specialists` : 'Book Appointments with Top Specialists'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing <strong className="text-[#0f172a] font-bold">{doctors.length}</strong> verified doctors in{' '}
              <strong className="text-[#1e3a8a]">{filters.city}</strong>
              {filters.area ? ` • ${filters.area}` : ''}
            </p>
          </div>

          {/* Quick Sort Dropdown */}
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Sort by:</span>
            <select
              id="doctor-sort-select"
              value={filters.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="recommended">Recommended (Default)</option>
              <option value="rating">Patient Rating: Highest First</option>
              <option value="experience">Years of Experience</option>
              <option value="fee_low">Consultation Fee: Low to High</option>
              <option value="fee_high">Consultation Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-2xs mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            
            {/* Consultation Mode Filter */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                id="filter-mode-all"
                onClick={() => onUpdateFilters({ mode: 'all' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.mode === 'all'
                    ? 'bg-white text-[#1e3a8a] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Modes
              </button>
              <button
                id="filter-mode-clinic"
                onClick={() => onUpdateFilters({ mode: 'in_clinic' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.mode === 'in_clinic'
                    ? 'bg-white text-[#1e3a8a] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In-Clinic
              </button>
              <button
                id="filter-mode-video"
                onClick={() => onUpdateFilters({ mode: 'video' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  filters.mode === 'video'
                    ? 'bg-white text-[#1e3a8a] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Video className="w-3.5 h-3.5 text-[#0284c7]" />
                Video Consult
              </button>
            </div>

            {/* Locality / Area Filter */}
            <select
              id="filter-area-select"
              value={filters.area}
              onChange={(e) => onUpdateFilters({ area: e.target.value })}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Areas ({filters.city})</option>
              {currentCityObj.popularAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>

            {/* Specialty Quick Filter Dropdown */}
            <select
              id="filter-specialty-select"
              value={filters.specialty}
              onChange={(e) => onUpdateFilters({ specialty: e.target.value })}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">All Specialties</option>
              {SPECIALTIES.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.doctorCount}+)
                </option>
              ))}
            </select>

            {/* Maximum Fee Filter */}
            <select
              id="filter-max-fee-select"
              value={filters.maxFee}
              onChange={(e) => onUpdateFilters({ maxFee: Number(e.target.value) })}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={2000}>Max Fee: Any</option>
              <option value={500}>Max Fee: ₹500</option>
              <option value={750}>Max Fee: ₹750</option>
              <option value={1000}>Max Fee: ₹1,000</option>
              <option value={1500}>Max Fee: ₹1,500</option>
            </select>

            {/* Gender Filter */}
            <select
              id="filter-gender-select"
              value={filters.gender}
              onChange={(e) => onUpdateFilters({ gender: e.target.value as any })}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Any Gender</option>
              <option value="female">Female Doctors</option>
              <option value="male">Male Doctors</option>
            </select>

            {/* Experience Filter */}
            <select
              id="filter-experience-select"
              value={filters.minExperience}
              onChange={(e) => onUpdateFilters({ minExperience: Number(e.target.value) })}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value={0}>Any Experience</option>
              <option value={10}>10+ Years Experience</option>
              <option value={15}>15+ Years Experience</option>
              <option value={20}>20+ Years Experience</option>
            </select>

            {/* Available Today Toggle */}
            <button
              id="filter-available-today-btn"
              onClick={() => onUpdateFilters({ availableTodayOnly: !filters.availableTodayOnly })}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                filters.availableTodayOnly
                  ? 'bg-blue-50 border-blue-300 text-[#1e3a8a]'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50/50'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                filters.availableTodayOnly ? 'bg-[#0284c7] border-[#0284c7] text-white' : 'border-slate-300'
              }`}>
                {filters.availableTodayOnly && <Check className="w-3 h-3" />}
              </div>
              <span>Available Today</span>
            </button>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                id="reset-all-filters-btn"
                onClick={onResetFilters}
                className="ml-auto text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-2 py-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-600">
              <span className="font-semibold text-slate-400">Active filters:</span>
              {filters.searchQuery && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Search: "{filters.searchQuery}"
                </span>
              )}
              {filters.specialty && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Specialty: {filters.specialty}
                </span>
              )}
              {filters.area && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Area: {filters.area}
                </span>
              )}
              {filters.mode !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Mode: {filters.mode === 'in_clinic' ? 'In-Clinic' : 'Video Consult'}
                </span>
              )}
              {filters.maxFee < 2000 && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Max Fee: ₹{filters.maxFee}
                </span>
              )}
              {filters.gender !== 'all' && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Gender: {filters.gender === 'female' ? 'Female' : 'Male'}
                </span>
              )}
              {filters.minExperience > 0 && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1e3a8a] font-medium border border-blue-200">
                  Experience: {filters.minExperience}+ yrs
                </span>
              )}
              {filters.availableTodayOnly && (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0284c7] font-medium border border-blue-200">
                  Available Today Only
                </span>
              )}
            </div>
          )}
        </div>

        {/* Doctor Results List */}
        {doctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center mx-auto mb-4">
              <Info className="w-8 h-8 text-[#0284c7]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              No doctors found matching your criteria
            </h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              We couldn't find any verified specialists in {filters.city} {filters.area ? `(${filters.area})` : ''} matching all your selected filters. Try broadening your criteria or resetting filters.
            </p>
            <button
              onClick={onResetFilters}
              className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] hover:from-[#172554] hover:to-[#0369a1] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {doctors.map((doctor) => {
              const supportsClinic = doctor.consultationModes.includes('in_clinic');
              const supportsVideo = doctor.consultationModes.includes('video');

              return (
                <div
                  key={doctor.id}
                  id={`doctor-card-${doctor.id}`}
                  className="bg-white/95 backdrop-blur-xs rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-blue-200 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Doctor Info Section */}
                  <div className="flex items-start gap-4 sm:gap-5 flex-1">
                    
                    {/* Doctor Avatar with Verified Badge */}
                    <div className="relative shrink-0">
                      <img
                        src={doctor.profileImage}
                        alt={doctor.name}
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      {doctor.isPractoVerified && (
                        <div className="absolute -bottom-1.5 -right-1.5 bg-[#0284c7] text-white rounded-full p-1 shadow-xs" title="Practo Verified Practitioner">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onViewDoctorProfile(doctor)}
                            className="text-base sm:text-lg font-black text-[#1e3a8a] hover:text-[#0284c7] transition-colors text-left cursor-pointer"
                          >
                            {doctor.name}
                          </button>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-[#0284c7] border border-blue-200">
                            Practo Verified
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {doctor.specialty} • {doctor.qualifications}
                        </p>
                      </div>

                      {/* Experience and Practice Years */}
                      <p className="text-xs text-slate-600 font-semibold">
                        {doctor.experienceYears} years experience overall
                      </p>

                      {/* Clinic & Location with Locality */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">{doctor.clinicName}</span>
                        <span>•</span>
                        <span className="font-bold text-slate-900">{doctor.area}</span>
                        <span className="text-slate-400">({doctor.city})</span>
                      </div>

                      {/* Patient Satisfaction & Reviews */}
                      <div className="flex items-center gap-3 pt-1">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#0284c7] text-white text-xs font-bold">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{doctor.rating}%</span>
                        </div>
                        <span className="text-xs text-slate-600 font-bold underline decoration-slate-300">
                          {doctor.reviewCount} Patient Stories
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* Consultation Mode Badges & Booking Section */}
                  <div className="w-full lg:w-72 pt-4 lg:pt-0 lg:border-l lg:border-slate-200 lg:pl-6 flex flex-col justify-between self-stretch shrink-0">
                    
                    <div>
                      {/* Availability Ticker */}
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0369a1] mb-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{doctor.nextAvailableSlot}</span>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="space-y-1 mb-4 text-xs">
                        {supportsClinic && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              Clinic Consultation Fee:
                            </span>
                            <strong className="text-sm font-extrabold text-slate-900">₹{doctor.consultationFee}</strong>
                          </div>
                        )}
                        {supportsVideo && (
                          <div className="flex items-center justify-between text-slate-600">
                            <span className="flex items-center gap-1">
                              <Video className="w-3.5 h-3.5 text-[#0284c7]" />
                              Video Consultation:
                            </span>
                            <strong className="text-sm font-bold text-[#1e3a8a]">₹{doctor.videoConsultFee}</strong>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {supportsClinic && (
                        <button
                          id={`book-clinic-btn-${doctor.id}`}
                          onClick={() => onBookDoctor(doctor, 'in_clinic')}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] hover:from-[#172554] hover:to-[#0369a1] text-white text-xs font-bold transition-all shadow-md shadow-blue-950/15 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-200" />
                          <span>Book Clinic Visit</span>
                        </button>
                      )}

                      {supportsVideo && (
                        <button
                          id={`book-video-btn-${doctor.id}`}
                          onClick={() => onBookDoctor(doctor, 'video')}
                          className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                            supportsClinic
                              ? 'bg-white hover:bg-blue-50 text-[#1e3a8a] border-slate-200'
                              : 'bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] text-white'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5 text-[#0284c7]" />
                          <span>Video Consult (₹{doctor.videoConsultFee})</span>
                        </button>
                      )}

                      <button
                        id={`view-profile-btn-${doctor.id}`}
                        onClick={() => onViewDoctorProfile(doctor)}
                        className="w-full text-center text-xs font-semibold text-slate-500 hover:text-[#1e3a8a] transition-colors pt-1 cursor-pointer"
                      >
                        View Full Profile & Timings
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
