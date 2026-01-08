/**
 * Utility functions for mapping doctor usernames to full names with titles
 */

/**
 * Maps a doctor username to their full name with title
 * @param username - The doctor's username (e.g., 'matheus', 'fabiola')
 * @returns The full name with title (e.g., 'Dr. Matheus Roque', 'Dra. Fabiola')
 */
export function getDoctorFullName(username: string | undefined | null): string {
  if (!username) return 'Médico';
  
  const usernameLower = username.toLowerCase();
  
  if (usernameLower === 'matheus') {
    return 'Dr. Matheus Roque';
  }
  
  if (usernameLower === 'fabiola' || usernameLower === 'fabíola') {
    return 'Dra. Fabiola';
  }
  
  // Fallback: return username as-is if not recognized
  return username;
}

/**
 * Maps a doctor username to their display name (short version)
 * @param username - The doctor's username (e.g., 'matheus', 'fabiola')
 * @returns The display name (e.g., 'Dr. Matheus', 'Dra. Fabíola')
 */
export function getDoctorDisplayName(username: string | undefined | null): string {
  if (!username) return 'Médico';
  
  const usernameLower = username.toLowerCase();
  
  if (usernameLower === 'matheus') {
    return 'Dr. Matheus';
  }
  
  if (usernameLower === 'fabiola' || usernameLower === 'fabíola') {
    return 'Dra. Fabíola';
  }
  
  // Fallback: return username as-is if not recognized
  return username;
}

/**
 * Maps a doctor full name back to username (for forms)
 * @param doctorName - The doctor's full name (e.g., 'Dr. Matheus Roque', 'Dra. Fabíola')
 * @returns The username (e.g., 'matheus', 'fabiola')
 */
export function getDoctorUsername(doctorName: string | undefined | null): string {
  if (!doctorName) return '';
  
  const nameLower = doctorName.toLowerCase();
  
  if (nameLower.includes('matheus')) {
    return 'matheus';
  }
  
  if (nameLower.includes('fabiola') || nameLower.includes('fabíola')) {
    return 'fabiola';
  }
  
  // Fallback: return as-is
  return doctorName;
}

