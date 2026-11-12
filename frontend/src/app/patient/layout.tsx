"use client";
import axios from "axios";
import "../globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import SideNav from "./SideNav";
import { useRouter } from "next/navigation";
import Script from "next/script";

const Component = ({ children }: { children: React.ReactNode }) => {
  const { setUser } = useAuth();
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("/spring-server/api/auth/me", {
        withCredentials: true,
      });
      if (response.data) {
        setUser(response.data);
      } else {
        router.push("/");
      }
    };
    fetchUser();
  }, []);
  return (
    <html lang="en">
      <head>
        <title>
          PATIENT | ClinicWay - Smart Hospital Appointment Management System
        </title>
        <meta
          name="description"
          content="ClinicWay is a modern hospital appointment management system that enables patients to book appointments seamlessly while helping hospitals manage doctors, schedules, and patient flow efficiently using a secure and scalable platform."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </head>
      <body className={`antialiased roboto-condensed`}>
        <div className="absolute top-0 left-0 right-0 z-50">
          <Toaster />
        </div>
        <SideNav>{children}</SideNav>
      </body>
    </html>
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Component>{children}</Component>
    </AuthProvider>
  );
}
