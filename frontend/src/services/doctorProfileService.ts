import { api } from "./api";

export interface DoctorProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  bio: string;
  consultationFee: number;
  availableSlots: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateDoctorProfileRequest {
  email: string;
  phone: string;
  bio: string;
  licenseNumber: string;
  consultationFee: number;
  availableSlots: string;
}

export const getDoctorProfile = () => api.get("/doctor/profile");
export const updateDoctorProfile = (data: UpdateDoctorProfileRequest) =>
  api.put("/doctor/profile", data);

export const doctorProfileService = {
  getDoctorProfile,
  updateDoctorProfile,
};

export default doctorProfileService;
