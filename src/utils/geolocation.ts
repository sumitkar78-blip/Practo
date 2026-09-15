/**
 * Geolocation helper for detecting closest supported Indian cities.
 * Uses the standard Browser Geolocation API and calculates the Haversine
 * distance to supported city centroids without leaking or persisting raw GPS data.
 */

import { CityOption } from '../types';
import { CITIES } from '../data/mockData';

export interface LocationDetectionResult {
  success: boolean;
  city?: string;
  area?: string;
  message: string;
  isFallback?: boolean;
}

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
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
    const dist = calculateDistanceKm(userLat, userLng, city.lat, city.lng);
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

/**
 * Detect the user's nearest supported city via Browser Geolocation API.
 */
export async function detectNearestCity(): Promise<LocationDetectionResult> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      message: 'Geolocation is not supported by your browser. Please select your city manually.',
    };
  }

  return new Promise((resolve) => {
    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const result = findClosestCity(latitude, longitude, CITIES);
        const closestCity = result.city;
        const area = closestCity.popularAreas[0] || '';

        resolve({
          success: true,
          city: closestCity.name,
          area: area,
          message: `Location detected: ${closestCity.name} (${area}). Approx ${result.distanceKm} km away.`,
        });
      },
      (error) => {
        let message = 'Unable to determine your location. Please select your city manually.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access was denied. You can manually choose any city from the list.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is currently unavailable. Please pick your city manually.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please select your city from the dropdown.';
            break;
        }
        resolve({
          success: false,
          message,
        });
      },
      options
    );
  });
}
