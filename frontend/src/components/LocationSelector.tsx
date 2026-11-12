"use client";
import React, { useState } from "react";
import { IconMapPin } from "@tabler/icons-react";
import {
  MAHARASHTRA_DISTRICTS,
  MAHARASHTRA_TALUKAS,
} from "@/helper/Constants";

interface LocationSelectorProps {
  onLocationChange: (district: string, taluka: string) => void;
}

export default function LocationSelector({
  onLocationChange,
}: LocationSelectorProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [talukas, setTalukas] = useState<string[]>([]);
  const [selectedTaluka, setSelectedTaluka] = useState<string>("");

  return (
    <div className="bg-base-100 border border-base-300 p-6 lg:p-10 rounded-[40px] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary p-2 rounded-xl text-primary-content shadow-lg shadow-primary/30">
          <IconMapPin size={24} />
        </div>
        <h2 className="text-2xl font-black">Refine Location</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset className="fieldset">
          <legend className="fieldset-legend font-black uppercase opacity-40">
            District
          </legend>
          <select
            className="select select-bordered w-full font-bold bg-base-200 border-none"
            value={selectedDistrict}
            onChange={(e) => {
              const district = e.target.value;
              setSelectedDistrict(district);
              setTalukas(MAHARASHTRA_TALUKAS[district] || []);
              setSelectedTaluka("");
              onLocationChange(district, "");
            }}
          >
            <option value="">Choose District</option>
            {MAHARASHTRA_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend font-black uppercase opacity-40">
            Taluka (Sub-district)
          </legend>
          <select
            disabled={!selectedDistrict}
            className="select select-bordered w-full font-bold bg-base-200 border-none"
            value={selectedTaluka}
            onChange={(e) => {
              setSelectedTaluka(e.target.value);
              onLocationChange(selectedDistrict, e.target.value);
            }}
          >
            <option value="">
              {selectedDistrict ? "All Talukas" : "Select District First"}
            </option>
            {talukas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
    </div>
  );
}
