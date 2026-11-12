"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import clinicService from "@/services/clinicService";
import doctorService from "@/services/doctorService";

export default function ClinicPage() {
  const params = useParams();
  const router = useRouter();
  const clinicId = params.id as string;

  const [clinic, setClinic] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch clinic details
        const clinicData = await clinicService.getClinicById(
          parseInt(clinicId)
        );
        setClinic(clinicData);
        console.log("Clinic data:", clinicData);

        // Fetch doctors for this clinic
        const doctorsData = await doctorService.getDoctorsByClinic(
          parseInt(clinicId)
        );
        setDoctors(doctorsData || []);
        console.log("Doctors data:", doctorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error loading clinic details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clinicId]);

  const handleSelectDoctor = (doctorId: number) => {
    router.push(`/doctor/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button className="btn btn-ghost mb-4" onClick={() => router.back()}>
          ← Back
        </button>

        {/* Clinic Details */}
        {clinic && (
          <div className="card bg-base-100 shadow-lg mb-8">
            <div className="card-body">
              <h1 className="card-title text-4xl mb-2">{clinic.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{clinic.city}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">
                    <span className="font-semibold">Address:</span>{" "}
                    {clinic.address}
                  </p>
                  <p className="text-sm mt-2">
                    <span className="font-semibold">Phone:</span> {clinic.phone}
                  </p>
                  {clinic.email && (
                    <p className="text-sm mt-2">
                      <span className="font-semibold">Email:</span>{" "}
                      {clinic.email}
                    </p>
                  )}
                </div>
                <div>
                  {clinic.openingTime && clinic.closingTime && (
                    <p className="text-sm">
                      <span className="font-semibold">Hours:</span>{" "}
                      {clinic.openingTime} - {clinic.closingTime}
                    </p>
                  )}
                  {clinic.description && (
                    <p className="text-sm mt-2">
                      <span className="font-semibold">Description:</span>{" "}
                      {clinic.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctors List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {doctors.length > 0
              ? `${doctors.length} Doctor${
                  doctors.length !== 1 ? "s" : ""
                } Available`
              : "No Doctors Available"}
          </h2>

          {doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-xl">
                      Dr. {doctor.fullName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {doctor.specialization}
                    </p>
                    {doctor.consultationFee && (
                      <p className="text-sm mt-2">
                        <span className="font-semibold">Consultation Fee:</span>{" "}
                        ₹{doctor.consultationFee}
                      </p>
                    )}
                    {doctor.bio && <p className="text-sm mt-2">{doctor.bio}</p>}
                    {doctor.isArrived !== undefined && (
                      <div className="mt-3">
                        <div
                          className="badge badge-sm"
                          style={{
                            backgroundColor: doctor.isArrived
                              ? "green"
                              : "gray",
                            color: "white",
                          }}
                        >
                          {doctor.isArrived ? "Arrived" : "Not Arrived"}
                        </div>
                      </div>
                    )}
                    <div className="card-actions justify-end mt-4">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleSelectDoctor(doctor.id)}
                      >
                        View & Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <div>No doctors available at this clinic currently.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
