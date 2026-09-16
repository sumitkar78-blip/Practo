import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  MessageSquareHeart, 
  CheckCircle2, 
  Quote, 
  Plus, 
  Calendar,
  ThumbsUp,
  User,
  X
} from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  onBookSpecificDoctor: (doctorName: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onBookSpecificDoctor,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [allReviews, setAllReviews] = useState<Testimonial[]>(TESTIMONIALS);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // New review form states
  const [newPatientName, setNewPatientName] = useState('');
  const [newCity, setNewCity] = useState('Bangalore');
  const [newDoctorName, setNewDoctorName] = useState('Dr. Priya Deshmukh');
  const [newSpecialty, setNewSpecialty] = useState('Dermatologist');
  const [newTreatment, setNewTreatment] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const specialtyFilters = [
    'All',
    'Orthopedist',
    'Dermatologist',
    'Gynecologist',
    'Dentist',
    'General Physician',
    'Pediatrician',
  ];

  const filteredReviews = selectedFilter === 'All'
    ? allReviews
    : allReviews.filter((r) => r.doctorSpecialty.toLowerCase() === selectedFilter.toLowerCase());

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newComment.trim() || !newTreatment.trim()) return;

    const newTestimonial: Testimonial = {
      id: `test-${Date.now()}`,
      patientName: newPatientName,
      patientCity: newCity,
      doctorName: newDoctorName,
      doctorSpecialty: newSpecialty,
      rating: newRating,
      date: 'Just now',
      treatment: newTreatment,
      comment: newComment,
      verified: true,
      avatarBg: 'bg-blue-100 text-[#1e3a8a]',
    };

    setAllReviews([newTestimonial, ...allReviews]);
    setShowReviewModal(false);
    setNewPatientName('');
    setNewTreatment('');
    setNewComment('');
  };

  return (
    <section id="testimonials-section" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#1e3a8a] text-xs font-bold mb-2 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>100% Genuine Patient Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">
              What Patients Say About Our Doctors
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Real feedback from verified patients who booked clinic visits or video consults through Practo.
            </p>
          </div>

          {/* Aggregate Rating Stat Badge & Share review */}
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 font-extrabold block">4.9 / 5.0 Rating</strong>
                <span className="text-slate-500 text-[11px]">from 15,000+ stories</span>
              </div>
            </div>

            <button
              id="open-write-review-modal-btn"
              onClick={() => setShowReviewModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] hover:from-[#172554] hover:to-[#0369a1] text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-blue-950/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          </div>
        </div>

        {/* Specialty Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {specialtyFilters.map((spec) => (
            <button
              key={spec}
              id={`filter-testimonial-${spec.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedFilter(spec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedFilter === spec
                  ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((item) => (
            <div
              key={item.id}
              id={`testimonial-card-${item.id}`}
              className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {item.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0284c7] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      <CheckCircle2 className="w-3 h-3 text-[#0284c7]" />
                      Verified Patient
                    </span>
                  )}
                </div>

                {/* Treatment / Problem Tag */}
                <div className="inline-block px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800">
                  Treatment: {item.treatment}
                </div>

                {/* Patient Review Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "{item.comment}"
                </p>
              </div>

              {/* Patient and Doctor Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${item.avatarBg}`}>
                      {item.patientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.patientName}</h4>
                      <p className="text-[10px] text-slate-400">{item.patientCity} • {item.date}</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Attended Pill with Quick Book Link */}
                <div className="bg-white rounded-xl p-2.5 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Consulted Doctor:</span>
                    <strong className="text-xs text-[#1e3a8a] block">{item.doctorName}</strong>
                    <span className="text-[10px] text-slate-500">{item.doctorSpecialty}</span>
                  </div>
                  <button
                    onClick={() => onBookSpecificDoctor(item.doctorName)}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Book Doctor
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Write a Patient Story */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Share Your Doctor Experience</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddReview} className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Suman Sen"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Doctor Name</label>
                    <input
                      type="text"
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Treatment / Condition *</label>
                  <input
                    type="text"
                    required
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    placeholder="e.g. Tooth Extraction, Severe Migraine"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Your Honest Feedback *</label>
                  <textarea
                    rows={3}
                    required
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe your consultation experience, clinic hygiene, doctor empathy, and wait time..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#0284c7] text-white font-bold hover:from-[#172554] hover:to-[#0369a1] shadow-sm cursor-pointer"
                  >
                    Post Testimonial
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
