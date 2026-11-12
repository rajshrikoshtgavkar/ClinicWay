import { api } from "./api";

export const doctorService = {
  async getAllDoctors() {
    console.log("DoctorService: fetching all doctors");
    return await api.get("/api/doctor");
  },

  async getAvailableDoctors() {
    console.log("DoctorService: fetching available doctors");
    return await api.get("/doctor/available");
  },

  async getDoctorsByClinic(clinicName: string) {
    console.log("DoctorService: fetching doctors for clinic:", clinicName);
    const response = await api.get("/api/doctor");
    return response.data.filter(
      (doctor: any) => doctor.clinicName === clinicName,
    );
  },

  async getDoctorById(id: number) {
    console.log("DoctorService: fetching doctor with id:", id);
    return await api.get(`/doctor/${id}`);
  },

  async getClinics() {
    console.log("DoctorService: aggregating clinics from doctors");
    const response = await api.get("/doctor");
    const doctors = response.data;

    // Group doctors by clinic
    const clinicMap = new Map<string, any>();
    doctors.forEach((doctor: any) => {
      if (doctor.clinicName) {
        if (!clinicMap.has(doctor.clinicName)) {
          clinicMap.set(doctor.clinicName, {
            clinicName: doctor.clinicName,
            district: doctor.district,
            taluka: doctor.taluka,
            doctors: [],
            specializations: new Set<string>(),
          });
        }
        const clinic = clinicMap.get(doctor.clinicName);
        clinic.doctors.push({
          id: doctor.id,
          name: doctor.user?.name || "Unknown",
          specialization: doctor.specialization,
        });
        if (doctor.specialization) {
          clinic.specializations.add(doctor.specialization);
        }
      }
    });

    // Convert Map to array and convert Set to array
    return Array.from(clinicMap.values()).map((clinic: any) => ({
      ...clinic,
      specializations: Array.from(clinic.specializations),
      totalDoctors: clinic.doctors.length,
    }));
  },

  /**
   * Get clinics for a specific district and optionally taluka
   */
  async getClinicsByLocation(district: string, taluka?: string) {
    console.log("DoctorService: getting clinics for location", {
      district,
      taluka,
    });
    const response = await api.get("/api/doctor");
    const doctors = response.data.filter(
      (doctor: any) => doctor.district === district,
    );

    const filteredDoctors = taluka
      ? doctors.filter((doctor: any) => doctor.taluka === taluka)
      : doctors;

    // Group by clinic
    const clinicMap = new Map<string, any>();
    filteredDoctors.forEach((doctor: any) => {
      if (doctor.clinicName) {
        if (!clinicMap.has(doctor.clinicName)) {
          clinicMap.set(doctor.clinicName, {
            clinicName: doctor.clinicName,
            district: doctor.district,
            taluka: doctor.taluka,
            doctors: [],
            specializations: new Set<string>(),
          });
        }
        const clinic = clinicMap.get(doctor.clinicName);
        clinic.doctors.push({
          id: doctor.id,
          name: doctor.user?.name || "Unknown",
          specialization: doctor.specialization,
        });
        if (doctor.specialization) {
          clinic.specializations.add(doctor.specialization);
        }
      }
    });

    return Array.from(clinicMap.values()).map((clinic: any) => ({
      ...clinic,
      specializations: Array.from(clinic.specializations),
      totalDoctors: clinic.doctors.length,
    }));
  },
};

export default doctorService;
