package com.saket.hospital_queue_system.entity;

public enum AppointmentStatus {
    BOOKED,        // Appointment created
    CHECKED_IN,    // Patient arrived / ready
    IN_PROGRESS,   // Doctor consulting
    COMPLETED,     // Consultation finished
    CANCELLED,     // Cancelled before check-in
    NO_SHOW        // Patient never arrived
}
