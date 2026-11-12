import React from "react";

interface QueueDisplayProps {
  doctorName: string;
  clinicName: string;
  totalQueue: number;
  completed: number;
  inProgress: number;
  pending: number;
  currentTokenServing?: number;
  queue: any[];
}

export default function QueueDisplay({
  doctorName,
  clinicName,
  totalQueue,
  completed,
  inProgress,
  pending,
  currentTokenServing,
  queue,
}: QueueDisplayProps) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-2xl">{doctorName}</h2>
        <p className="text-gray-600">{clinicName}</p>

        <div className="divider"></div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="stat place-items-center">
            <div className="stat-title">Total Queue</div>
            <div className="stat-value text-primary">{totalQueue}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Completed</div>
            <div className="stat-value text-success">{completed}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">In Progress</div>
            <div className="stat-value text-warning">{inProgress}</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-info">{pending}</div>
          </div>
        </div>

        {currentTokenServing && (
          <div className="alert alert-success shadow-lg mt-4">
            <div>
              <span className="text-xl font-bold">
                Currently Serving: Token #{currentTokenServing}
              </span>
            </div>
          </div>
        )}

        <div className="divider">Queue List</div>

        {queue && queue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Name</th>
                  <th>Status</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="font-bold text-lg">
                      #{appointment.tokenNo}
                    </td>
                    <td>{appointment.patient?.fullName || "N/A"}</td>
                    <td>
                      <span
                        className={`badge ${getBadgeClass(appointment.status)}`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>{appointment.bookingType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">
            <div>No appointments for today yet.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function getBadgeClass(status: string): string {
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
