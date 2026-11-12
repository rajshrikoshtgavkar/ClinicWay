package com.saket.hospital_queue_system.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAppointmentRequest {

    @NotNull(message = "Doctor ID is required")
    private Long doctorId;

    @NotBlank(message = "Booking for is required (SELF or OTHER)")
    private String bookingFor; // SELF | OTHER

    private PatientDetailsDto patientDetails; // Required if OTHER

    @NotNull(message = "Appointment date is required")
    @FutureOrPresent(message = "Appointment date must be today or in the future")
    private LocalDate appointmentDate;

    @NotNull(message = "Appointment time is required")
    private LocalTime appointmentTime;

    @NotBlank(message = "Appointment type is required (ONLINE or IN_PERSON)")
    private String appointmentType; // ONLINE | IN_PERSON (changed from entity enum)

    @NotBlank(message = "Payment mode is required (ONLINE or CASH)")
    private String paymentMode; // ONLINE | CASH

    private String notes;
}
