"use client";

import { useEffect, useState } from "react";
import {
  IconSearch,
  IconUserPlus,
  IconId,
  IconPhone,
  IconCircleX,
  IconLock,
  IconEyeOff,
  IconEye,
} from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosResponse } from "axios";

/* -------------------- Types -------------------- */
interface Doctor {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  specialization: string;
  licenseNumber: string;
  bio: string | null;
  consultationFee: number;
  availableSlots: any[] | null;
  isAvailable: boolean;
  clinic: {
    id: number;
    name: string;
    address: string;
  };
}

interface DoctorFormState {
  user: {
    name: string;
    email: string;
    phone: string;
    password: string;
    profileImage: string;
  };
  specialization: string;
  licenseNumber: string;
  consultationFee: number;
}

/* -------------------- Component -------------------- */
export default function ManageDoctors() {
  const { user } = useAuth();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [doctor, setDoctor] = useState<DoctorFormState>({
    user: {
      name: "",
      email: "",
      phone: "",
      password: "",
      profileImage: "",
    },
    specialization: "",
    licenseNumber: "",
    consultationFee: 0,
  });

  /* -------------------- API -------------------- */
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/spring-server/api/doctor/clinic/${user?.clinicId}`,
      );
      const data = await res.json();
      setDoctors(data);
    } catch {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const payload = {
        name: doctor.user.name,
        email: doctor.user.email,
        phone: doctor.user.phone,
        password: doctor.user.password,
        profileImage: doctor.user.profileImage,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        consultationFee: doctor.consultationFee,
        clinicId: user?.clinicId,
      };

      await axios.post("/spring-server/api/doctor/add-doctor", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Doctor registered successfully");
      fetchDoctors();
      setShowModal(false);

      // reset form
      setDoctor({
        user: {
          name: "",
          email: "",
          phone: "",
          password: "",
          profileImage: "",
        },
        specialization: "",
        licenseNumber: "",
        consultationFee: 0,
      });
    } catch {
      toast.error("Failed to create doctor");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, name: string) => {
    const res = axios.postForm("/api/helper/upload-img", {
      file,
      name,
      folderName: "doctor-profiles",
    });

    toast.promise(res, {
      loading: "Uploading image...",
      success: (data: AxiosResponse) => {
        setDoctor((prev) => ({
          ...prev,
          user: { ...prev.user, profileImage: data.data.path },
        }));
        return "Image uploaded";
      },
      error: "Upload failed",
    });
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Loading />;

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 lg:p-10">
      <Toaster />

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black">
            Manage <span className="text-primary">Doctors</span>
          </h1>
          <p className="opacity-60 font-medium">
            Clinic medical staff management
          </p>
        </div>
        <button
          className="btn btn-primary gap-2 font-black"
          onClick={() => setShowModal(true)}
        >
          <IconUserPlus size={18} /> Add Doctor
        </button>
      </div>

      {/* Search */}
      <div className="input input-bordered mb-6 w-full">
        <IconSearch size={18} />
        <input
          placeholder="Search by doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Doctor Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="py-24 text-center opacity-40 font-bold">
          No doctors found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="card bg-base-200 border border-base-300 hover:shadow-xl transition"
            >
              <div className="card-body">
                <div className="flex justify-between">
                  <img
                    src={
                      doc.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.name}`
                    }
                    className="w-16 h-16 rounded-xl border"
                  />
                  <span
                    className={`badge ${
                      doc.isAvailable ? "badge-success" : "badge-error"
                    } font-black`}
                  >
                    {doc.isAvailable ? "Active" : "Inactive"}
                  </span>
                </div>

                <h2 className="text-xl font-black mt-3">{doc.name}</h2>
                <p className="text-primary font-bold">{doc.specialization}</p>

                <div className="mt-4 space-y-2 text-sm font-bold">
                  <div className="flex gap-2 items-center">
                    <IconId size={14} /> {doc.licenseNumber}
                  </div>
                  <div className="flex gap-2 items-center">
                    <IconPhone size={14} /> {doc.phone}
                  </div>
                </div>

                <div className="mt-4 flex justify-between bg-base-300 p-2 rounded-lg font-black text-sm">
                  <span>Consultation</span>
                  <span className="text-success">₹{doc.consultationFee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
     {showModal && (
  <div className="modal modal-open">
    <div className="modal-box max-w-2xl border border-base-300 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black">Register Doctor</h3>
          <p className="text-sm opacity-60">Add a new healthcare professional to the system</p>
        </div>
        <button
          className="btn btn-sm btn-circle btn-ghost"
          onClick={() => setShowModal(false)}
        >
          <IconCircleX />
        </button>
      </div>

      <form onSubmit={handleAddDoctor} className="space-y-2">
        {/* Personal Information Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Full Name</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Dr. John Doe"
              value={doctor.user.name}
              onChange={(e) => setDoctor(p => ({ ...p, user: { ...p.user, name: e.target.value } }))}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Phone Number</legend>
            <input
              type="tel"
              className="input w-full"
              placeholder="+1 (555) 000-0000"
              value={doctor.user.phone}
              onChange={(e) => setDoctor(p => ({ ...p, user: { ...p.user, phone: e.target.value } }))}
              required
            />
          </fieldset>
        </div>

        {/* Credentials Group */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Login Credentials</legend>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <input
              type="email"
              className="input grow"
              placeholder="email@hospital.com"
              value={doctor.user.email}
              onChange={(e) => setDoctor(p => ({ ...p, user: { ...p.user, email: e.target.value } }))}
              required
            />
            <div className="input grow flex items-center gap-2">
              <IconLock size={16} className="opacity-50" />
              <input
                type={isPasswordVisible ? "text" : "password"}
                className="grow"
                placeholder="Password"
                value={doctor.user.password}
                onChange={(e) => setDoctor(p => ({ ...p, user: { ...p.user, password: e.target.value } }))}
                required
              />
              <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                {isPasswordVisible ? <IconEyeOff size={14} /> : <IconEye size={14} />}
              </button>
            </div>
          </div>
          <p className="fieldset-label">Ensure password is at least 8 characters.</p>
        </fieldset>

        {/* Professional Info Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Specialization</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g. Pediatrics"
              value={doctor.specialization}
              onChange={(e) => setDoctor(p => ({ ...p, specialization: e.target.value }))}
              required
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">License Number</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="MED-123456"
              value={doctor.licenseNumber}
              onChange={(e) => setDoctor(p => ({ ...p, licenseNumber: e.target.value }))}
              required
            />
          </fieldset>
        </div>

        {/* Pricing & File */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Consultation Fee</legend>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">$</span>
              <input
                type="number"
                className="input w-full"
                value={doctor.consultationFee}
                onChange={(e) => setDoctor(p => ({ ...p, consultationFee: Number(e.target.value) }))}
                required
              />
            </div>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Profile Photo</legend>
            <input
              type="file"
              className="file-input file-input-primary w-full"
              accept="image/*"
              onChange={(e) => e.target.files && uploadImage(e.target.files[0], doctor.user.name)}
            />
          </fieldset>
        </div>

        {/* Actions */}
        <div className="modal-action pt-4 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary px-8">
            Register Doctor
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
