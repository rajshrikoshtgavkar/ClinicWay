import { api } from "./api";

export interface StaffProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStaffProfileRequest {
  email: string;
  phone: string;
  department: string;
  position: string;
  notes: string;
}

export const getStaffProfile = () => api.get("/staff/profile");
export const updateStaffProfile = (data: UpdateStaffProfileRequest) =>
  api.put("/staff/profile", data);

export const staffProfileService = {
  getStaffProfile,
  updateStaffProfile,
};

export default staffProfileService;
