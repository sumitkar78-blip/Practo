import React, { useEffect } from 'react';
import { X, ShieldCheck, Lock, FileText } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  isOpen,
  type,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#28328c] flex items-center justify-center font-bold">
              {type === 'privacy' ? <Lock className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h3 id="legal-modal-title" className="text-base font-bold text-slate-900">
                {type === 'privacy' ? 'Patient Privacy Policy' : 'Terms & Conditions of Service'}
              </h3>
              <p className="text-xs text-slate-500">
                Practo Healthcare Platform • Last updated: September 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed flex-1">
          {type === 'privacy' ? (
            <>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[#1e3a8a] text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#0284c7]" />
                <span>
                  <strong>Our Privacy Guarantee:</strong> Your medical consultation history, prescriptions, and health queries are protected with 256-bit encryption and are never sold to advertisers.
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">1. Data We Collect</h4>
              <p>
                We collect your name, contact information (phone number, email), age, gender, and appointment details strictly for facilitating your booking with verified medical practitioners.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Geolocation & Device Information</h4>
              <p>
                When you choose to "Detect My Location", your coordinates are calculated ephemerally by your browser to locate the nearest supported healthcare center and are not persisted permanently.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">3. Medical Records Privacy</h4>
              <p>
                All digital video consultations are end-to-end encrypted and comply with applicable Telemedicine Guidelines and the Digital Personal Data Protection Act.
              </p>
            </>
          ) : (
            <>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[#1e3a8a] text-xs flex items-start gap-2">
                <FileText className="w-4 h-4 shrink-0 mt-0.5 text-[#0284c7]" />
                <span>
                  <strong>Transparent Healthcare Terms:</strong> By scheduling consultations through our platform, you agree to these fair usage and clinical guidelines.
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">1. Appointment Scheduling & Zero Fee Guarantee</h4>
              <p>
                Reserving an in-clinic slot or video consultation on this portal is free of platform convenience charges. You pay the doctor's published consultation fee directly at the clinic or via authorized payment channels.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">2. Cancellation Policy</h4>
              <p>
                You may reschedule or cancel any scheduled appointment at any time without penalty. When cancelled, the appointment slot is immediately released back to the general availability pool.
              </p>
              <h4 className="font-bold text-slate-800 text-sm">3. Emergency Care Disclaimer</h4>
              <p>
                This platform is designed for scheduled clinical and non-emergency telemedicine appointments. In cases of severe emergencies (acute chest pain, head trauma, severe shortness of breath), immediately contact emergency services (108/112) or visit the nearest hospital emergency department.
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] hover:from-[#172554] hover:to-[#0369a1] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            I Understand & Accept
          </button>
        </div>

      </div>
    </div>
  );
};
