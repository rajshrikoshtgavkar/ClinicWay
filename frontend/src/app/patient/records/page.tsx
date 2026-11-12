"use client";

import { useState } from "react";
import {
  IconMicroscope,
  IconStethoscope,
  IconPill,
  IconFileText,
  IconDownload,
  IconCalendar,
  IconAlertCircle,
  IconClock,
  IconChevronRight,
} from "@tabler/icons-react";

export default function MedicalRecords() {
  const [activeTab, setActiveTab] = useState("diagnoses");

  const tabs = [
    { id: "diagnoses", label: "Diagnoses", icon: IconStethoscope },
    { id: "labs", label: "Lab Reports", icon: IconMicroscope },
    { id: "medications", label: "Medications", icon: IconPill },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content">
            Medical <span className="text-primary">Records</span>
          </h1>
          <p className="text-base-content/60 font-medium mt-2">
            Centralized access to your clinical history and diagnostic reports.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-2">
            <IconDownload size={18} /> Export Full History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="flex flex-col gap-2 p-2 bg-base-200/50 rounded-3xl border border-base-300">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn btn-block justify-start gap-4 h-14 border-none shadow-none ${
                    isActive
                      ? "btn-primary shadow-lg shadow-primary/20"
                      : "btn-ghost hover:bg-base-300"
                  }`}
                >
                  <Icon size={22} stroke={isActive ? 2.5 : 1.5} />
                  <span className={`font-bold ${isActive ? "" : "opacity-60"}`}>
                    {tab.label}
                  </span>
                  {isActive && (
                    <IconChevronRight size={18} className="ml-auto" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-6 bg-primary/5 rounded-3xl border border-primary/10">
            <h4 className="text-xs font-black uppercase text-primary mb-2 flex items-center gap-2">
              <IconAlertCircle size={14} /> Medical Note
            </h4>
            <p className="text-xs leading-relaxed opacity-70 font-medium">
              These records are updated by your healthcare providers. If you
              notice discrepancies, please contact your primary clinic.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {activeTab === "diagnoses" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Type 2 Diabetes",
                    date: "January 2022",
                    status: "Active",
                  },
                  {
                    title: "Hypertension",
                    date: "June 2021",
                    status: "Active",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="card bg-base-100 border border-base-300 hover:border-primary/40 transition-all group"
                  >
                    <div className="card-body p-6">
                      <div className="flex justify-between items-start">
                        <div className="p-3 bg-base-200 rounded-2xl group-hover:bg-primary group-hover:text-primary-content transition-colors">
                          <IconStethoscope size={24} />
                        </div>
                        <span className="badge badge-warning font-bold">
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-black mt-4">{item.title}</h3>
                      <p className="text-sm opacity-50 font-medium flex items-center gap-2">
                        <IconCalendar size={14} /> Diagnosed: {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="alert bg-base-200 border-none rounded-3xl p-6">
                <IconFileText className="text-primary" />
                <span className="text-sm font-medium opacity-70">
                  No additional chronic conditions or diagnoses on file.
                </span>
              </div>
            </div>
          )}

          {activeTab === "labs" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {[
                {
                  name: "Blood Test (CBC)",
                  date: "March 2024",
                  lab: "Central Diagnostics",
                },
                {
                  name: "Blood Sugar Test",
                  date: "February 2024",
                  lab: "Westside Lab",
                },
              ].map((report, i) => (
                <div
                  key={i}
                  className="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow"
                >
                  <div className="card-body flex-row items-center p-6 gap-6">
                    <div className="w-14 h-14 bg-success/10 text-success rounded-2xl flex items-center justify-center shrink-0">
                      <IconMicroscope size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg">{report.name}</h3>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs font-bold opacity-40 uppercase tracking-tighter flex items-center gap-1">
                          <IconCalendar size={12} /> {report.date}
                        </span>
                        <span className="text-xs font-bold opacity-40 uppercase tracking-tighter flex items-center gap-1">
                          <IconFileText size={12} /> {report.lab}
                        </span>
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm px-6 rounded-xl">
                      View Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "medications" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              {[
                {
                  name: "Metformin",
                  dose: "500mg",
                  freq: "Twice daily",
                  since: "Jan 2022",
                },
                {
                  name: "Lisinopril",
                  dose: "10mg",
                  freq: "Once daily",
                  since: "June 2021",
                },
              ].map((med, i) => (
                <div
                  key={i}
                  className="card bg-base-100 border border-base-300"
                >
                  <div className="card-body p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-black text-primary">
                        {med.name}
                      </h3>
                      <span className="badge badge-success badge-sm font-black">
                        ACTIVE
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 bg-base-200/50 rounded-2xl p-4 border border-base-200">
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">
                          Dosage
                        </p>
                        <p className="font-bold text-sm">{med.dose}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">
                          Frequency
                        </p>
                        <p className="font-bold text-sm">{med.freq}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-40">
                          Started
                        </p>
                        <p className="font-bold text-sm">{med.since}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
