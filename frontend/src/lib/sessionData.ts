// Therapist data structure for session management
// This is a placeholder - actual data should come from the API

interface Service {
  name: string;
  scheduleId: string;
  duration: number;
  price?: number;
}

interface TherapistInfo {
  services: Service[];
  bio?: string;
  specializations?: string[];
}

export const therapistData: Record<string, TherapistInfo> = {
  "Ishika Mahajan": {
    services: [
      {
        name: "Individual Therapy Session",
        scheduleId: "default-schedule-1",
        duration: 60,
        price: 1500
      },
      {
        name: "Couple Therapy Session",
        scheduleId: "default-schedule-2",
        duration: 90,
        price: 2500
      }
    ],
    bio: "Clinical Psychologist with 5+ years of experience",
    specializations: ["Anxiety", "Depression", "Relationship Issues"]
  }
  // Add more therapists as needed
};

// Helper function to get therapist data
export const getTherapistData = (therapistName: string): TherapistInfo | null => {
  return therapistData[therapistName] || null;
};

// Helper function to get all therapist names
export const getAllTherapistNames = (): string[] => {
  return Object.keys(therapistData);
};
