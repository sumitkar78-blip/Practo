/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { ServiceCategories } from './components/ServiceCategories';
import { DoctorListing } from './components/DoctorListing';
import { BookingModal } from './components/BookingModal';
import { MyAppointmentsModal } from './components/MyAppointmentsModal';
import { DoctorDetailModal } from './components/DoctorDetailModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TrustStats } from './components/TrustStats';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { InfoModal, InfoModalType } from './components/InfoModal';
import { DOCTORS } from './data/mockData';
import { Doctor, Appointment, FilterState } from './types';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { 
  getStoredAppointments, 
  saveStoredAppointments, 
  DEFAULT_DEMO_APPOINTMENTS 
} from './utils/storage';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [filters, setFilters] = useState<FilterState>({
    specialty: '',
    city: 'Delhi NCR',
    area: '',
    searchQuery: '',
    mode: 'all',
    gender: 'all',
    minExperience: 0,
    minRating: 0,
    maxFee: 2000,
    availableTodayOnly: false,
    sortBy: 'recommended',
  });

  // Modals state
  const [isAppointmentsOpen, setIsAppointmentsOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingMode, setBookingMode] = useState<'in_clinic' | 'video'>('in_clinic');
  const [detailDoctor, setDetailDoctor] = useState<Doctor | null>(null);
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Persistent Appointments state with safe storage helper
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return getStoredAppointments();
  });

  useEffect(() => {
    saveStoredAppointments(appointments);
  }, [appointments]);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Keep city in filter state synced and reset area when city changes
  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setSelectedArea('');
    setFilters((prev) => ({ ...prev, city, area: '' }));
    showToast(`Showing verified doctors in ${city}`, 'info');
  };

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setFilters((prev) => ({ ...prev, area }));
    if (area) {
      showToast(`Filtered by ${area}, ${selectedCity}`, 'info');
    }
  };

  // Synchronize search input into filter state
  const handleExecuteSearch = () => {
    setFilters((prev) => ({ ...prev, searchQuery }));
    const doctorsSection = document.getElementById('doctors-section');
    if (doctorsSection) {
      doctorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSpecialty = (specialtyName: string) => {
    setFilters((prev) => ({
      ...prev,
      specialty: specialtyName,
    }));
    const doctorsSection = document.getElementById('doctors-section');
    if (doctorsSection) {
      doctorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceCard = (serviceId: string) => {
    if (serviceId === 'instant-video') {
      setFilters((prev) => ({ ...prev, mode: 'video' }));
    } else if (serviceId === 'find-doctors') {
      setFilters((prev) => ({ ...prev, mode: 'in_clinic' }));
    }
    const doctorsSection = document.getElementById('doctors-section');
    if (doctorsSection) {
      doctorsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleUpdateFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      if (newFilters.area !== undefined) {
        setSelectedArea(newFilters.area);
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setFilters({
      specialty: '',
      city: selectedCity,
      area: '',
      searchQuery: '',
      mode: 'all',
      gender: 'all',
      minExperience: 0,
      minRating: 0,
      maxFee: 2000,
      availableTodayOnly: false,
      sortBy: 'recommended',
    });
    showToast('Filters reset to default', 'info');
  };

  // Open booking modal
  const handleBookDoctor = (doctor: Doctor, mode?: 'in_clinic' | 'video') => {
    setBookingDoctor(doctor);
    setBookingMode(mode || 'in_clinic');
  };

  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`Appointment confirmed with ${newAppointment.doctorName}!`, 'success');
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'cancelled' as const } : apt
      )
    );
    showToast('Appointment cancelled. The time slot is now available.', 'info');
  };

  const handleResetDemoAppointments = () => {
    setAppointments(DEFAULT_DEMO_APPOINTMENTS);
    saveStoredAppointments(DEFAULT_DEMO_APPOINTMENTS);
    showToast('Demo appointments reset to initial state.', 'info');
  };

  // Quick book doctor from testimonials
  const handleBookSpecificDoctor = (doctorName: string) => {
    const doc = DOCTORS.find((d) => d.name === doctorName) || DOCTORS[0];
    handleBookDoctor(doc, 'in_clinic');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter and sort doctor collection
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      // 1. City match (support 'Delhi' & 'Delhi NCR' interchangeably)
      if (filters.city) {
        const filterCity = filters.city.toLowerCase().trim();
        const docCity = doc.city.toLowerCase().trim();
        const isDelhiMatch =
          (filterCity.includes('delhi') && docCity.includes('delhi'));
        if (!isDelhiMatch && docCity !== filterCity) {
          return false;
        }
      }

      // 2. Area / Locality match
      if (filters.area && filters.area.trim()) {
        if (doc.area.toLowerCase() !== filters.area.toLowerCase().trim()) {
          return false;
        }
      }

      // 3. Consultation Mode match
      if (filters.mode === 'in_clinic' && !doc.consultationModes.includes('in_clinic')) {
        return false;
      }
      if (filters.mode === 'video' && !doc.consultationModes.includes('video')) {
        return false;
      }

      // 4. Maximum Fee match
      if (filters.maxFee < 2000) {
        if (filters.mode === 'video') {
          if (doc.videoConsultFee > filters.maxFee) return false;
        } else if (filters.mode === 'in_clinic') {
          if (doc.consultationFee > filters.maxFee) return false;
        } else {
          // If all modes, match if either consultation mode fee is within user budget
          if (doc.consultationFee > filters.maxFee && doc.videoConsultFee > filters.maxFee) {
            return false;
          }
        }
      }

      // 5. Specialty match
      if (filters.specialty) {
        if (doc.specialty.toLowerCase() !== filters.specialty.toLowerCase()) {
          return false;
        }
      }

      // 6. Search query match (name, specialty, clinic, area, city, services, subSpecialties)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpecialty = doc.specialty.toLowerCase().includes(q);
        const matchesClinic = doc.clinicName.toLowerCase().includes(q);
        const matchesArea = doc.area.toLowerCase().includes(q);
        const matchesCity = doc.city.toLowerCase().includes(q);
        const matchesQual = doc.qualifications.toLowerCase().includes(q);
        const matchesService = doc.services.some((s) => s.toLowerCase().includes(q));
        const matchesSubSpec = doc.subSpecialties.some((s) => s.toLowerCase().includes(q));
        
        if (
          !matchesName && 
          !matchesSpecialty && 
          !matchesClinic && 
          !matchesArea && 
          !matchesCity && 
          !matchesQual && 
          !matchesService && 
          !matchesSubSpec
        ) {
          return false;
        }
      }

      // 7. Gender match
      if (filters.gender !== 'all' && doc.gender !== filters.gender) {
        return false;
      }

      // 8. Experience match
      if (filters.minExperience > 0 && doc.experienceYears < filters.minExperience) {
        return false;
      }

      // 9. Rating match
      if (filters.minRating > 0 && doc.rating < filters.minRating) {
        return false;
      }

      // 10. Availability match
      if (filters.availableTodayOnly && !doc.availableToday) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'experience') {
        return b.experienceYears - a.experienceYears;
      }
      if (filters.sortBy === 'fee_low') {
        return a.consultationFee - b.consultationFee;
      }
      if (filters.sortBy === 'fee_high') {
        return b.consultationFee - a.consultationFee;
      }
      return 0;
    });
  }, [filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-[#14bef0]/20 selection:text-[#28328c]">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
          <div className="bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-700 text-xs sm:text-sm">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0" />
            )}
            <span className="font-medium">{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              aria-label="Close notification"
              className="text-slate-400 hover:text-white p-1 ml-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        appointments={appointments}
        onOpenAppointments={() => setIsAppointmentsOpen(true)}
        onNavigateToSection={scrollToSection}
        onSelectSpecialty={handleSelectSpecialty}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section with Dual Search Bar & Real Geolocation City Selector */}
        <HeroSearch
          selectedCity={selectedCity}
          onSelectCity={handleSelectCity}
          selectedArea={selectedArea}
          onSelectArea={handleSelectArea}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onExecuteSearch={handleExecuteSearch}
          onSelectSpecialtyChip={handleSelectSpecialty}
        />

        {/* Clear Service Categories & Medical Specialties */}
        <ServiceCategories
          selectedSpecialty={filters.specialty}
          onSelectSpecialty={handleSelectSpecialty}
          onSelectServiceCard={handleSelectServiceCard}
        />

        {/* Doctor Finder & Appointment Listing Experience */}
        <DoctorListing
          doctors={filteredDoctors}
          allDoctorsCount={DOCTORS.length}
          filters={filters}
          onUpdateFilters={handleUpdateFilters}
          onResetFilters={handleResetFilters}
          onBookDoctor={handleBookDoctor}
          onViewDoctorDetails={setDetailDoctor}
        />

        {/* Doctor Testimonials & Real Patient Stories */}
        <TestimonialsSection
          onBookSpecificDoctor={handleBookSpecificDoctor}
        />

        {/* Trust & Safety Stats */}
        <TrustStats />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer 
        onSelectCity={handleSelectCity}
        onOpenInfo={setInfoModalType}
      />

      {/* Interactive Booking Modal Flow with Double Booking Prevention */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          initialMode={bookingMode}
          existingAppointments={appointments}
          onClose={() => setBookingDoctor(null)}
          onAppointmentBooked={handleAppointmentBooked}
          onOpenAppointments={() => setIsAppointmentsOpen(true)}
        />
      )}

      {/* My Appointments Drawer / Management Modal */}
      <MyAppointmentsModal
        isOpen={isAppointmentsOpen}
        onClose={() => setIsAppointmentsOpen(false)}
        appointments={appointments}
        onCancelAppointment={handleCancelAppointment}
        onFindDoctors={() => scrollToSection('doctors-section')}
        onResetDemoAppointments={handleResetDemoAppointments}
      />

      {/* Doctor Detailed Profile Modal */}
      <DoctorDetailModal
        doctor={detailDoctor}
        onClose={() => setDetailDoctor(null)}
        onBook={handleBookDoctor}
      />

      {/* Legal & Directory Info Modal */}
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

    </div>
  );
}
