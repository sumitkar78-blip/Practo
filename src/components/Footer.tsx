import React from 'react';
import { Stethoscope, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';
import { InfoModalType } from './InfoModal';

interface FooterProps {
  onSelectCity?: (cityName: string) => void;
  onOpenInfo?: (type: InfoModalType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCity, onOpenInfo }) => {
  const handleCityClick = (e: React.MouseEvent, city: string) => {
    e.preventDefault();
    if (onSelectCity) {
      onSelectCity(city);
    }
    const docEl = document.getElementById('doctors-section');
    if (docEl) {
      docEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInfoClick = (e: React.MouseEvent, type: InfoModalType) => {
    e.preventDefault();
    if (onOpenInfo) {
      onOpenInfo(type);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top brand summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#28328c] to-[#14bef0] flex items-center justify-center text-white shadow-md">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-white">practo</span>
                <span className="w-2 h-2 rounded-full bg-[#14bef0]"></span>
              </div>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Connecting millions of patients with India's top certified doctors, specialists, and modern clinics. Guaranteed verified credentials, transparent consultation fees, and hassle-free scheduling.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ISO 27001 Certified
              </span>
              <span>•</span>
              <span>HIPAA Compliant</span>
            </div>
          </div>

          {/* Column 1: For Patients */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Practo for Patients
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#doctors-section" className="hover:text-white transition-colors">Search for Doctors</a></li>
              <li><a href="#specialties-section" className="hover:text-white transition-colors">Medical Specialties</a></li>
              <li><a href="#doctors-section" className="hover:text-white transition-colors">Online Video Consult</a></li>
              <li><a href="#categories-section" className="hover:text-white transition-colors">Surgeries & Diagnostics</a></li>
              <li><a href="#testimonials-section" className="hover:text-white transition-colors">Patient Stories & Reviews</a></li>
            </ul>
          </div>

          {/* Column 2: Healthcare Solutions */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Practo Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={(e) => handleInfoClick(e, 'directory')} className="hover:text-white transition-colors cursor-pointer text-left">Doctor Directory</button></li>
              <li><button onClick={(e) => handleInfoClick(e, 'terms')} className="hover:text-white transition-colors cursor-pointer text-left">Ray EMR System</button></li>
              <li><button onClick={(e) => handleInfoClick(e, 'privacy')} className="hover:text-white transition-colors cursor-pointer text-left">Practo Verified Standards</button></li>
              <li><button onClick={(e) => handleInfoClick(e, 'directory')} className="hover:text-white transition-colors cursor-pointer text-left">Hospital Network</button></li>
              <li><button onClick={(e) => handleInfoClick(e, 'terms')} className="hover:text-white transition-colors cursor-pointer text-left">Clinic Management</button></li>
            </ul>
          </div>

          {/* Column 3: Top Cities */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Top Cities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={(e) => handleCityClick(e, 'Delhi NCR')} className="hover:text-white transition-colors cursor-pointer text-left">Delhi NCR Doctors</button></li>
              <li><button onClick={(e) => handleCityClick(e, 'Bangalore')} className="hover:text-white transition-colors cursor-pointer text-left">Bangalore Doctors</button></li>
              <li><button onClick={(e) => handleCityClick(e, 'Mumbai')} className="hover:text-white transition-colors cursor-pointer text-left">Mumbai Doctors</button></li>
              <li><button onClick={(e) => handleCityClick(e, 'Hyderabad')} className="hover:text-white transition-colors cursor-pointer text-left">Hyderabad Doctors</button></li>
              <li><button onClick={(e) => handleCityClick(e, 'Chennai')} className="hover:text-white transition-colors cursor-pointer text-left">Chennai Doctors</button></li>
              <li><button onClick={(e) => handleCityClick(e, 'Pune')} className="hover:text-white transition-colors cursor-pointer text-left">Pune Doctors</button></li>
            </ul>
          </div>

          {/* Column 4: Help & Emergency */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              24/7 Patient Helpline
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#14bef0]" />
                <span className="text-white font-bold">1800-425-7228</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#14bef0]" />
                <span>support@practo.com</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2">
                For life-threatening medical emergencies, please immediately visit the nearest hospital casualty ward or call 108/112.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright and legal modals */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Practo Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => handleInfoClick(e, 'privacy')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={(e) => handleInfoClick(e, 'terms')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={(e) => handleInfoClick(e, 'directory')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Healthcare Directory
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
