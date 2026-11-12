"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function CompleteVisitModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-black text-lg">Complete Visit</h3>
        <p className="text-sm opacity-60 mb-3">
          Please add clinical notes before completing the visit.
        </p>

        <textarea
          className="textarea textarea-bordered w-full"
          placeholder="Doctor notes..."
          rows={5}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              if (!notes.trim()) {
                toast.error("Notes are required");
                return;
              }
              onConfirm(notes);
            }}
          >
            Complete Visit
          </button>
        </div>
      </div>
    </div>
  );
}
