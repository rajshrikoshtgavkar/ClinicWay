"use client";

import { motion } from "framer-motion";
import {
  IconCalendarEvent,
  IconStethoscope,
  IconShieldLock,
  IconClock,
  IconUserCheck,
  IconDeviceMobile,
  IconArrowRight,
  IconMail,
  IconMessage,
} from "@tabler/icons-react";
export default function HomePage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 },
  };

  return (
    <div className="overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        id="home"
        className="min-h-screen flex items-center bg-base-100 pt-20"
      >
        <div className="container mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="badge badge-outline badge-primary font-bold py-4 px-6 mb-6 gap-2">
              <IconStethoscope size={18} /> Healthcare Digitized
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-base-content leading-tight">
              Smart Hospital <span className="text-primary italic">Slots.</span>{" "}
              Better Care.
            </h1>
            <p className="mt-6 text-xl text-base-content/70 leading-relaxed">
              ClinicWay eliminates the chaos of manual scheduling. We connect
              patients with the right specialists through a real-time,
              zero-error booking engine. Reduce waiting times by up to 60%.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button className="btn btn-primary btn-lg gap-2 text-white">
                Book Appointment <IconArrowRight size={20} />
              </button>
              <button className="btn btn-outline btn-lg">View Hospitals</button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-base-200">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
                alt="Modern Hospital Management"
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Stats Overlay */}
            <div className="absolute bottom-6 -left-6 bg-base-100 p-6 rounded-2xl shadow-xl border border-base-content/5 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 text-success rounded-xl">
                  <IconUserCheck size={32} />
                </div>
                <div>
                  <p className="text-2xl font-black italic">5,000+</p>
                  <p className="text-xs font-bold opacity-50 uppercase tracking-widest">
                    Active Patients
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className="bg-base-200 py-10">
        <div className="container mx-auto px-6 opacity-40 grayscale flex flex-wrap justify-center gap-10 lg:gap-24 items-center">
          <h4 className="text-xl font-black tracking-tighter">
            TRUSTED BY TOP HOSPITALS:
          </h4>
          <div className="flex items-center gap-2 font-bold text-2xl">
            🏥 HEALTH-CORE
          </div>
          <div className="flex items-center gap-2 font-bold text-2xl">
            🛡️ MEDICARE
          </div>
          <div className="flex items-center gap-2 font-bold text-2xl">
            🧬 GEN-HOSPITAL
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-base-100 relative">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <motion.div {...fadeIn}>
            <h2 className="text-sm font-black text-primary tracking-[0.3em] uppercase mb-4">
              The Problem & Solution
            </h2>
            <h3 className="text-4xl font-black mb-8">
              Why Healthcare Systems Choose ClinicWay
            </h3>
            <p className="max-w-3xl mx-auto text-lg text-base-content/70">
              The traditional "Wait and Watch" model is broken. Patients are
              frustrated, and doctors are overwhelmed. ClinicWay introduces an
              **Automated Resource Orchestrator** that balances hospital
              capacity with patient demand instantly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-base-200">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                {...fadeIn}
                transition={{ delay: idx * 0.1 }}
                className="card bg-base-100 border border-base-content/5 hover:border-primary/50 transition-all duration-300 hover:shadow-xl group"
              >
                <div className="card-body p-10">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white bg-primary/10 text-primary`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-base-content/60 leading-relaxed italic">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-base-100">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="bg-neutral text-neutral-content rounded-[3rem] p-10 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <IconMessage size={300} />
            </div>

            <motion.div {...fadeIn}>
              <h2 className="text-4xl lg:text-5xl font-black mb-6">
                Let's Transform Your Hospital.
              </h2>
              <p className="text-lg opacity-80 mb-10">
                Ready to digitize your time slots? Our team provides full
                onboarding, API integration, and staff training to get you
                running in under 48 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <IconMail className="text-primary" /> contact@ClinicWay.com
                </div>
              </div>
            </motion.div>

            <motion.div
              {...fadeIn}
              className="bg-base-100 p-8 rounded-3xl text-base-content shadow-inner"
            >
              <div className="grid grid-cols-1 gap-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-bold">
                    Email Address
                  </legend>
                  <input
                    type="email"
                    placeholder="you@hospital.com"
                    className="input input-bordered w-full"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-bold">
                    Inquiry Details
                  </legend>
                  <textarea
                    placeholder="Tell us about your clinic or hospital size..."
                    className="textarea textarea-bordered w-full h-32"
                  />
                </fieldset>
                <button className="btn btn-primary w-full mt-4 text-white uppercase font-black">
                  Request Demo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Instant Booking",
    description:
      "Patients can view available slots in real-time and book within seconds. No phone calls required.",
    icon: <IconCalendarEvent size={28} />,
  },
  {
    title: "Schedule Orchestrator",
    description:
      "A dashboard for admins to manage surgeon shifts, vacation time, and emergency slot overrides.",
    icon: <IconClock size={28} />,
  },
  {
    title: "HIPAA Grade Security",
    description:
      "All patient data and appointment logs are encrypted with AES-256 military-grade standards.",
    icon: <IconShieldLock size={28} />,
  },
  {
    title: "Smart Reminders",
    description:
      "Automated SMS and Email reminders to reduce no-show rates by up to 35%.",
    icon: <IconDeviceMobile size={28} />,
  },
  {
    title: "Staff Management",
    description:
      "Role-based access for nurses, doctors, and receptionists to coordinate patient flow.",
    icon: <IconUserCheck size={28} />,
  },
  {
    title: "Doctor Portfolios",
    description:
      "Showcase doctor specialties, qualifications, and patient reviews within the booking flow.",
    icon: <IconStethoscope size={28} />,
  },
];
