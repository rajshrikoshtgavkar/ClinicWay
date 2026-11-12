const API_BASE_URL = "http://localhost:8080/api";

/**
 * Extract error message from API response
 * Handles both error objects and plain text responses
 */
const extractErrorMessage = async (response: Response): Promise<string> => {
  const contentType = response.headers.get("content-type");
  try {
    if (contentType?.includes("application/json")) {
      const error = await response.json();
      if (error.message) {
        return error.message;
      }
      if (error.error) {
        return error.error;
      }
    } else {
      const text = await response.text();
      if (text) {
        return text;
      }
    }
  } catch (e) {
    console.error("Failed to parse error response:", e);
  }

  return `API Error: ${response.status} ${response.statusText}`;
};

export const api = {
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        console.error(`GET ${endpoint} failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        console.error(`POST ${endpoint} failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  },

  async patch(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        console.error(`PATCH ${endpoint} failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`PATCH ${endpoint} error:`, error);
      throw error;
    }
  },

  async put(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        console.error(`PUT ${endpoint} failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`PUT ${endpoint} error:`, error);
      throw error;
    }
  },

  async delete(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        console.error(`DELETE ${endpoint} failed:`, errorMessage);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error(`DELETE ${endpoint} error:`, error);
      throw error;
    }
  },
};

console.log("API service initialized for:", API_BASE_URL);
