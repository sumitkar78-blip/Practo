import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, Building2, ExternalLink } from 'lucide-react';

export type InfoModalType = 'privacy' | 'terms' | 'directory' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!type) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#0284c7]" />}
            {type === 'terms' && <FileText className="w-5 h-5 text-[#1e3a8a]" />}
            {type === 'directory' && <Building2 className="w-5 h-5 text-[#0369a1]" />}
            <h3 className="text-base font-bold text-[#0f172a]">
              {type === 'privacy' && 'Practo Privacy & Health Data Policy'}
              {type === 'terms' && 'Terms & Conditions of Service'}
              {type === 'directory' && 'National Healthcare Practitioner Directory'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {type === 'privacy' && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-[#1e3a8a] mb-4">
                <strong className="block text-sm font-bold mb-1">Your Medical Privacy is Our Foundation</strong>
                <span>Practo adheres strictly to HIPAA standards, ISO 27001 data security, and Indian Digital Personal Data Protection guidelines.</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">1. Data Encryption & Storage</h4>
              <p>All sensitive health records, consultation notes, and video audio streams are protected using 256-bit AES encryption both in transit and at rest. Your health records are never sold or monetized to third-party insurance providers or advertisers.</p>
              <h4 className="font-bold text-slate-900 text-sm">2. Practitioner Access Controls</h4>
              <p>Only the specific certified doctor you book an appointment with receives temporary, role-based access to your consultation symptoms and medical history during the active appointment lifecycle.</p>
              <h4 className="font-bold text-slate-900 text-sm">3. Patient Data Rights</h4>
              <p>You retain absolute ownership of your clinical information. You may export or permanently delete your appointment records and test reports at any time via your account settings.</p>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-sky-900 mb-4">
                <strong className="block text-sm font-bold mb-1">Fair & Transparent Patient Terms</strong>
                <span>Clear guidelines guaranteeing zero unexpected fees and patient-first flexibility.</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">1. Zero Cancellation Penalty</h4>
              <p>Appointments may be cancelled or rescheduled up to 30 minutes prior to the booked slot with zero cancellation charges or penalty fees.</p>
              <h4 className="font-bold text-slate-900 text-sm">2. Doctor Verification Guarantee</h4>
              <p>Practo guarantees that every doctor listed with the "Practo Verified" badge holds valid registration with their respective State Medical Council or the National Medical Commission of India.</p>
              <h4 className="font-bold text-slate-900 text-sm">3. Emergency Care Disclaimer</h4>
              <p>The Practo scheduling platform and teleconsultation services are designed for non-emergency healthcare. In life-threatening emergencies, patients must immediately contact emergency services (108/112) or proceed to the nearest hospital casualty ward.</p>
            </>
          )}

          {type === 'directory' && (
            <>
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-[#1e3a8a] mb-4">
                <strong className="block text-sm font-bold mb-1">Search 100,000+ Verified Doctors</strong>
                <span>Our directory indexes top medical specialists, super-specialists, and NABH-accredited clinics across 70+ Indian cities.</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Supported Specialty Registries</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Cardiology & Cardiothoracic Surgery</li>
                <li>Dermatology, Venereology & Cosmetology</li>
                <li>Obstetrics, Gynecology & Fertility Medicine</li>
                <li>Orthopedics, Joint Replacement & Sports Medicine</li>
                <li>Pediatrics & Neonatal Intensive Care</li>
                <li>General Medicine & Diabetology</li>
                <li>Psychiatry & Behavioral Health</li>
                <li>Otorhinolaryngology (ENT)</li>
                <li>Dental Surgery, Orthodontics & Endodontics</li>
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] hover:from-[#172554] hover:to-[#0369a1] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
