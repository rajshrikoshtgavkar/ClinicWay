"use client";

import { motion } from "framer-motion";
import {
  IconUser,
  IconLock,
  IconMail,
  IconUsers,
  IconUserCircle,
  IconArrowNarrowRightDashed,
  IconEye,
  IconEyeOff,
  IconPhone,
  IconUserPlus,
  IconBuildingHospital,
  IconMapPin,
  IconHospital,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/helper/Constants";

export default function SignUpPage() {
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
    otp: "",
    role: "PATIENT" as "PATIENT" | "STAFF",
    clinicName: "",
    clinicDistrict: "",
    clinicTaluka: "",
    clinicState: "",
    clinicAddress: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [otpSent, setOtpSent] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadImage = (folderName: string, imageName: string, path: string) => {
    if (!image) {
      toast.error("No image selected");
      return;
    }
    if (imageName.trim() === "") {
      toast.error("Image name cannot be empty");
      return;
    }
    if (image) {
      if (image.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file: image,
        name: imageName,
        folderName: folderName,
      });
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setForm({ ...form, profileImage: data.data.path });
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  const verifyEmail = async () => {
    if (!form.email || !form.email.includes("@")) {
      toast.error("Enter valid email");
      return;
    }

    const req = axios.post("/api/helper/verify-email", {
      name: form.name,
      email: form.email,
    });

    toast.promise(req, {
      loading: "Sending OTP...",
      success: (res) => {
        setOtpSent(res.data.token);
        (
          document.getElementById("otpContainer") as HTMLDialogElement
        ).showModal();
        return "OTP sent successfully";
      },
      error: "Failed to send OTP",
    });
  };

  const handleRegister = async () => {
    if (!isEmailVerified) {
      toast.error("Please verify email first");
      return;
    }

    const { name, email, phone, password, confirmPassword, role } = form;

    if (!name || !email || !phone || !password) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (role === "STAFF") {
      const {
        clinicName,
        clinicDistrict,
        clinicTaluka,
        clinicState,
        clinicAddress,
      } = form;

      if (
        !clinicName ||
        !clinicDistrict ||
        !clinicTaluka ||
        !clinicState ||
        !clinicAddress
      ) {
        toast.error("Please fill all clinic details");
        return;
      }
    }

    setIsLoading(true);

    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        profileImage: form.profileImage,
        role: form.role,
      };

      // ✅ Attach clinic only for STAFF
      if (form.role === "STAFF") {
        payload.clinic = {
          name: form.clinicName,
          district: form.clinicDistrict,
          taluka: form.clinicTaluka,
          state: form.clinicState,
          address: form.clinicAddress,
        };
      }

      await axios.post("/spring-server/api/auth/signup", payload);

      toast.success("Account created successfully");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.response.data || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-base-100 shadow-2xl w-full max-w-lg z-10 border border-base-content/5"
        >
          <div className="card-body space-y-4">
            <div className="card-body p-8 lg:px-10 lg:py-4">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
                  <IconUserPlus size={40} stroke={1.5} />
                </div>
                <h1 className="text-3xl font-black tracking-tight">
                  Join Clinic<span className="text-primary">Way</span>
                </h1>
                <p className="text-sm opacity-60 font-medium">
                  Create your account to start managing appointments
                </p>
              </div>
              <>
                <label className="text-[10px] uppercase font-black opacity-50 tracking-widest mb-3 block text-center">
                  Registering as a
                </label>
                <div className="grid grid-cols-2 gap-2 bg-base-200 p-1.5 rounded-2xl">
                  {["PATIENT", "STAFF"].map((r) => (
                    <button
                      key={r}
                      onClick={() => handleInputChange("role", r)}
                      className={`py-2 px-1 rounded-xl text-xs font-black transition-all capitalize flex flex-col items-center gap-1 ${form.role === r ? "bg-base-100 text-primary shadow-sm" : "text-base-content/40 hover:text-base-content"}`}
                    >
                      {r === "PATIENT" && <IconUserCircle size={18} />}
                      {r === "STAFF" && <IconUsers size={18} />} {r}
                    </button>
                  ))}
                </div>
              </>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Full Name
                  </legend>
                  <div className="input input-primary w-full">
                    <IconUser className="opacity-30" size={18} />
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="grow"
                      value={form.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                    />
                  </div>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Phone Number
                  </legend>
                  <div className="input input-primary w-full">
                    <IconPhone className="opacity-30" size={18} />
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="grow"
                      value={form.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                    />
                  </div>
                </fieldset>
              </div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                  Email Address
                </legend>
                <div className="join">
                  <div className="input input-primary w-full join-item">
                    <IconMail className="opacity-30" size={18} />
                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      className="grow"
                      value={form.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  </div>
                  {form.email.includes("@") &&
                    form.email.includes(".") &&
                    form.email.length > 5 &&
                    form.name.length > 2 &&
                    !isEmailVerified && (
                      <button
                        className="btn btn-primary join-item"
                        onClick={verifyEmail}
                      >
                        Verify
                      </button>
                    )}
                </div>
              </fieldset>
              {/* Profile Image Field */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Profile Image <span className="text-error">*</span>
                </legend>
                <div className="join">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-primary w-full join-item"
                    disabled={form.profileImage !== "" || form.name === ""}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        setImage(files[0]);
                      }
                    }}
                  />
                  {(image || form.profileImage !== "") && (
                    <button
                      className="btn btn-secondary join-item"
                      onClick={() =>
                        uploadImage(
                          "profileImages",
                          form.name || "profile-image",
                          "profileImage",
                        )
                      }
                    >
                      Upload
                    </button>
                  )}
                </div>
              </fieldset>
            </div>

            {form.role === "STAFF" && (
              <>
                <div className="divider">Clinic Details</div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Clinic Name
                  </legend>
                  <div className="input input-primary w-full">
                    <IconHospital className="opacity-30" size={18} />
                    <input
                      type="text"
                      placeholder="Ganesh Hospital"
                      className="grow"
                      value={form.clinicName}
                      onChange={(e) =>
                        handleInputChange("clinicName", e.target.value)
                      }
                    />
                  </div>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Clinic District
                  </legend>
                  <div className="select select-primary w-full">
                    <IconHospital className="opacity-30" size={18} />
                    <select
                      className="grow"
                      value={form.clinicDistrict}
                      onChange={(e) =>
                        handleInputChange("clinicDistrict", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select District
                      </option>
                      {MAHARASHTRA_DISTRICTS.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Clinic Taluka
                  </legend>
                  <div className="select select-primary w-full">
                    <IconHospital className="opacity-30" size={18} />
                    <select
                      className="grow"
                      value={form.clinicTaluka}
                      onChange={(e) =>
                        handleInputChange("clinicTaluka", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Taluka
                      </option>
                      {MAHARASHTRA_TALUKAS[form.clinicDistrict]?.map(
                        (taluka) => (
                          <option key={taluka} value={taluka}>
                            {taluka}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Clinic State
                  </legend>
                  <div className="input input-primary w-full">
                    <IconHospital className="opacity-30" size={18} />
                    <input
                      type="text"
                      className="grow"
                      value={form.clinicState}
                      placeholder="State"
                      onChange={(e) =>
                        handleInputChange("clinicState", e.target.value)
                      }
                    />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                    Clinic Address
                  </legend>
                  <textarea
                    className="textarea textarea-primary w-full"
                    value={form.clinicAddress}
                    placeholder="Clinic Address"
                    onChange={(e) =>
                      handleInputChange("clinicAddress", e.target.value)
                    }
                  />
                </fieldset>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                  Password
                </legend>
                <div className="input input-primary w-full">
                  <IconLock className="opacity-30" size={18} />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    className="grow"
                    value={form.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                  <button
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="opacity-50 hover:opacity-100"
                  >
                    {isPasswordVisible ? (
                      <IconEyeOff size={16} />
                    ) : (
                      <IconEye size={16} />
                    )}
                  </button>
                </div>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend uppercase text-[10px] font-bold opacity-70">
                  Confirm
                </legend>
                <div className="input input-primary w-full">
                  <IconLock className="opacity-30" size={18} />
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="••••••••"
                    className="grow"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                  />
                </div>
              </fieldset>
            </div>

            <button
              onClick={handleRegister}
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-sm">
              Already have an account ?{" "}
              <Link href="/login" className="text-primary font-bold">
                Login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <dialog id="otpContainer" className="modal">
        <div className="modal-box space-y-6">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-base-content hover:text-primary transition duration-200">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-xl text-center text-base-content uppercase my-4">
            Please Enter The OTP
          </h3>

          <div className="flex justify-center gap-4">
            {/* OTP Input fields for 6 digits */}
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="input input-bordered input-primary text-center w-12 h-12 text-xl font-semibold placeholder:text-base-content/70"
                value={form.otp?.[index] ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d$/.test(value) || value === "") {
                    const otp = [...form.otp!];
                    otp[index] = value;
                    setForm({ ...form, otp: otp.join("") });
                    if (value && index < 5) {
                      document
                        .getElementById(`otp-input-${index + 1}`)
                        ?.focus();
                    }
                  }
                }}
                id={`otp-input-${index}`}
                placeholder="●"
              />
            ))}
          </div>

          <button
            className="btn btn-primary w-full mt-4 py-2"
            onClick={(e) => {
              e.preventDefault();
              if (form.otp?.length === 6 && form.otp === otpSent) {
                setIsEmailVerified(true);
                (
                  document.getElementById("otpContainer") as HTMLDialogElement
                )?.close();
                toast.success("OTP Verified", { duration: 2000 });
              } else {
                toast.error("Invalid OTP!!!", { duration: 2000 });
              }
            }}
          >
            Verify
          </button>
        </div>
      </dialog>
    </>
  );
}
