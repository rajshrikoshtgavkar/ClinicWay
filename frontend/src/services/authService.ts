import { api } from "./api";

export const authService = {
  async signup(data: {
    email: string;
    password: string;
    phone: string;
    fullName: string;
    profileImage: string;
    role: "PATIENT" | "DOCTOR" | "STAFF";
    specialization?: string;
    department?: string;
  }) {
    return api.post("/auth/signup", data);
  },

  async login(email: string, password: string) {
    // THIS NOW STORES THE COOKIE ✅
    return api.post("/auth/login", { email, password });
  },

  async getCurrentUser() {
    // Cookie will be sent automatically ✅
    return api.get("/auth/me");
  },

  async logout() {
    return api.post("/auth/logout", {});
  },
};
