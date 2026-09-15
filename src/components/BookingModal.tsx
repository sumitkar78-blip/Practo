import React, { useState, useEffect } from 'react';
import { 
  Doctor, 
  Appointment 
} from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Phone, 
  Mail, 
  AlertCircle,
  Download,
  Share2,
  Building2,
  ChevronRight,
  Sparkles,
  CreditCard,
  Lock,
  Info
} from 'lucide-react';
import { isSlotAlreadyBooked } from '../utils/storage';

interface BookingModalProps {
  doctor: Doctor | null;
  initialMode: 'in_clinic' | 'video';
  existingAppointments: Appointment[];
  onClose: () => void;
  onAppointmentBooked: (appointment: Appointment) => void;
  onOpenAppointments: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  doctor,
  initialMode,
  existingAppointments,
  onClose,
  onAppointmentBooked,
  onOpenAppointments,
}) => {
  if (!doctor) return null;

  // Consultation mode state
  const [mode, setMode] = useState<'in_clinic' | 'video'>(() => {
    if (doctor.consultationModes.includes(initialMode)) return initialMode;
    return doctor.consultationModes[0] || 'in_clinic';
  });

  // Generate next 5 upcoming days
  const today = new Date();
  const dateOptions = Array.from({ length: 6 }).map((_, idx) => {
    const d = new Date(today);
    d.setDate(today.getDate() + idx);
    const dayNameShort = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayDisplay = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNameShort;
    const formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const isoString = d.toISOString().split('T')[0];
    const isDoctorPracticing = doctor.availableDays.includes(dayNameShort);
    return { dayNameShort, dayDisplay, formattedDate, isoString, isDoctorPracticing };
  });

  // Find first practicing date
  const defaultDate = dateOptions.find((d) => d.isDoctorPracticing)?.isoString || dateOptions[0].isoString;
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);

  // Doctor-specific slots
  const slotsMorning = doctor.availableSlots.morning || [];
  const slotsAfternoon = doctor.availableSlots.afternoon || [];
  const slotsEvening = doctor.availableSlots.evening || [];

  // Default selected slot to first available unbooked slot
  const [selectedSlot, setSelectedSlot] = useState<string>(() => {
    const all = [...slotsMorning, ...slotsAfternoon, ...slotsEvening];
    for (const s of all) {
      if (!isSlotAlreadyBooked(existingAppointments, doctor.id, defaultDate, s, mode)) {
        return s;
      }
    }
    return all[0] || '10:00 AM';
  });

  const [selectedPeriod, setSelectedPeriod] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  // Step management: 1: Slot Select -> 2: Patient Form -> 3: Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Patient info state (starts empty or with clear demo indicators)
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'male' | 'female' | 'other'>('female');
  const [symptoms, setSymptoms] = useState('');
  const [paymentOption, setPaymentOption] = useState<'pay_at_clinic' | 'pay_online_demo'>('pay_at_clinic');
  const [showSandboxNotice, setShowSandboxNotice] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slotError, setSlotError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Escape key closing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // When date or mode changes, clear slot error
  useEffect(() => {
    setSlotError(null);
  }, [selectedDate, mode, selectedSlot]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const trimmedName = patientName.trim();
    if (!trimmedName) {
      newErrors.patientName = 'Patient full name is required';
    } else if (trimmedName.length < 3) {
      newErrors.patientName = 'Name must be at least 3 characters';
    }

    const cleanPhone = patientPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.patientPhone = 'Mobile number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.patientPhone = 'Please enter a valid 10-digit mobile number';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patientEmail.trim()) {
      newErrors.patientEmail = 'Email address is required for appointment pass';
    } else if (!emailRegex.test(patientEmail.trim())) {
      newErrors.patientEmail = 'Please enter a valid email address';
    }

    const ageNum = parseInt(patientAge, 10);
    if (!patientAge) {
      newErrors.patientAge = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.patientAge = 'Please enter a valid age (1-120)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToDetails = () => {
    // Check if slot is already booked
    if (isSlotAlreadyBooked(existingAppointments, doctor.id, selectedDate, selectedSlot, mode)) {
      setSlotError(`The slot "${selectedSlot}" on ${selectedDate} has already been booked. Please choose a different time.`);
      return;
    }
    setSlotError(null);
    setCurrentStep(2);
  };

  const handleConfirmBooking = () => {
    if (!validateForm()) return;

    // Double check that slot wasn't booked in the interim
    if (isSlotAlreadyBooked(existingAppointments, doctor.id, selectedDate, selectedSlot, mode)) {
      setSlotError(`Double booking prevented: This slot (${selectedSlot} on ${selectedDate}) is already booked.`);
      setCurrentStep(1);
      return;
    }

    const bookingRef = `PRC-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = mode === 'in_clinic' ? doctor.consultationFee : doctor.videoConsultFee;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookingRef,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialty: doctor.specialty,
      doctorQualifications: doctor.qualifications,
      doctorImage: doctor.profileImage,
      clinicName: doctor.clinicName,
      clinicAddress: doctor.clinicAddress,
      mode,
      date: selectedDate,
      timeSlot: selectedSlot,
      slotPeriod: selectedPeriod,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      patientAge: Number(patientAge) || 28,
      patientGender,
      symptoms: symptoms.trim() || 'General Consultation',
      consultationFee: fee,
      paymentMethod: paymentOption,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setConfirmedBooking(newAppointment);
    onAppointmentBooked(newAppointment);
    setCurrentStep(3);
  };

  const handleSlotSelect = (slotTime: string, period: 'morning' | 'afternoon' | 'evening') => {
    const isBooked = isSlotAlreadyBooked(existingAppointments, doctor.id, selectedDate, slotTime, mode);
    if (isBooked) {
      setSlotError(`Slot ${slotTime} is already booked. Please choose another time.`);
      return;
    }
    setSlotError(null);
    setSelectedSlot(slotTime);
    setSelectedPeriod(period);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#28328c] uppercase tracking-wider">
              {currentStep === 1 && 'Step 1 of 2: Select Date & Time Slot'}
              {currentStep === 2 && 'Step 2 of 2: Patient Details'}
              {currentStep === 3 && 'Booking Confirmed!'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Doctor Summary Banner */}
        <div className="px-5 sm:px-6 py-3.5 bg-gradient-to-r from-blue-50/70 to-indigo-50/40 border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={doctor.profileImage}
              alt={doctor.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm sm:text-base font-extrabold text-[#28328c]">
                  {doctor.name}
                </h3>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">
                {doctor.specialty} • {doctor.clinicName} ({doctor.area}, {doctor.city})
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Consultation Fee</span>
            <span className="text-base font-black text-slate-900">
              ₹{mode === 'in_clinic' ? doctor.consultationFee : doctor.videoConsultFee}
            </span>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* STEP 1: Date, Mode & Slot Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              
              {/* Consultation Mode Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Choose Consultation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {doctor.consultationModes.includes('in_clinic') && (
                    <button
                      type="button"
                      onClick={() => setMode('in_clinic')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        mode === 'in_clinic'
                          ? 'border-[#28328c] bg-blue-50/60 shadow-xs ring-2 ring-[#28328c]/15'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Building2 className={`w-4 h-4 ${mode === 'in_clinic' ? 'text-[#28328c]' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-900">₹{doctor.consultationFee}</span>
                      </div>
                      <strong className="block text-xs sm:text-sm font-bold text-slate-900">In-Clinic Visit</strong>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{doctor.clinicAddress}</span>
                    </button>
                  )}

                  {doctor.consultationModes.includes('video') && (
                    <button
                      type="button"
                      onClick={() => setMode('video')}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        mode === 'video'
                          ? 'border-[#28328c] bg-blue-50/60 shadow-xs ring-2 ring-[#28328c]/15'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Video className={`w-4 h-4 ${mode === 'video' ? 'text-[#14bef0]' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-[#28328c]">₹{doctor.videoConsultFee}</span>
                      </div>
                      <strong className="block text-xs sm:text-sm font-bold text-slate-900">Online Video Consult</strong>
                      <span className="text-[11px] text-slate-500">HD Room link sent via WhatsApp & SMS</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Date Selection Pills */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Select Date (Doctor practices: {doctor.availableDays.join(', ')})
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt.isoString;
                    const isDisabled = !opt.isDoctorPracticing;

                    return (
                      <button
                        key={opt.isoString}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setSelectedDate(opt.isoString)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isDisabled
                            ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed text-slate-400'
                            : isSelected
                            ? 'bg-[#28328c] text-white border-[#28328c] shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="block text-[11px] font-bold uppercase">{opt.dayDisplay}</span>
                        <strong className="block text-xs font-extrabold mt-0.5">{opt.formattedDate}</strong>
                        {isDisabled && (
                          <span className="text-[9px] block text-slate-400 mt-0.5">Off</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Double Booking Warning / Error Banner */}
              {slotError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{slotError}</span>
                </div>
              )}

              {/* Time Slots Section (Doctor-Specific) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Available Time Slots for {selectedDate}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {mode === 'in_clinic' ? 'Clinic Slot' : 'Video Slot'}
                  </span>
                </div>

                {/* Morning Slots */}
                {slotsMorning.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Morning Slots
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slotsMorning.map((slot) => {
                        const isBooked = isSlotAlreadyBooked(existingAppointments, doctor.id, selectedDate, slot, mode);
                        const isSelected = selectedSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSlotSelect(slot, 'morning')}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isBooked
                                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-[#28328c] text-white border-[#28328c] shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{slot}</span>
                            {isBooked && <span className="text-[9px] text-rose-500 font-normal no-underline">(Booked)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Afternoon Slots */}
                {slotsAfternoon.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Afternoon Slots
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slotsAfternoon.map((slot) => {
                        const isBooked = isSlotAlreadyBooked(existingAppointments, doctor.id, selectedDate, slot, mode);
                        const isSelected = selectedSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSlotSelect(slot, 'afternoon')}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isBooked
                                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-[#28328c] text-white border-[#28328c] shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{slot}</span>
                            {isBooked && <span className="text-[9px] text-rose-500 font-normal no-underline">(Booked)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Evening Slots */}
                {slotsEvening.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Evening Slots
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slotsEvening.map((slot) => {
                        const isBooked = isSlotAlreadyBooked(existingAppointments, doctor.id, selectedDate, slot, mode);
                        const isSelected = selectedSlot === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => handleSlotSelect(slot, 'evening')}
                            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isBooked
                                ? 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed opacity-60'
                                : isSelected
                                ? 'bg-[#28328c] text-white border-[#28328c] shadow-xs'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{slot}</span>
                            {isBooked && <span className="text-[9px] text-rose-500 font-normal no-underline">(Booked)</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* STEP 2: Patient Form & Payment Preference */}
          {currentStep === 2 && (
            <div className="space-y-4">
              
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Booking Slot:</span>
                  <strong className="text-[#28328c] font-bold text-sm">
                    {selectedDate} at {selectedSlot} ({mode === 'in_clinic' ? 'In-Clinic Visit' : 'Video Consult'})
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-[#28328c] hover:underline cursor-pointer"
                >
                  Change Slot
                </button>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Patient Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Patient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                        errors.patientName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                      }`}
                    />
                  </div>
                  {errors.patientName && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.patientName}</p>
                  )}
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mobile Number (10 digits) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      maxLength={10}
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                        errors.patientPhone ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                      }`}
                    />
                  </div>
                  {errors.patientPhone && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.patientPhone}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                        errors.patientEmail ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                      }`}
                    />
                  </div>
                  {errors.patientEmail && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.patientEmail}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Patient Age <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={120}
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    placeholder="e.g. 30"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                      errors.patientAge ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-300 focus:ring-blue-200'
                    }`}
                  />
                  {errors.patientAge && (
                    <p className="text-[11px] text-rose-600 font-semibold mt-1">{errors.patientAge}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Symptoms / Reason */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Brief Symptoms or Reason for Visit
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Mild fever since yesterday, routine skin evaluation..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

              </div>

              {/* Payment Flow (Proper separation of Pay at Clinic vs Simulated Sandbox Demo) */}
              <div className="pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Payment Preference
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: Pay at Clinic / Later (Recommended) */}
                  <div
                    onClick={() => {
                      setPaymentOption('pay_at_clinic');
                      setShowSandboxNotice(false);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentOption === 'pay_at_clinic'
                        ? 'border-[#28328c] bg-blue-50/50 shadow-xs ring-2 ring-[#28328c]/15'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs font-bold text-slate-900">
                        {mode === 'in_clinic' ? 'Pay at Clinic' : 'Pay After Video Consult'}
                      </strong>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Zero Advance
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      No online payment required now. Pay directly via cash, UPI, or card at the clinic desk.
                    </p>
                  </div>

                  {/* Option 2: Pay Online (Sandbox Demo Simulator) */}
                  <div
                    onClick={() => {
                      setPaymentOption('pay_online_demo');
                      setShowSandboxNotice(true);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      paymentOption === 'pay_online_demo'
                        ? 'border-[#28328c] bg-blue-50/50 shadow-xs ring-2 ring-[#28328c]/15'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-xs font-bold text-slate-900">
                        Pay Online (Sandbox Demo)
                      </strong>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Demo Mode
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Simulated payment flow. In production, Razorpay/Stripe SDK will be invoked securely.
                    </p>
                  </div>

                </div>

                {showSandboxNotice && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block">Developer / Demo Notice:</strong>
                      <span>
                        No real transaction will occur. This is a frontend demo sandbox. To integrate real transactions, connect a backend service with Razorpay or Stripe webhook endpoints.
                      </span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* STEP 3: Booking Confirmation Pass */}
          {currentStep === 3 && confirmedBooking && (
            <div className="space-y-6 text-center py-2">
              
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs inline-block mb-2">
                  Confirmed & Verified
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#28328c]">
                  Appointment Successfully Scheduled!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  We've sent a digital appointment pass with location map link to {confirmedBooking.patientPhone} and {confirmedBooking.patientEmail}.
                </p>
              </div>

              {/* Digital Pass Ticket Card */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-left space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                      Booking Reference ID
                    </span>
                    <strong className="text-sm sm:text-base font-black text-[#28328c] font-mono">
                      {confirmedBooking.bookingRef}
                    </strong>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-100 text-[#28328c]">
                    {confirmedBooking.mode === 'in_clinic' ? 'In-Clinic Visit' : 'Video Consultation'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Doctor</span>
                    <strong className="text-slate-800 text-sm block">{confirmedBooking.doctorName}</strong>
                    <span className="text-slate-500">{confirmedBooking.doctorSpecialty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Scheduled Date & Time</span>
                    <strong className="text-slate-800 text-sm block">{confirmedBooking.date}</strong>
                    <span className="text-[#28328c] font-bold">{confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Patient Name</span>
                    <strong className="text-slate-800 block">{confirmedBooking.patientName}</strong>
                    <span className="text-slate-500">{confirmedBooking.patientPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Payment Status</span>
                    <strong className="text-slate-800 block">₹{confirmedBooking.consultationFee}</strong>
                    <span className="text-emerald-700 font-semibold">
                      {confirmedBooking.paymentMethod === 'pay_online_demo' ? 'Paid (Sandbox Demo)' : 'Pay at Clinic Desk'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Location / Room: </span>
                  {confirmedBooking.mode === 'in_clinic' ? (
                    <span>{confirmedBooking.clinicName} — {confirmedBooking.clinicAddress}</span>
                  ) : (
                    <span>Private Video Call Room (Link active 10 mins prior to appointment)</span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAppointments();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#28328c] hover:bg-[#1f276f] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  View in My Appointments
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {currentStep !== 3 && (
          <div className="bg-slate-50 px-5 sm:px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            {currentStep === 1 ? (
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Free Booking • Zero Cancellation Fee
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Back to Slot Selection
              </button>
            )}

            {currentStep === 1 ? (
              <button
                id="booking-next-step-btn"
                type="button"
                onClick={handleProceedToDetails}
                className="px-6 py-2.5 rounded-xl bg-[#28328c] hover:bg-[#1f276f] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/15 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Continue to Patient Details</span>
                <ChevronRight className="w-4 h-4 text-cyan-300" />
              </button>
            ) : (
              <button
                id="booking-confirm-btn"
                type="button"
                onClick={handleConfirmBooking}
                className="px-6 py-2.5 rounded-xl bg-[#28328c] hover:bg-[#1f276f] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/15 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Confirm Appointment</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
