"use client";
import { Toaster } from "react-hot-toast";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ClinicWay - Smart Hospital Appointment Management System</title>
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
      </head>
      <body className={`antialiased roboto-condensed`}>
        <Toaster />
        <ErrorBoundary>
          <Navbar />
          {children}
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
