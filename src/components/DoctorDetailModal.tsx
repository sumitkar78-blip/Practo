import React, { useEffect } from 'react';
import { Doctor } from '../types';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Video, 
  Building2, 
  Languages, 
  GraduationCap, 
  CheckCircle2, 
  ThumbsUp,
  Calendar
} from 'lucide-react';

interface DoctorDetailModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBook: (doctor: Doctor, mode: 'in_clinic' | 'video') => void;
}

export const DoctorDetailModal: React.FC<DoctorDetailModalProps> = ({
  doctor,
  onClose,
  onBook,
}) => {
  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && doctor) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [doctor, onClose]);

  if (!doctor) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="doctor-modal-title"
    >
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#28328c] uppercase tracking-wider">
              Practo Verified Medical Profile
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close doctor details"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row items-start gap-5 border-b border-slate-100 pb-6">
            <div className="relative shrink-0">
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              {doctor.isPractoVerified && (
                <div 
                  title="Practo Verified Practitioner"
                  className="absolute -bottom-2 -right-2 bg-emerald-600 text-white rounded-full p-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="space-y-2 flex-1">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 id="doctor-modal-title" className="text-xl sm:text-2xl font-black text-[#28328c]">
                    {doctor.name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {doctor.title}
                </p>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  {doctor.qualifications}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{doctor.rating}%</span>
                </div>
                <span className="text-xs text-slate-600 font-bold">
                  {doctor.reviewCount} Patient Votes
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-600 font-medium">
                  {doctor.experienceYears} Years Experience Overall
                </span>
              </div>
            </div>
          </div>

          {/* About & Bio */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About Doctor
            </h4>
            <p className="text-slate-700 leading-relaxed">
              {doctor.about}
            </p>
          </div>

          {/* Clinic & Location Info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Primary Clinic & Practice
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">Clinic & Address</span>
                <strong className="text-slate-800 text-sm block">{doctor.clinicName}</strong>
                <span className="text-slate-500">
                  {doctor.area ? `${doctor.area}, ` : ''}{doctor.clinicAddress} ({doctor.city})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">Timings</span>
                <strong className="text-slate-800 block">{doctor.clinicTimings}</strong>
                <span className="text-emerald-700 font-semibold block mt-0.5">
                  Available Days: {doctor.availableDays.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Services & Treatments Offered */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Services & Procedures Handled
            </h4>
            <div className="flex flex-wrap gap-2">
              {doctor.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#28328c] text-xs font-semibold border border-blue-100 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14bef0]" />
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Education & Qualifications */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Education & Fellowships
            </h4>
            <div className="space-y-1.5">
              {doctor.education.map((edu) => (
                <div key={edu} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{edu}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages Spoken */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Languages Spoken
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <Languages className="w-4 h-4 text-slate-400" />
              <span>{doctor.languages.join(', ')}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Clinic Visit Fee:</span>
              <strong className="text-sm font-extrabold text-slate-900">₹{doctor.consultationFee}</strong>
            </div>
            <div className="border-l border-slate-200 pl-4">
              <span className="text-slate-400 block font-medium">Video Fee:</span>
              <strong className="text-sm font-bold text-[#28328c]">₹{doctor.videoConsultFee}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {doctor.consultationModes.includes('video') && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBook(doctor, 'video');
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-[#28328c] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Video className="w-4 h-4 text-[#14bef0]" />
                <span>Video Consult</span>
              </button>
            )}

            {doctor.consultationModes.includes('in_clinic') && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onBook(doctor, 'in_clinic');
                }}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#28328c] hover:bg-[#1f276f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/15 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-cyan-300" />
                <span>Book Clinic Visit</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
