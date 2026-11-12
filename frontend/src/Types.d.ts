import type { JSX } from "react";

export interface User {
  userId?: string;
  clinicId?: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  role: string;
  password?: string;
}

export interface SideNavItem {
  title: string;
  path: string;
  icon?: JSX.Element;
}

// Old Doctor interface - for backwards compatibility in UI components
export interface Doctor {
  id: string;
  user: User;
  name: string;
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
  bio: string;
  availableSlots: string;
  clinic: Clinic;
  isAvailable: boolean;
}

// New DoctorListResponse - matches backend DoctorListResponse.java
export interface DoctorListResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  specialization: string;
  licenseNumber: string;
  bio: string;
  consultationFee: number;
  availableSlots: string;
  isAvailable: boolean;
  clinic: ClinicBasicInfo;
}

// Nested clinic info in DoctorListResponse
export interface ClinicBasicInfo {
  id: number;
  name: string;
  address: string;
}

// DoctorProfileResponse - matches backend DoctorProfileResponse.java
export interface DoctorProfileResponse {
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
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  state: string;
  district: string;
  taluka: string;
  phone: string;
}

export interface Staff {
  user: User;
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
}

// AuthResponse - matches backend AuthResponse.java
export interface AuthResponse {
  token: string;
  email: string;
  role: string; // "PATIENT", "DOCTOR", "STAFF"
  userId: number;
  clinicId?: number;
  message?: string;
}

// UserResponse - matches backend UserResponse.java
export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  role: string; // "PATIENT", "DOCTOR", "STAFF"
  clinicId?: number;
  isActive: boolean;
}

// AppointmentResponseDto - matches backend AppointmentResponseDto.java
export interface AppointmentResponseDto {
  id: number;
  clinicId: number;
  clinicName: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
  patientId: number;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhoneNumber: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  appointmentType: string; // "ONLINE" or "IN_PERSON"
  status: string; // "BOOKED", "CHECKED_IN", "IN_PROGRESS", "COMPLETED", "CANCELLED"
  queueNumber?: number;
  meetingLink?: string;
  paymentStatus?: string; // "PENDING", "COMPLETED", etc
  notes?: string;
}

// PatientProfileResponse - matches backend PatientProfileResponse.java
export interface PatientProfileResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address?: string;
  medicalHistory?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}
