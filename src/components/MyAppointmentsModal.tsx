import React, { useState, useEffect } from 'react';
import { Appointment } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Trash2,
  Phone,
  FileText,
  RotateCcw,
  Search
} from 'lucide-react';

interface MyAppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onFindDoctors: () => void;
  onResetDemoAppointments?: () => void;
}

export const MyAppointmentsModal: React.FC<MyAppointmentsModalProps> = ({
  isOpen,
  onClose,
  appointments,
  onCancelAppointment,
  onFindDoctors,
  onResetDemoAppointments,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredList = appointments.filter((apt) => {
    if (filterTab === 'confirmed' && apt.status !== 'confirmed') return false;
    if (filterTab === 'cancelled' && apt.status !== 'cancelled') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchDoc = apt.doctorName.toLowerCase().includes(q);
      const matchPatient = apt.patientName.toLowerCase().includes(q);
      const matchRef = apt.bookingRef.toLowerCase().includes(q);
      const matchSpecialty = apt.doctorSpecialty.toLowerCase().includes(q);
      return matchDoc || matchPatient || matchRef || matchSpecialty;
    }
    return true;
  });

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="bg-slate-50 px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#28328c] text-white flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                My Appointments ({appointments.length})
              </h3>
              <p className="text-xs text-slate-500">
                Manage upcoming doctor visits, video links & passes
              </p>
            </div>
          </div>
          <button
            id="close-my-appointments-btn"
            onClick={onClose}
            aria-label="Close appointments modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        {appointments.length > 0 && (
          <div className="px-5 sm:px-6 py-3 border-b border-slate-100 bg-white flex flex-col sm:flex-row gap-2 items-center justify-between shrink-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterTab === 'all'
                    ? 'bg-white text-[#28328c] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({appointments.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('confirmed')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterTab === 'confirmed'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Confirmed ({appointments.filter(a => a.status === 'confirmed').length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('cancelled')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterTab === 'cancelled'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments..."
                className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {appointments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-[#28328c] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-[#14bef0]" />
              </div>
              <h4 className="text-base font-bold text-slate-900">No Appointments Booked Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Discover top verified specialists across specialties and book your confirmed slot in under 2 minutes.
              </p>
              <button
                id="empty-find-doctors-cta"
                onClick={() => {
                  onClose();
                  onFindDoctors();
                }}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#28328c] hover:bg-[#1f276f] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Find & Book Doctors Now
              </button>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No appointments matching your current tab or search criteria.
            </div>
          ) : (
            filteredList.map((apt) => (
              <div
                key={apt.id}
                id={`appointment-card-${apt.id}`}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  apt.status === 'cancelled'
                    ? 'border-slate-200 bg-slate-50/70 opacity-70'
                    : 'border-slate-200 bg-white shadow-xs hover:border-blue-200'
                }`}
              >
                {/* Doctor Row */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={apt.doctorImage}
                      alt={apt.doctorName}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {apt.doctorName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {apt.doctorSpecialty}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Ref: {apt.bookingRef}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
                    apt.status === 'cancelled'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : apt.mode === 'video'
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}>
                    {apt.status === 'cancelled' ? (
                      'Cancelled'
                    ) : apt.mode === 'video' ? (
                      <>
                        <Video className="w-3.5 h-3.5" />
                        Video Consult
                      </>
                    ) : (
                      <>
                        <Building2 className="w-3.5 h-3.5" />
                        Clinic Visit
                      </>
                    )}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Date & Time</span>
                    <strong className="text-slate-800 font-bold block">
                      {apt.date}
                    </strong>
                    <span className="text-[#28328c] font-semibold">{apt.timeSlot}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-semibold">Patient</span>
                    <strong className="text-slate-800 font-bold block">
                      {apt.patientName}
                    </strong>
                    <span className="text-slate-500">{apt.patientPhone}</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block font-semibold">Consultation Fee</span>
                    <strong className="text-slate-800 font-bold block">
                      ₹{apt.consultationFee}
                    </strong>
                    <span className="text-slate-500 text-[11px]">
                      {apt.paymentMethod === 'pay_online_demo' ? 'Paid (Sandbox Demo)' : 'Pay at Clinic Desk'}
                    </span>
                  </div>
                </div>

                {/* Location / Video link */}
                <div className="bg-slate-50 p-2.5 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                  {apt.mode === 'in_clinic' ? (
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#14bef0] shrink-0" />
                      <span className="truncate">{apt.clinicName} — {apt.clinicAddress}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#28328c] font-medium">
                      <Video className="w-3.5 h-3.5 text-[#14bef0] shrink-0" />
                      <span>HD Video Consultation Room will open 10 mins prior to slot</span>
                    </div>
                  )}

                  {apt.status === 'confirmed' && (
                    <button
                      id={`cancel-apt-btn-${apt.id}`}
                      type="button"
                      onClick={() => onCancelAppointment(apt.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 ml-2 shrink-0 hover:underline cursor-pointer"
                    >
                      Cancel Visit
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer info & CTA */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500">
            Changes and cancellations are 100% penalty-free.
          </span>
          {onResetDemoAppointments && (
            <button
              onClick={onResetDemoAppointments}
              className="text-[11px] font-bold text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
            >
              Reset Demo Appointments
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
