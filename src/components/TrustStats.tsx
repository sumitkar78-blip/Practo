import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  MessageSquareHeart, 
  MapPin, 
  Lock, 
  CheckCircle2, 
  Award,
  Sparkles
} from 'lucide-react';
import { TRUST_STATS } from '../data/mockData';

export const TrustStats: React.FC = () => {
  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Users':
        return <Users className="w-6 h-6 text-[#14bef0]" />;
      case 'MessageSquareHeart':
        return <MessageSquareHeart className="w-6 h-6 text-rose-500" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-amber-500" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-[#28328c]" />;
    }
  };

  return (
    <section id="trust-stats" className="py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Metric Counter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {TRUST_STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs text-center flex flex-col items-center justify-center space-y-2 hover:border-blue-200 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-1">
                {getStatIcon(stat.icon)}
              </div>
              <strong className="text-2xl sm:text-3xl font-black text-[#28328c] tracking-tight">
                {stat.value}
              </strong>
              <span className="text-xs font-semibold text-slate-500 max-w-[150px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Practo Safety & Verification Pillars */}
        <div className="bg-[#28328c] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#14bef0]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-cyan-300 text-xs font-bold border border-blue-700">
                <Sparkles className="w-3.5 h-3.5" />
                The Practo Quality Promise
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Healthcare with complete transparency and certified safety
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                We believe finding a doctor should be as effortless and reliable as calling a family friend. That's why every detail on Practo is continuously verified.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Triple-Step Doctor Audit</h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Every doctor undergoes Medical Council registration checks, degree verification, and clinic physical inspections.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">256-Bit Health Privacy</h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Your medical history, prescriptions, and video consultations are HIPAA-compliant and end-to-end encrypted.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Zero Cancellation Penalty</h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Plans change? Cancel or reschedule in a single click anytime without any fees or cancellation charges.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-purple-400/20 text-purple-300 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Real Patient Stories Only</h4>
                <p className="text-xs text-blue-200 leading-relaxed">
                  Only patients with a confirmed, completed appointment can post reviews to maintain 100% authentic feedback.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
