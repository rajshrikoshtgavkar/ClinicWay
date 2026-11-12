"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  IconSearch,
  IconMapPin,
  IconStethoscope,
  IconUsers,
  IconBuildingHospital,
  IconClock,
  IconCalendar,
  IconStar,
  IconPhone,
  IconMail,
  IconArrowLeft,
  IconCheck,
  IconVideo,
  IconHome,
  IconCreditCard,
  IconWallet,
  IconAlertCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import { doctorService } from "@/services/doctorService";
import { Doctor } from "@/Types";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_TALUKAS } from "@/helper/Constants";
import axios from "axios";

const ClinicCard = ({
  doctor,
  onSelect,
}: {
  doctor: Doctor;
  onSelect: () => void;
}) => {
  // Helper to generate Google Maps link
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${doctor?.clinic?.name} ${doctor?.clinic?.address} ${doctor?.clinic?.taluka} ${doctor?.clinic?.district}`,
  )}`;

  return (
    <div className="card bg-base-200 border border-base-300 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 group">
      <div className="card-body p-5">
        {/* Header Section: Doctor Profile & Status */}
        <div className="flex gap-4 items-start">
          <div className="avatar">
            <div className="w-16 h-16 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2">
              <img
                src={
                  doctor.profileImage ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=doctor"
                }
                alt={doctor?.name}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <span className="badge badge-success badge-sm text-[10px] font-bold uppercase tracking-wider">
                Available
              </span>
              <div className="flex items-center text-warning">
                <IconStar size={14} className="fill-current" />
                <span className="text-xs font-bold ml-1 text-base-content">
                  4.8
                </span>
              </div>
            </div>
            <h3 className="font-bold text-lg text-base-content group-hover:text-primary transition-colors">
              {doctor?.name}
            </h3>
            <p className="text-xs font-semibold text-primary uppercase tracking-tight">
              {doctor?.specialization}
            </p>
          </div>
        </div>

        <div className="divider my-1 opacity-50"></div>

        {/* Clinic Info Section */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-bold flex items-center gap-1">
              <IconBuildingHospital
                size={16}
                className="text-base-content/60"
              />
              {doctor?.clinic?.name}
            </h4>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-base-content/70 flex items-start gap-1 mt-1 hover:text-primary hover:underline transition-all"
            >
              <IconMapPin size={14} className="mt-0.5 shrink-0" />
              <span>
                {doctor?.clinic?.address}, {doctor?.clinic?.taluka}
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-base-200/50 p-3 rounded-lg">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase opacity-50 font-bold">
                Queue
              </span>
              <span className="text-sm font-bold flex items-center gap-1">
                <IconUsers size={14} /> 12 patients
              </span>
            </div>
            <div className="flex flex-col border-l border-base-300 pl-3">
              <span className="text-[10px] uppercase opacity-50 font-bold">
                Fee
              </span>
              <span className="text-sm font-bold text-success">
                ₹{doctor?.consultationFee}
              </span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="card-actions mt-4">
          <button
            onClick={onSelect}
            className="btn btn-primary btn-block shadow-lg shadow-primary/20 group-hover:scale-[1.02] transition-transform"
          >
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ClinicDiscovery() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState<string>("DISCOVER");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentType, setAppointmentType] = useState<
    "ONLINE" | "IN_PERSON" | null
  >(null);

  const [bookingFor, setBookingFor] = useState<"SELF" | "OTHER" | null>(null);

  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });

  const [paymentMode, setPaymentMode] = useState<"ONLINE" | "IN_PERSON" | null>(
    null,
  );

  const resetBookingState = () => {
    setSelectedDoctor(null);
    setAppointmentType(null);
    setBookingFor(null);
    setPaymentMode(null);
    setPatientDetails({
      name: "",
      age: "",
      gender: "",
      phone: "",
    });
  };

  useEffect(() => {
    const initFetch = async () => {
      try {
        setLoading(true);
        const doctorData = await doctorService.getAvailableDoctors();
        setDoctors(doctorData || []);
      } catch (error) {
        toast.error("Failed to sync with medical database");
      } finally {
        setLoading(false);
      }
    };
    initFetch();
  }, []);

  // Inside ClinicDiscovery component
  const handleRazorpayPayment = async (
    appointmentId: string,
    amount: number,
  ) => {
    try {
      // 1. Create Order on Backend
      const { data: order } = await axios.post(
        "http://localhost:8080/api/payments/create-order",
        {
          appointmentId,
          amount: amount * 100, // Razorpay expects paise
          currency: "INR",
        },
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Clinic Connect",
        description: `Appointment with ${selectedDoctor?.user.name}`,
        order_id: order.razorpayOrderId,
        handler: async (response: any) => {
          // 2. Verify Payment on Backend
          try {
            await axios.post("http://localhost:8080/api/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              appointmentId: appointmentId,
            });
            toast.success("Payment Successful!");
            setActiveView("DISCOVER");
            resetBookingState();
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: bookingFor === "SELF" ? "User" : patientDetails.name,
          contact: bookingFor === "SELF" ? "" : patientDetails.phone,
        },
        theme: { color: "#570df8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Could not initiate payment");
    }
  };
  useEffect(() => {
    if (appointmentType === "ONLINE") {
      setPaymentMode("ONLINE");
    }
  }, [appointmentType]);

  const filteredDoctors = doctors.filter((doc) => {
  const docDistrict = doc?.clinic?.district;
  const docTaluka = doc?.clinic?.taluka;

  if (district && docDistrict !== district) return false;
  if (taluka && docTaluka !== taluka) return false;
  
  return true;
});

  const bookAppointment = async () => {
    if (!selectedDoctor) return;

    if (appointmentType === "ONLINE" && paymentMode === "ONLINE") {
      await initiateOnlinePayment();
    } else {
      await createAppointment(); // IN_PERSON flow
    }
  };

  const createAppointment = async (paymentDetails?: any) => {
    const payload: any = {
      doctorId: selectedDoctor!.id,
      appointmentDate: new Date().toISOString().split("T")[0],
      appointmentTime: `${new Date()
        .getHours()
        .toString()
        .padStart(2, "0")}:${new Date()
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      appointmentType,
      bookingFor,
      paymentMode,
      notes: "",
      paymentDetails, // optional
    };

    if (bookingFor === "OTHER") {
      payload.patientDetails = {
        name: patientDetails.name,
        age: Number(patientDetails.age),
        gender: patientDetails.gender,
        phone: patientDetails.phone,
      };
    }

    await axios.post("/spring-server/api/appointment/create", payload);

    toast.success("Appointment booked successfully!");
    resetBookingState();
    setActiveView("DISCOVER");
  };

  const initiateOnlinePayment = async () => {
    try {
      // 1️⃣ Create Razorpay order (NO appointment yet)
      const { data: order } = await axios.post(
        "/spring-server/api/payments/create-order",
        {
          amount: selectedDoctor!.consultationFee * 100,
          currency: "INR",
        },
      );

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Clinic Way",
        description: `Appointment with ${selectedDoctor?.name}`,
        order_id: order.razorpayOrderId,

        handler: async (response: any) => {
          try {
            // 2️⃣ Verify payment
            const verifyRes = await axios.post(
              "/spring-server/api/payments/verify",
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            );

            // 3️⃣ Payment success → NOW create appointment
            await createAppointment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              method: "ONLINE",
            });

            toast.success("Payment successful & appointment confirmed!");
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },

        prefill: {
          name: bookingFor === "SELF" ? "User" : patientDetails.name,
          contact: bookingFor === "SELF" ? "" : patientDetails.phone,
        },

        theme: { color: "#570df8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Unable to initiate payment");
    }
  };
  if (loading) return <Loading />;

  return (
    <div className="px-4 py-8">
      {activeView === "DISCOVER" && (
        <>
          <div className="mx-auto">
            <div className="mb-4">
              <h1 className="text-4xl font-black tracking-tight text-base-content">
                Find A <span className="text-primary">Clinic</span>
              </h1>
              <p className="text-base-content/70 mt-2">
                View and book appointments with certified doctors in your
                region.
              </p>
            </div>

            <div className="card bg-base-200 shadow mb-8">
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Select District</legend>
                    <select
                      className="select select-primary w-full"
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value);
                        setTaluka("");
                      }}
                    >
                      <option value="">All Districts</option>
                      {MAHARASHTRA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </fieldset>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Select Taluka</legend>
                    <select
                      className="select select-primary w-full"
                      value={taluka}
                      onChange={(e) => setTaluka(e.target.value)}
                    >
                      <option value="">All Talukas</option>
                      {district &&
                        MAHARASHTRA_TALUKAS[district]?.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>
                  </fieldset>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card bg-base-200 shadow p-6 flex flex-row items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <IconBuildingHospital size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-60">Results</p>
                  <p className="text-2xl font-bold">{filteredDoctors.length}</p>
                </div>
              </div>
              <div className="card bg-base-200 shadow p-6 flex flex-row items-center gap-4">
                <div className="p-3 bg-success/10 text-success rounded-lg">
                  <IconStethoscope size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-60">
                    Specializations
                  </p>
                  <p className="text-2xl font-bold">
                    {new Set(filteredDoctors.map((d) => d.specialization)).size}
                  </p>
                </div>
              </div>
              <div className="card bg-base-200 shadow p-6 flex flex-row items-center gap-4">
                <div className="p-3 bg-info/10 text-info rounded-lg">
                  <IconUsers size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-60">
                    Availability
                  </p>
                  <p className="text-2xl font-bold">Immediate</p>
                </div>
              </div>
            </div>

            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doc, idx) => (
                  <ClinicCard
                    key={idx}
                    doctor={doc}
                    onSelect={() => {
                      setSelectedDoctor(doc);
                      setActiveView("VIEW");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-base-200 rounded-box border-2 border-dashed border-base-300">
                <IconSearch className="mx-auto mb-4 opacity-20" size={48} />
                <p className="text-lg font-medium opacity-50">
                  No doctors found in this location
                </p>
                <button
                  className="btn btn-ghost btn-sm mt-4 underline"
                  onClick={() => {
                    setDistrict("");
                    setTaluka("");
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {activeView === "VIEW" && selectedDoctor && (
        <>
          <button
            className="btn btn-ghost gap-2 mb-4"
            onClick={() => setActiveView("DISCOVER")}
          >
            <IconArrowLeft size={20} />
            Back to Search
          </button>

          <div className="card bg-base-200 shadow">
            <div className="card-body p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedDoctor.clinic.name}
                  </h2>
                  <div className="flex items-center gap-2 text-base-content/70 mb-4">
                    <IconMapPin size={18} />
                    <span>
                      {selectedDoctor.clinic.address},{" "}
                      {selectedDoctor.clinic.taluka},{" "}
                      {selectedDoctor.clinic.district}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-success gap-2">
                      <IconCheck size={14} />
                      Available Now
                    </div>
                    <div className="flex items-center gap-1">
                      <IconStar
                        size={16}
                        className="text-warning fill-warning"
                      />
                      <span className="font-semibold">4.8</span>
                      <span className="text-sm opacity-60">(127 reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconStethoscope size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Doctor</p>
                      <p className="font-bold">{selectedDoctor.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-info/10 rounded-lg">
                      <IconInfoCircle size={20} className="text-info" />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Specialization</p>
                      <p className="font-bold">
                        {selectedDoctor.specialization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <IconClock size={20} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Experience</p>
                      <p className="font-bold">15 years</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <IconCalendar size={20} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Timing</p>
                      <p className="font-bold">
                        {selectedDoctor.availableSlots}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-error/10 rounded-lg">
                      <IconUsers size={20} className="text-error" />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Current Queue</p>
                      <p className="font-bold">12 patients waiting</p>
                      <p className="text-xs opacity-60">
                        Avg. wait: 15 mins/patient
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <IconWallet size={20} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm opacity-60">Consultation Fee</p>
                      <p className="text-2xl font-bold text-primary">
                        ₹{selectedDoctor.consultationFee}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="alert alert-info">
                <IconInfoCircle size={20} />
                <div>
                  <p className="font-semibold">Estimated Wait Time</p>
                  <p className="text-sm opacity-80">
                    Approximately 3 hours based on current queue
                  </p>
                </div>
              </div>

              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary w-full gap-2"
                  onClick={() => setActiveView("BOOKING")}
                >
                  <IconCalendar size={20} />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === "BOOKING" && (
        <>
          <button
            className="btn btn-ghost gap-2 mb-4"
            onClick={() => setActiveView("VIEW")}
          >
            <IconArrowLeft size={20} />
            Back
          </button>

          <div className="card bg-base-200 shadow">
            <div className="card-body p-8">
              <h2 className="text-2xl font-bold mb-6">
                Choose Consultation Type
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`card ${
                    appointmentType === "IN_PERSON"
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 hover:bg-base-300"
                  } transition-all`}
                  onClick={() => setAppointmentType("IN_PERSON")}
                >
                  <div className="card-body items-center text-center p-6">
                    <IconHome
                      size={48}
                      className={
                        appointmentType === "IN_PERSON" ? "" : "opacity-60"
                      }
                    />
                    <h3 className="card-title text-lg">In-Person Visit</h3>
                    <p
                      className={`text-sm ${
                        appointmentType === "IN_PERSON"
                          ? "opacity-90"
                          : "opacity-60"
                      }`}
                    >
                      Visit hospital for consultation
                    </p>
                  </div>
                </button>

                <button
                  className={`card ${
                    appointmentType === "ONLINE"
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 hover:bg-base-300"
                  } transition-all`}
                  onClick={() => setAppointmentType("ONLINE")}
                >
                  <div className="card-body items-center text-center p-6">
                    <IconVideo
                      size={48}
                      className={
                        appointmentType === "ONLINE" ? "" : "opacity-60"
                      }
                    />
                    <h3 className="card-title text-lg">Online Consultation</h3>
                    <p
                      className={`text-sm ${
                        appointmentType === "ONLINE"
                          ? "opacity-90"
                          : "opacity-60"
                      }`}
                    >
                      Video call with doctor
                    </p>
                  </div>
                </button>
              </div>

              {appointmentType && (
                <div className="alert alert-warning mt-6">
                  <IconAlertCircle size={20} />
                  <span className="text-sm">
                    {appointmentType === "ONLINE"
                      ? "Online consultation requires stable internet connection"
                      : "Please arrive 10 minutes before your appointment time"}
                  </span>
                </div>
              )}

              <div className="card-actions justify-end mt-6">
                <button
                  className="btn btn-primary w-full"
                  disabled={!appointmentType}
                  onClick={() => setActiveView("DETAILS")}
                >
                  Continue to Patient Details
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === "DETAILS" && (
        <>
          <button
            className="btn btn-ghost gap-2 mb-4"
            onClick={() => setActiveView("BOOKING")}
          >
            <IconArrowLeft size={20} />
            Back
          </button>

          <div className="card bg-base-200 shadow">
            <div className="card-body p-8 space-y-6">
              <h2 className="text-2xl font-bold">Patient Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`btn w-full ${
                    bookingFor === "SELF" ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => setBookingFor("SELF")}
                >
                  For Myself
                </button>

                <button
                  className={`btn w-full ${
                    bookingFor === "OTHER" ? "btn-primary" : "btn-outline"
                  }`}
                  onClick={() => setBookingFor("OTHER")}
                >
                  For Someone Else
                </button>
              </div>

              {bookingFor === "OTHER" && (
                <div className="space-y-4 p-6 bg-base-100 rounded-lg">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Patient Name <span className="text-error">*</span>
                    </legend>
                    <input
                      className="input input-primary w-full"
                      placeholder="Enter full name"
                      value={patientDetails.name}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          name: e.target.value,
                        })
                      }
                    />
                  </fieldset>

                  <div className="grid grid-cols-2 gap-4">
                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Patient Age <span className="text-error">*</span>
                      </legend>
                      <input
                        type="number"
                        className="input input-primary w-full"
                        placeholder="Age"
                        value={patientDetails.age}
                        onChange={(e) =>
                          setPatientDetails({
                            ...patientDetails,
                            age: e.target.value,
                          })
                        }
                      />
                    </fieldset>

                    <fieldset className="fieldset">
                      <legend className="fieldset-legend">
                        Patient Gender <span className="text-error">*</span>
                      </legend>
                      <select
                        className="select select-primary w-full"
                        value={patientDetails.gender}
                        onChange={(e) =>
                          setPatientDetails({
                            ...patientDetails,
                            gender: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </fieldset>
                  </div>

                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Patient Phone Number <span className="text-error">*</span>
                    </legend>
                    <input
                      type="tel"
                      className="input input-primary w-full"
                      placeholder="+91 XXXXX XXXXX"
                      value={patientDetails.phone}
                      onChange={(e) =>
                        setPatientDetails({
                          ...patientDetails,
                          phone: e.target.value,
                        })
                      }
                    />
                  </fieldset>
                </div>
              )}

              <div className="divider">Payment Method</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  className={`card ${
                    paymentMode === "IN_PERSON"
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 hover:bg-base-300"
                  } transition-all`}
                  disabled={appointmentType === "ONLINE"}
                  onClick={() => setPaymentMode("IN_PERSON")}
                >
                  <div className="card-body items-center text-center p-6">
                    <IconWallet
                      size={40}
                      className={
                        paymentMode === "IN_PERSON" ? "" : "opacity-60"
                      }
                    />
                    <h3 className="card-title text-lg">Pay at Clinic</h3>
                    <p
                      className={`text-sm ${
                        paymentMode === "IN_PERSON"
                          ? "opacity-90"
                          : "opacity-60"
                      }`}
                    >
                      Pay cash during visit
                    </p>
                  </div>
                </button>

                <button
                  className={`card ${
                    paymentMode === "ONLINE"
                      ? "bg-primary text-primary-content"
                      : "bg-base-100 hover:bg-base-300"
                  } transition-all`}
                  onClick={() => setPaymentMode("ONLINE")}
                >
                  <div className="card-body items-center text-center p-6">
                    <IconCreditCard
                      size={40}
                      className={paymentMode === "ONLINE" ? "" : "opacity-60"}
                    />
                    <h3 className="card-title text-lg">Pay Online</h3>
                    <p
                      className={`text-sm ${
                        paymentMode === "ONLINE" ? "opacity-90" : "opacity-60"
                      }`}
                    >
                      Pay now and confirm booking
                    </p>
                  </div>
                </button>
              </div>

              <div className="card bg-base-100">
                <div className="card-body">
                  <h3 className="font-bold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-70">Doctor</span>
                      <span className="font-semibold">
                        {selectedDoctor?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Consultation Type</span>
                      <span className="font-semibold">
                        {appointmentType === "ONLINE" ? "Online" : "In-Person"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Current Queue</span>
                      <span className="font-semibold">12 patients</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Consultation Fee</span>
                      <span className="font-bold text-primary">
                        ₹{selectedDoctor?.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="btn btn-success w-full gap-2"
                disabled={
                  !bookingFor ||
                  !paymentMode ||
                  (appointmentType === "ONLINE" && !paymentMode)
                }
                onClick={bookAppointment}
              >
                <IconCheck size={20} />
                {paymentMode === "ONLINE"
                  ? "Proceed to Payment"
                  : "Confirm Appointment"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
