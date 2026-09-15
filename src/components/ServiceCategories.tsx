import React from 'react';
import { 
  Video, 
  UserCheck, 
  Activity, 
  FlaskConical, 
  Stethoscope, 
  Sparkles, 
  HeartHandshake, 
  Baby, 
  Smile, 
  Bone, 
  Brain, 
  Ear,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { SERVICE_CATEGORIES, SPECIALTIES } from '../data/mockData';

interface ServiceCategoriesProps {
  selectedSpecialty: string;
  onSelectSpecialty: (specialtyName: string) => void;
  onSelectServiceCard: (serviceId: string) => void;
}

export const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  selectedSpecialty,
  onSelectSpecialty,
  onSelectServiceCard,
}) => {
  // Helper to map icon string to Lucide component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Video':
        return <Video className="w-6 h-6" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6" />;
      case 'Activity':
        return <Activity className="w-6 h-6" />;
      case 'FlaskConical':
        return <FlaskConical className="w-6 h-6" />;
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-6 h-6" />;
      case 'Baby':
        return <Baby className="w-6 h-6" />;
      case 'Smile':
        return <Smile className="w-6 h-6" />;
      case 'Bone':
        return <Bone className="w-6 h-6" />;
      case 'Brain':
        return <Brain className="w-6 h-6" />;
      case 'Ear':
        return <Ear className="w-6 h-6" />;
      default:
        return <Stethoscope className="w-6 h-6" />;
    }
  };

  const getSpecialtyBadgeStyle = (accent: string) => {
    switch (accent) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white';
      case 'rose':
        return 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white';
      case 'pink':
        return 'bg-pink-50 text-pink-700 border-pink-200 group-hover:bg-pink-600 group-hover:text-white';
      case 'amber':
        return 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white';
      case 'cyan':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200 group-hover:bg-cyan-600 group-hover:text-white';
      case 'emerald':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-600 group-hover:text-white';
      case 'indigo':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 group-hover:bg-slate-800 group-hover:text-white';
    }
  };

  return (
    <section id="specialties-section" className="py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Service Categories Grid */}
        <div className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-[#14bef0] uppercase tracking-wider">
                Comprehensive Healthcare
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Consult Top Doctors Across Healthcare Services
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-2 md:mt-0 max-w-md">
              From emergency online video calls to confirmed clinic walk-ins and full surgery guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.map((service) => (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                onClick={() => onSelectServiceCard(service.id)}
                className="group relative bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {/* Top decorative gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${service.bgGradient}`}></div>

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#28328c] group-hover:scale-110 group-hover:bg-blue-50 transition-all">
                      {getIcon(service.icon)}
                    </div>
                    {service.tag && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-[#28328c] border border-sky-200">
                        {service.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#28328c] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {service.subtitle}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#28328c] group-hover:text-[#14bef0]">
                  <span>{service.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medical Specialties Grid with Symptoms */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-[#28328c] uppercase tracking-wider">
                Browse By Medical Specialty
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Book an Appointment for Any Health Concern
              </h2>
            </div>
            {selectedSpecialty && (
              <button
                id="clear-specialty-selection-btn"
                onClick={() => onSelectSpecialty('')}
                className="mt-2 sm:mt-0 text-xs font-bold text-[#14bef0] hover:underline cursor-pointer"
              >
                Reset Specialty Filter (Showing: {selectedSpecialty})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty.toLowerCase() === spec.name.toLowerCase();
              return (
                <div
                  key={spec.id}
                  id={`specialty-item-${spec.id}`}
                  onClick={() => onSelectSpecialty(isSelected ? '' : spec.name)}
                  className={`group p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#28328c] bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${getSpecialtyBadgeStyle(spec.accentColor)}`}>
                        {getIcon(spec.icon)}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {spec.doctorCount}+ Docs
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#28328c] transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {spec.shortDesc}
                    </p>
                  </div>

                  {/* Common symptoms chips */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1">
                    {spec.popularSymptoms.slice(0, 2).map((symptom) => (
                      <span
                        key={symptom}
                        className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-[#28328c] pt-1">
                    <span>{isSelected ? 'Selected' : 'Find Specialists'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-[#28328c]' : 'group-hover:translate-x-0.5'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
