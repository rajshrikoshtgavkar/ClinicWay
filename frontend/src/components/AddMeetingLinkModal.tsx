import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  IconX,
  IconLoader,
  IconVideo,
  IconInfoCircle,
} from "@tabler/icons-react";
import { appointmentService } from "@/services/appointmentService";

interface AddMeetingLinkModalProps {
  appointmentId: number;
  appointmentDetails?: {
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddMeetingLinkModal({
  appointmentId,
  appointmentDetails,
  isOpen,
  onClose,
  onSuccess,
}: AddMeetingLinkModalProps) {
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("GOOGLE_MEET");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingLink.trim()) {
      toast.error("Please enter a meeting link");
      return;
    }

    if (
      !meetingLink.startsWith("http://") &&
      !meetingLink.startsWith("https://")
    ) {
      toast.error(
        "Meeting link must be a valid URL starting with http:// or https://",
      );
      return;
    }

    try {
      setLoading(true);
      console.log(appointmentId);
      await appointmentService.addMeetingLink(
        appointmentId,
        meetingLink,
        meetingPlatform,
      );
      toast.success("Meeting link added successfully!");
      setMeetingLink("");
      setMeetingPlatform("GOOGLE_MEET");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to add meeting link";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      className={`modal ${isOpen ? "modal-open" : ""} modal-bottom sm:modal-middle`}
    >
      <Toaster />
      <div className="modal-box p-0 overflow-hidden border border-base-300 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-base-200/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <IconVideo size={24} />
            </div>
            <h2 className="text-xl font-bold">Add Meeting Link</h2>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
            aria-label="Close"
          >
            <IconX size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Appointment Details Summary */}
          {appointmentDetails && (
            <div className="stats stats-vertical w-full bg-base-200 text-sm">
              <div className="stat py-3">
                <div className="stat-title uppercase text-[10px] font-bold tracking-wider">
                  Patient
                </div>
                <div className="stat-value text-base font-medium">
                  {appointmentDetails.patientName}
                </div>
              </div>
              <div className="stat py-3">
                <div className="stat-title uppercase text-[10px] font-bold tracking-wider">
                  Schedule
                </div>
                <div className="stat-desc text-base-content font-medium opacity-100">
                  {appointmentDetails.appointmentDate} @{" "}
                  {appointmentDetails.appointmentTime}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Platform Selection */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Meeting Platform <span className="text-error">*</span>
              </legend>
              <select
                value={meetingPlatform}
                onChange={(e) => setMeetingPlatform(e.target.value)}
                className="select select-bordered w-full bg-base-100 focus:select-primary"
              >
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="ZOOM">Zoom</option>
                <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
                <option value="JITSI">Jitsi Meet</option>
                <option value="OTHER">Other Platform</option>
              </select>
            </fieldset>

            {/* Meeting Link Input */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Meeting Link <span className="text-error">*</span>
              </legend>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="input input-bordered w-full bg-base-100 focus:input-primary"
                required
                disabled={loading}
              />
              <label className="label">
                <span className="label-text-alt opacity-60">
                  Paste the complete meeting URL
                </span>
              </label>
            </fieldset>
          </div>

          {/* Alert Info */}
          <div className="alert alert-info bg-info/10 border-info/20 text-xs py-3 rounded-xl flex items-start">
            <IconInfoCircle size={18} className="text-info shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> The patient will see this link in their
              dashboard to join the call at the scheduled time.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="modal-action mt-0 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-ghost border-base-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <IconLoader className="animate-spin" size={20} />
              ) : (
                <>
                  <IconVideo size={20} />
                  Save Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Backdrop click to close */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
