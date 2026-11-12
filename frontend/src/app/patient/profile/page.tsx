"use client";

import { useEffect, useState } from "react";
import { patientService } from "@/services/patientService";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconCalendarEvent,
  IconGenderTransgender,
  IconMapPin,
  IconHistory,
  IconEdit,
  IconCamera,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PatientProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  medicalHistory: string;
  profileImage?: string;
}

export default function PatientProfile() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PatientProfile>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await patientService.getPatientProfile();
        const profileData = response.data || response;
        setProfile(profileData as PatientProfile);
        setFormData(profileData);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      formData.age = Number(formData.age) || 0;
      const response = await patientService.updatePatientProfile(
        formData as any,
      );
      const updatedProfile = response.data || response;
      setProfile(updatedProfile as PatientProfile);
      setFormData(updatedProfile);
      setEditing(false);
      // Show success message
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
      console.error("Error updating profile:", err);
      toast.error(
        "Failed to update profile: " + (err.message || "Unknown error"),
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-error">{error}</div>;
  if (!profile) return <div className="text-error">No profile data found</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl bg-primary/10 border-4 border-base-100 shadow-xl overflow-hidden flex items-center justify-center">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <IconUser size={64} className="text-primary opacity-40" />
              )}
            </div>
            {editing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <IconCamera className="text-white" />
                <input type="file" className="hidden" accept="image/*" />
              </label>
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tight">
              {profile?.name}
            </h1>
            <p className="text-primary font-bold flex items-center justify-center md:justify-start gap-2">
              <IconMail size={16} /> {profile?.email}
            </p>
          </div>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary btn-wide shadow-lg gap-2"
          >
            <IconEdit size={20} /> Edit My Profile
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 border border-base-300 shadow-sm">
            <div className="card-body gap-6">
              <h2 className="text-xl font-black flex items-center gap-2 mb-2">
                <IconUser className="text-primary" /> General Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Full Name
                  </legend>
                  <input
                    name="name"
                    disabled={!editing}
                    className={`input w-full font-bold ${
                      editing ? "input-primary" : "input-ghost"
                    }`}
                    value={formData.name || ""}
                    onChange={handleChange}
                  />
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Phone Number
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconPhone size={18} className="opacity-30" />
                    <input
                      name="phone"
                      disabled={!editing}
                      className={`input w-full font-bold ${
                        editing ? "input-primary" : "input-ghost"
                      }`}
                      value={formData.phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Age
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconCalendarEvent size={18} className="opacity-30" />
                    <input
                      name="age"
                      type="number"
                      disabled={!editing}
                      className={`input w-full font-bold ${
                        editing ? "input-primary" : "input-ghost"
                      }`}
                      value={formData.age || ""}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Gender
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconGenderTransgender size={18} className="opacity-30" />
                    {editing ? (
                      <select
                        name="gender"
                        className="select select-primary w-full font-bold"
                        value={formData.gender || ""}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <input
                        disabled
                        className="input input-ghost w-full font-bold"
                        value={formData.gender || ""}
                      />
                    )}
                  </div>
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="fieldset-legend uppercase font-black opacity-40">
                  Home Address
                </legend>
                <div className="flex gap-3">
                  <IconMapPin size={18} className="opacity-30 mt-3" />
                  <textarea
                    name="address"
                    disabled={!editing}
                    rows={2}
                    className={`textarea w-full font-bold ${
                      editing ? "textarea-primary" : "textarea-ghost"
                    }`}
                    value={formData.address || ""}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        {/* Right Column: Medical History & Actions */}
        <div className="space-y-6">
          <div className="card bg-primary text-primary-content shadow-xl overflow-hidden relative">
            <IconHistory className="absolute -right-4 -top-4 w-32 h-32 opacity-10" />
            <div className="card-body relative z-10">
              <h2 className="text-xl font-black flex items-center gap-2">
                Medical Records
              </h2>
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend text-primary-content/60 font-black">
                  History & Allergies
                </legend>
                <textarea
                  name="medicalHistory"
                  disabled={!editing}
                  rows={6}
                  className={`textarea w-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-medium ${
                    editing
                      ? "border-white/50 focus:border-white"
                      : "border-none"
                  }`}
                  placeholder="List your medical history..."
                  value={formData.medicalHistory || ""}
                  onChange={handleChange}
                />
              </fieldset>
            </div>
          </div>

          {editing && (
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary shadow-lg gap-2"
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <IconCheck size={20} /> Save All Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile!);
                }}
                className="btn btn-neutral gap-2"
              >
                <IconX size={20} /> Discard Changes
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
