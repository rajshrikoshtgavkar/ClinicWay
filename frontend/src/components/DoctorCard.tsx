import React from "react";

interface DoctorCardProps {
  id: number;
  fullName: string;
  specialization: string;
  consultationFee?: number;
  isArrived?: boolean;
  onSelect: (id: number) => void;
}

export default function DoctorCard({
  id,
  fullName,
  specialization,
  consultationFee,
  isArrived,
  onSelect,
}: DoctorCardProps) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="card-body">
        <h2 className="card-title text-lg">{fullName}</h2>
        <p className="text-sm text-gray-600">{specialization}</p>
        {consultationFee && (
          <p className="text-sm">
            <span className="font-semibold">Consultation Fee:</span> ₹
            {consultationFee}
          </p>
        )}
        {isArrived !== undefined && (
          <div
            className="badge badge-sm"
            style={{
              backgroundColor: isArrived ? "green" : "gray",
              color: "white",
            }}
          >
            {isArrived ? "Arrived" : "Not Arrived"}
          </div>
        )}
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(id)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
