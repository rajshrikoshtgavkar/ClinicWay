import React from "react";
import {
  IconMapPin,
  IconStethoscope,
  IconUsers,
  IconChevronRight,
} from "@tabler/icons-react";

export default function ClinicCard({
  clinicName,
  district,
  taluka,
  doctors,
  specializations,
  totalDoctors,
  onSelectClinic,
}: any) {
  return (
    <div className="group card bg-base-100 border border-base-300 hover:border-primary transition-all duration-300 rounded-4xl overflow-hidden">
      <div className="card-body p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-black group-hover:text-primary transition-colors leading-tight">
            {clinicName}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-sm font-bold opacity-60 mb-6">
          <IconMapPin size={16} className="text-primary" />
          <span>
            {taluka}, {district}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-base-200 mb-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
              Medical Staff
            </p>
            <div className="flex items-center gap-2 font-bold text-lg">
              <IconUsers size={18} className="text-primary" /> {totalDoctors}
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
              Services
            </p>
            <div className="flex items-center gap-2 font-bold text-lg">
              <IconStethoscope size={18} className="text-emerald-500" />{" "}
              {specializations.length}
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">
            Top Specialists
          </p>
          <div className="space-y-2">
            {doctors.slice(0, 2).map((doc: any) => (
              <div key={doc.id} className="flex justify-between text-sm">
                <span className="font-bold">{doc.name}</span>
                <span className="opacity-60">{doc.specialization}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onSelectClinic}
          className="btn btn-primary w-full rounded-2xl shadow-lg shadow-primary/20 group-hover:gap-4 transition-all"
        >
          View & Book <IconChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
