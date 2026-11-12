/**
 * Error Handler Utility
 * Parses and formats API errors for display to users
 */

export interface ApiError {
  status: number;
  message: string;
  details?: string;
}

export const parseApiError = (error: any): ApiError => {
  // If it's a Response object
  if (error instanceof Response) {
    return {
      status: error.status,
      message: error.statusText || "An error occurred",
      details: `HTTP ${error.status}`,
    };
  }

  // If it has a message property (Error object or custom error)
  if (error?.message) {
    const message = error.message;

    // Parse ERROR: prefix for backend errors
    if (message.startsWith("ERROR:")) {
      return {
        status: 400,
        message: message.substring(6).trim(),
        details: "Validation error",
      };
    }

    return {
      status: error.status || 500,
      message,
      details: error.details,
    };
  }

  // Fallback
  return {
    status: 500,
    message: "An unexpected error occurred",
    details: String(error),
  };
};

export const getErrorMessage = (error: any): string => {
  const parsed = parseApiError(error);
  return parsed.message || "An error occurred. Please try again.";
};

export const handleApiError = (
  error: any,
  defaultMessage: string = "Operation failed"
): string => {
  console.error("API Error:", error);

  if (!error) {
    return defaultMessage;
  }

  // Try to extract JSON error message from Response
  if (error instanceof Response) {
    return error.statusText || defaultMessage;
  }

  // Direct message
  if (typeof error === "string") {
    return error;
  }

  // Error object with message
  if (error.message) {
    return error.message.startsWith("ERROR:")
      ? error.message.substring(6).trim()
      : error.message;
  }

  return defaultMessage;
};

/**
 * Show error toast notification
 * Uses DaisyUI alert - customize as needed
 */
export const showErrorToast = (message: string) => {
  console.error("Error:", message);
  // In a real app, this would integrate with a toast notification library
  // For now, just log to console and optionally show in alert
  // TODO: Implement proper toast notification system
};

/**
 * Show success notification
 */
export const showSuccessToast = (message: string) => {
  console.log("Success:", message);
  // TODO: Implement proper toast notification system
};
