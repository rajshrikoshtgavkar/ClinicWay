import { IconAlertCircle } from "@tabler/icons-react";

const ErrorState = ({ message }: { message: string }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
    <div className="bg-error/10 p-4 rounded-full mb-4">
      <IconAlertCircle className="text-error" size={48} />
    </div>
    <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
    <p className="text-base-content/60 mb-6">{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="btn btn-error btn-outline"
    >
      Try Again
    </button>
  </div>
);

export default ErrorState;
