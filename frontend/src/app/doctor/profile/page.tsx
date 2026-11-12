"use client";

import { useEffect, useState } from "react";
import {
  getDoctorProfile,
  updateDoctorProfile,
  DoctorProfile as Doctor,
  UpdateDoctorProfileRequest,
} from "@/services/doctorProfileService";
import {
  IconStethoscope,
  IconMail,
  IconPhone,
  IconId,
  IconCash,
  IconClock,
  IconTextCaption,
  IconEdit,
  IconX,
  IconDeviceFloppy,
  IconBuildingHospital,
  IconMapPin,
  IconShieldCheck,
  IconUserCircle,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export default function DoctorProfile() {
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateDoctorProfileRequest>>(
    {},
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getDoctorProfile();
        setProfile(response);
        setFormData(response);
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await updateDoctorProfile(
        formData as UpdateDoctorProfileRequest,
      );
      setProfile(response);
      setEditing(false);
      toast.success("Professional profile updated!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-primary-content border-4 border-base-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <IconStethoscope size={40} stroke={2.5} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-success w-6 h-6 rounded-full border-4 border-base-100"></div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              {profile.name}
            </h1>
            <p className="text-primary font-black text-xs tracking-[0.2em] uppercase mt-2 bg-primary/10 w-fit px-2 py-1 rounded">
              {profile.specialization}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (editing) setFormData(profile);
            setEditing(!editing);
          }}
          className={`btn ${editing ? "btn-outline btn-neutral" : "btn-neutral"} btn-wide gap-2 border-2 font-black uppercase text-xs tracking-widest h-14 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all`}
        >
          {editing ? (
            <>
              <IconX size={18} stroke={3} /> Cancel Edit
            </>
          ) : (
            <>
              <IconEdit size={18} stroke={3} /> Edit Credentials
            </>
          )}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Sidebar: Contact & Clinic */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-base-200 border-2 border-base-content rounded-3xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="card-body p-6">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-base-100 border-2 border-base-content rounded-lg">
                    <IconMail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-50 leading-none">
                      Email Address
                    </p>
                    <p className="font-bold text-sm truncate">
                      {profile.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-base-100 border-2 border-base-content rounded-lg">
                    <IconPhone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-50 leading-none">
                      Phone Number
                    </p>
                    <p className="font-bold text-sm">{profile.phone}</p>
                  </div>
                </div>
              </div>

              <div className="divider before:bg-base-content/20 after:bg-base-content/20"></div>

              <div className="flex items-center gap-3 mb-2">
                <IconBuildingHospital size={20} className="text-primary" />
                <h3 className="font-black uppercase tracking-widest text-xs">
                  Current Clinic
                </h3>
              </div>
              <div className="bg-base-100 p-4 border-2 border-base-content rounded-2xl">
                <p className="font-black text-sm uppercase mb-1">
                  City General Health
                </p>
                <div className="flex items-start gap-1 text-[10px] font-bold opacity-60 uppercase">
                  <IconMapPin size={12} className="shrink-0" />
                  <span>Maharashtra, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-neutral text-neutral-content rounded-3xl border-2 border-neutral shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]">
            <div className="flex gap-4">
              <IconShieldCheck size={32} className="text-primary" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1">
                  Verified Professional
                </p>
                <p className="text-[10px] font-bold opacity-70">
                  Licensure status is active and verified by the health board.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Professional Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 border-2 border-base-content rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="card-body p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* License */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-[0.2em] opacity-50">
                      License Number
                    </span>
                  </label>
                  <div className="relative">
                    <IconId
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      name="licenseNumber"
                      disabled={true} // Usually non-editable for security
                      value={profile.licenseNumber}
                      className="input input-bordered w-full pl-12 font-black border-2 border-base-content/20 disabled:bg-base-300/50 disabled:opacity-100"
                    />
                  </div>
                </div>

                {/* Consultation Fee */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-[0.2em] opacity-50">
                      Consultation Fee (₹)
                    </span>
                  </label>
                  <div className="relative">
                    <IconCash
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      name="consultationFee"
                      type="number"
                      disabled={!editing}
                      value={formData.consultationFee || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-12 font-black border-2 border-base-content focus:border-primary disabled:bg-base-100"
                    />
                  </div>
                </div>

                {/* Schedule */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-[0.2em] opacity-50">
                      Availability Schedule
                    </span>
                  </label>
                  <div className="relative">
                    <IconClock
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      name="availableSlots"
                      disabled={!editing}
                      placeholder="e.g., Mon-Fri, 10:00 AM - 04:00 PM"
                      value={formData.availableSlots || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-12 font-black border-2 border-base-content focus:border-primary disabled:bg-base-100"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-[0.2em] opacity-50">
                      Professional Biography
                    </span>
                  </label>
                  <div className="relative">
                    <IconTextCaption
                      className="absolute left-4 top-4 opacity-30"
                      size={18}
                    />
                    <textarea
                      name="bio"
                      disabled={!editing}
                      value={formData.bio || ""}
                      onChange={handleChange}
                      rows={5}
                      className="textarea textarea-bordered w-full pl-12 font-bold border-2 border-base-content focus:border-primary leading-relaxed disabled:bg-base-100 disabled:opacity-100"
                      placeholder="Share your clinical background and expertise..."
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="mt-10 animate-in fade-in slide-in-from-bottom-2">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-primary w-full h-14 font-black uppercase text-sm tracking-widest border-2 border-base-content shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                  >
                    {isSaving ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <IconDeviceFloppy size={20} stroke={3} /> Save
                        Professional Record
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
