"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { DoctorListResponse } from "@/Types";
import type { CreateAppointmentPayload } from "@/services/appointmentService";
import { appointmentService } from "@/services/appointmentService";
import { doctorService } from "@/services/doctorService";

const getLocalDate = () => {
  const date = new Date();
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<DoctorListResponse[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctorId, setDoctorId] = useState("");
  const [appointmentDate, setAppointmentDate] = useState(getLocalDate);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] =
    useState<CreateAppointmentPayload["appointmentType"]>("IN_PERSON");
  const [bookingFor, setBookingFor] =
    useState<CreateAppointmentPayload["bookingFor"]>("SELF");
  const [patientDetails, setPatientDetails] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let active = true;

    doctorService
      .getAvailableDoctors()
      .then((availableDoctors: DoctorListResponse[]) => {
        if (active) setDoctors(availableDoctors);
      })
      .catch(() => {
        if (active) toast.error("Unable to load available doctors");
      })
      .finally(() => {
        if (active) setLoadingDoctors(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === Number(doctorId),
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      toast.error("Select a doctor, date, and time to continue");
      return;
    }

    if (
      bookingFor === "OTHER" &&
      (!patientDetails.name.trim() ||
        !patientDetails.age ||
        !patientDetails.gender ||
        !patientDetails.phone.trim())
    ) {
      toast.error("Complete all patient details to continue");
      return;
    }

    const requestedDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`,
    );
    if (requestedDateTime.getTime() < Date.now()) {
      toast.error("Choose a future appointment time");
      return;
    }

    const payload: CreateAppointmentPayload = {
      doctorId: selectedDoctor.id,
      bookingFor,
      appointmentDate,
      appointmentTime,
      appointmentType,
      paymentMode: "IN_PERSON",
      notes: notes.trim(),
      ...(bookingFor === "OTHER"
        ? {
            patientDetails: {
              name: patientDetails.name.trim(),
              age: Number(patientDetails.age),
              gender: patientDetails.gender,
              phone: patientDetails.phone.trim(),
            },
          }
        : {}),
    };

    try {
      setSubmitting(true);
      const appointment = await appointmentService.createAppointment(payload);
      toast.success("Appointment booked successfully");
      if (appointment?.id) {
        router.push(`/patient/appointments/${appointment.id}`);
      } else {
        router.push("/patient/appointments");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to book appointment",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctors) return <Loading />;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 py-8 lg:p-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          Appointments
        </p>
        <h1 className="mt-1 text-4xl font-black">Book an appointment</h1>
        <p className="mt-2 text-base-content/70">
          Choose a doctor and appointment time. Payment is made at the clinic.
        </p>
      </header>

      {doctors.length === 0 ? (
        <section className="card border border-base-300 bg-base-200">
          <div className="card-body">
            <h2 className="card-title">No doctors are available right now</h2>
            <p>Please try again later or check the clinic directory.</p>
            <button
              type="button"
              className="btn btn-primary mt-2 w-fit"
              onClick={() => router.push("/patient/clinics")}
            >
              Find clinics
            </button>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="card border border-base-300 bg-base-200 shadow-lg"
        >
          <div className="card-body gap-5">
            <label className="form-control w-full">
              <span className="label-text mb-2 font-semibold">Doctor *</span>
              <select
                className="select select-bordered w-full"
                value={doctorId}
                onChange={(event) => setDoctorId(event.target.value)}
                required
              >
                <option value="" disabled>
                  Select a doctor
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} — {doctor.specialization}
                    {doctor.clinic?.name ? ` (${doctor.clinic.name})` : ""}
                  </option>
                ))}
              </select>
            </label>

            {selectedDoctor && (
              <div className="rounded-lg bg-base-100 p-4">
                <p className="font-bold">
                  Dr. {selectedDoctor.name} · {selectedDoctor.specialization}
                </p>
                <p className="text-sm text-base-content/70">
                  {selectedDoctor.clinic?.name}
                  {selectedDoctor.clinic?.address
                    ? ` — ${selectedDoctor.clinic.address}`
                    : ""}
                </p>
                <p className="mt-1 font-semibold text-primary">
                  Consultation fee: ₹{selectedDoctor.consultationFee ?? "—"}
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="form-control">
                <span className="label-text mb-2 font-semibold">
                  Appointment date *
                </span>
                <input
                  type="date"
                  className="input input-bordered"
                  value={appointmentDate}
                  min={getLocalDate()}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-2 font-semibold">
                  Appointment time *
                </span>
                <input
                  type="time"
                  className="input input-bordered"
                  value={appointmentTime}
                  onChange={(event) => setAppointmentTime(event.target.value)}
                  required
                />
              </label>
            </div>

            <fieldset className="form-control">
              <legend className="label-text mb-2 font-semibold">
                Consultation type *
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["IN_PERSON", "ONLINE"] as const).map((type) => (
                  <label
                    key={type}
                    className="label cursor-pointer justify-start gap-3 rounded-lg bg-base-100 p-4"
                  >
                    <input
                      type="radio"
                      name="appointmentType"
                      className="radio radio-primary"
                      checked={appointmentType === type}
                      onChange={() => setAppointmentType(type)}
                    />
                    <span className="label-text">
                      {type === "IN_PERSON" ? "In-person visit" : "Online"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="form-control">
              <legend className="label-text mb-2 font-semibold">
                Appointment for *
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["SELF", "OTHER"] as const).map((forWhom) => (
                  <label
                    key={forWhom}
                    className="label cursor-pointer justify-start gap-3 rounded-lg bg-base-100 p-4"
                  >
                    <input
                      type="radio"
                      name="bookingFor"
                      className="radio radio-primary"
                      checked={bookingFor === forWhom}
                      onChange={() => setBookingFor(forWhom)}
                    />
                    <span className="label-text">
                      {forWhom === "SELF" ? "Myself" : "Someone else"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {bookingFor === "OTHER" && (
              <section className="space-y-4 rounded-lg bg-base-100 p-4">
                <h2 className="font-bold">Patient details</h2>
                <label className="form-control">
                  <span className="label-text mb-2">Full name *</span>
                  <input
                    className="input input-bordered"
                    value={patientDetails.name}
                    onChange={(event) =>
                      setPatientDetails({
                        ...patientDetails,
                        name: event.target.value,
                      })
                    }
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="form-control">
                    <span className="label-text mb-2">Age *</span>
                    <input
                      type="number"
                      min="0"
                      max="150"
                      className="input input-bordered"
                      value={patientDetails.age}
                      onChange={(event) =>
                        setPatientDetails({
                          ...patientDetails,
                          age: event.target.value,
                        })
                      }
                      required
                    />
                  </label>
                  <label className="form-control">
                    <span className="label-text mb-2">Gender *</span>
                    <select
                      className="select select-bordered"
                      value={patientDetails.gender}
                      onChange={(event) =>
                        setPatientDetails({
                          ...patientDetails,
                          gender: event.target.value,
                        })
                      }
                      required
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                </div>
                <label className="form-control">
                  <span className="label-text mb-2">Phone number *</span>
                  <input
                    type="tel"
                    className="input input-bordered"
                    value={patientDetails.phone}
                    onChange={(event) =>
                      setPatientDetails({
                        ...patientDetails,
                        phone: event.target.value,
                      })
                    }
                    required
                  />
                </label>
              </section>
            )}

            <label className="form-control">
              <span className="label-text mb-2 font-semibold">
                Notes (optional)
              </span>
              <textarea
                className="textarea textarea-bordered"
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Share any information the doctor should know"
              />
            </label>

            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="loading loading-spinner" />
                  Booking...
                </>
              ) : (
                "Confirm appointment"
              )}
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
