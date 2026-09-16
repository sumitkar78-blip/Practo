export interface DoctorSlots {
  morning: string[];
  afternoon: string[];
  evening: string[];
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  gender: 'male' | 'female';
  specialty: string;
  subSpecialties: string[];
  qualifications: string;
  experienceYears: number;
  rating: number; // percentage, e.g. 98
  reviewCount: number;
  clinicName: string;
  clinicAddress: string;
  city: string;
  area: string; // Locality e.g. 'Saket', 'Indiranagar', 'Bandra West'
  distanceKm: number;
  consultationFee: number;
  videoConsultFee: number;
  consultationModes: ('in_clinic' | 'video')[];
  availableToday: boolean;
  nextAvailableSlot: string;
  profileImage: string;
  about: string;
  services: string[];
  education: string[];
  languages: string[];
  clinicTimings: string;
  availableDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  availableSlots: DoctorSlots;
  isPractoVerified: boolean;
}

export interface Specialty {
  id: string;
  name: string;
  shortDesc: string;
  icon: string;
  doctorCount: number;
  popularSymptoms: string[];
  accentColor: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  icon: string;
  bgGradient: string;
  actionText: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  patientCity: string;
  doctorName: string;
  doctorSpecialty: string;
  rating: number;
  date: string;
  treatment: string;
  comment: string;
  verified: boolean;
  avatarBg: string;
}

export interface Appointment {
  id: string;
  bookingRef: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorQualifications: string;
  doctorImage: string;
  clinicName: string;
  clinicAddress: string;
  city?: string;
  area?: string;
  mode: 'in_clinic' | 'video';
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  slotPeriod: 'morning' | 'afternoon' | 'evening';
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'male' | 'female' | 'other';
  symptoms: string;
  consultationFee: number;
  paymentMethod: 'pay_at_clinic' | 'pay_online_demo';
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface FilterState {
  specialty: string;
  city: string;
  area: string;
  searchQuery: string;
  mode: 'all' | 'in_clinic' | 'video';
  gender: 'all' | 'male' | 'female';
  minExperience: number;
  maxFee: number;
  availableTodayOnly: boolean;
  sortBy: 'recommended' | 'rating' | 'experience' | 'fee_low' | 'fee_high';
}

export interface CityOption {
  name: string;
  state: string;
  popularAreas: string[];
  lat: number;
  lng: number;
}
