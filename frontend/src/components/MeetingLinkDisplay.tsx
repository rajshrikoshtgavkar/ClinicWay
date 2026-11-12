import React from "react";
import toast from "react-hot-toast";
import {
  IconVideo,
  IconCheck,
  IconCopy,
  IconExternalLink,
} from "@tabler/icons-react";

interface MeetingLinkDisplayProps {
  meetingLink?: string;
  meetingPlatform?: string;
  appointmentStatus?: string;
  appointmentTime?: string;
}

export default function MeetingLinkDisplay({
  meetingLink,
  meetingPlatform = "GOOGLE_MEET",
  appointmentStatus,
  appointmentTime,
}: MeetingLinkDisplayProps) {
  const getPlatformName = (platform: string) => {
    const platformMap: { [key: string]: string } = {
      GOOGLE_MEET: "Google Meet",
      ZOOM: "Zoom",
      MICROSOFT_TEAMS: "Microsoft Teams",
      JITSI: "Jitsi Meet",
      OTHER: "Video Conference",
    };
    return platformMap[platform] || platform;
  };

  const getPlatformColor = (platform: string) => {
    const colorMap: { [key: string]: string } = {
      GOOGLE_MEET:
        "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      ZOOM: "bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",
      MICROSOFT_TEAMS:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      JITSI:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      OTHER: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
    };
    return colorMap[platform] || colorMap.OTHER;
  };

  const handleCopyLink = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink);
      toast.success("Meeting link copied to clipboard!");
    }
  };

  const handleJoinMeeting = () => {
    if (meetingLink) {
      window.open(meetingLink, "_blank");
    }
  };

  if (!meetingLink) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-700 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <IconVideo
            className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1"
            size={20}
          />
          <div>
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Meeting link not yet available
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
              The doctor will add the meeting link before your scheduled
              appointment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900 border-2 border-green-200 dark:border-green-700 p-5 rounded-lg">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconVideo
              className="text-green-600 dark:text-green-400"
              size={22}
            />
            <div>
              <p className="font-semibold text-green-900 dark:text-green-200">
                Ready for Video Consultation
              </p>
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getPlatformColor(meetingPlatform)}`}
              >
                {getPlatformName(meetingPlatform)}
              </span>
            </div>
          </div>
          <IconCheck className="text-green-600 dark:text-green-400" size={24} />
        </div>

        {/* Meeting Link Preview */}
        <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            Meeting Link:
          </p>
          <div className="flex items-center gap-2 break-all">
            <p className="text-sm font-mono text-gray-700 dark:text-gray-300 flex-1 line-clamp-1">
              {meetingLink}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleJoinMeeting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
          >
            <IconExternalLink size={18} />
            Join Meeting Now
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy meeting link"
          >
            <IconCopy size={18} />
          </button>
        </div>

        {/* Info Message */}
        {appointmentStatus !== "IN_PROGRESS" && (
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 rounded">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <span className="font-semibold">ℹ️ Reminder:</span> Join the
              meeting at your scheduled appointment time. The doctor will be
              waiting for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
