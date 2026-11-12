import React, { useState } from "react";

interface BookingFormProps {
  doctorId: number;
  doctorName: string;
  onBook: (data: any) => void;
  isLoading: boolean;
}

export default function BookingForm({
  doctorId,
  doctorName,
  onBook,
  isLoading,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: "",
    bookingType: "ONLINE",
    isOnline: true,
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientId || !formData.appointmentDate) {
      alert("Please fill in all required fields");
      return;
    }

    onBook({
      patientId: parseInt(formData.patientId),
      doctorId,
      appointmentDate: formData.appointmentDate,
      bookingType: formData.bookingType,
      isOnline: formData.isOnline,
      notes: formData.notes,
    });
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-2xl">Book Appointment</h2>
        <p className="text-gray-600">Dr. {doctorName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Patient ID *</span>
            </label>
            <input
              type="number"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              placeholder="Enter your patient ID"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Appointment Date *
              </span>
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              className="input input-bordered"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Booking Type</span>
            </label>
            <select
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              className="select select-bordered"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline (Walk-in)</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">Online Consultation</span>
              <input
                type="checkbox"
                name="isOnline"
                checked={formData.isOnline}
                onChange={handleChange}
                className="checkbox"
              />
            </label>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Notes</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes..."
              className="textarea textarea-bordered h-24"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner"></span>
                Booking...
              </>
            ) : (
              "Book Appointment"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
