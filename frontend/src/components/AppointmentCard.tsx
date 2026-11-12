import React from "react";

interface AppointmentCardProps {
  id: number;
  tokenNo: number;
  appointmentDate: string;
  status: string;
  bookingType: string;
  doctorName: string;
  clinicName: string;
}

export default function AppointmentCard({
  id,
  tokenNo,
  appointmentDate,
  status,
  bookingType,
  doctorName,
  clinicName,
}: AppointmentCardProps) {
  const appointmentDate_formatted = new Date(
    appointmentDate
  ).toLocaleDateString();

  return (
    <div className="card bg-base-100 shadow-md border border-gray-300">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-2xl font-bold text-primary">
              Token #{tokenNo}
            </h2>
            <p className="text-gray-600">Dr. {doctorName}</p>
            <p className="text-sm text-gray-500">{clinicName}</p>
          </div>
          <span className={`badge badge-lg ${getStatusBadgeClass(status)}`}>
            {status}
          </span>
        </div>

        <div className="divider my-2"></div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{appointmentDate_formatted}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Type:</span>
            <span>{bookingType}</span>
          </div>
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-outline btn-sm">View Details</button>
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "badge-success";
    case "IN_PROGRESS":
      return "badge-warning";
    case "CONFIRMED":
      return "badge-info";
    case "PENDING":
      return "badge-secondary";
    case "CANCELLED":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}
