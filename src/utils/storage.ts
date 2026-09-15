/**
 * Storage and Appointment Management Utility.
 * Provides safe LocalStorage access, schema validation, slot collision checking,
 * and geolocation calculation for city detection.
 */

import { Appointment, CityOption } from '../types';
import { CITIES } from '../data/mockData';

export const APPOINTMENTS_STORAGE_KEY = 'practo_appointments_data';

// Clearly fictional, non-personal demo appointments for exploration
export const DEFAULT_DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-demo-101',
    bookingRef: 'PRC-DEMO01',
    doctorId: 'doc-1',
    doctorName: 'Dr. Priya Deshmukh',
    doctorSpecialty: 'Dermatologist',
    doctorQualifications: 'MBBS, MD - Dermatology, DNB',
    doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
    clinicName: 'Aura Skin & Hair Clinic',
    clinicAddress: '12th Main Road, HAL 2nd Stage, Indiranagar',
    city: 'Bangalore',
    area: 'Indiranagar',
    mode: 'in_clinic',
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
    timeSlot: '11:00 AM',
    slotPeriod: 'morning',
    patientName: 'Demo Patient',
    patientPhone: '9800000000',
    patientEmail: 'demo.patient@practo.example.com',
    patientAge: 32,
    patientGender: 'female',
    symptoms: 'Routine skin health checkup',
    consultationFee: 700,
    paymentMethod: 'pay_at_clinic',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-demo-102',
    bookingRef: 'PRC-DEMO02',
    doctorId: 'doc-3',
    doctorName: 'Dr. Vikram Malhotra',
    doctorSpecialty: 'Cardiologist',
    doctorQualifications: 'MBBS, MD (Medicine), DM - Cardiology, FACC',
    doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
    clinicName: 'Heart Rhythm Care Institute',
    clinicAddress: 'Press Enclave Road, Saket',
    city: 'Delhi NCR',
    area: 'Saket',
    mode: 'video',
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // 3 days from now
    timeSlot: '05:30 PM',
    slotPeriod: 'evening',
    patientName: 'Demo Patient',
    patientPhone: '9800000000',
    patientEmail: 'demo.patient@practo.example.com',
    patientAge: 45,
    patientGender: 'male',
    symptoms: 'Annual preventive heart screening follow-up',
    consultationFee: 1000,
    paymentMethod: 'pay_online_demo',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DEMO_APPOINTMENTS = DEFAULT_DEMO_APPOINTMENTS;

/**
 * Safely parse and retrieve appointments from LocalStorage.
 * Recovers gracefully if storage is empty or contains malformed data.
 */
export function getStoredAppointments(): Appointment[] {
  if (typeof window === 'undefined') return DEFAULT_DEMO_APPOINTMENTS;

  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_DEMO_APPOINTMENTS));
      return DEFAULT_DEMO_APPOINTMENTS;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('LocalStorage data was not an array. Resetting to defaults.');
      return DEFAULT_DEMO_APPOINTMENTS;
    }

    // Basic structural check
    const valid = parsed.filter(
      (item): item is Appointment =>
        item &&
        typeof item.id === 'string' &&
        typeof item.doctorId === 'string' &&
        typeof item.date === 'string' &&
        typeof item.timeSlot === 'string' &&
        (item.status === 'confirmed' || item.status === 'cancelled' || item.status === 'completed')
    );

    return valid;
  } catch (error) {
    console.error('Failed to load appointments from localStorage:', error);
    return DEFAULT_DEMO_APPOINTMENTS;
  }
}

/**
 * Safely persist appointments list to LocalStorage.
 */
export function saveStoredAppointments(appointments: Appointment[]): boolean {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
    return true;
  } catch (error) {
    console.error('Failed to save appointments to localStorage:', error);
    return false;
  }
}

/**
 * Checks whether a specific Doctor + Date + Time + Mode is already booked.
 * Cancelled appointments do NOT block the slot!
 */
export function isSlotAlreadyBooked(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  timeSlot: string,
  mode: 'in_clinic' | 'video'
): boolean {
  return appointments.some(
    (apt) =>
      apt.doctorId === doctorId &&
      apt.date === date &&
      apt.timeSlot === timeSlot &&
      apt.mode === mode &&
      apt.status === 'confirmed'
  );
}

/**
 * Retrieves the set of all confirmed booked time slots for a doctor on a given date and mode.
 */
export function getBookedSlotsForDoctorDate(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  mode: 'in_clinic' | 'video'
): Set<string> {
  const booked = new Set<string>();
  for (const apt of appointments) {
    if (
      apt.doctorId === doctorId &&
      apt.date === date &&
      apt.mode === mode &&
      apt.status === 'confirmed'
    ) {
      booked.add(apt.timeSlot);
    }
  }
  return booked;
}

/**
 * Computes great-circle distance between two coordinates in kilometers using Haversine formula.
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Determines closest supported city from user GPS coordinates.
 */
export function findClosestCity(
  userLat: number,
  userLng: number,
  citiesList: CityOption[] = CITIES
): { city: CityOption; distanceKm: number } {
  let closest = citiesList[0];
  let minDistance = Infinity;

  for (const city of citiesList) {
    const dist = calculateHaversineDistance(userLat, userLng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }

  return {
    city: closest,
    distanceKm: Math.round(minDistance),
  };
}
