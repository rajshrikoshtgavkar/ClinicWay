package com.saket.hospital_queue_system.dto;

import com.saket.hospital_queue_system.entity.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {

    private Long id;

    private Long clinicId;
    private String clinicName;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    private Long patientId;
    private String patientName;
    private Integer patientAge;
    private String patientGender;
    private String patientPhoneNumber;

    private String appointmentDate;
    private String appointmentTime;

    private String appointmentType;
    private String status;

    private Integer queueNumber;
    private String meetingLink;
    private String paymentStatus;
    private String notes;

    public static AppointmentResponseDto from(Appointment a) {
        Doctor doctor = a.getDoctor();
        Patient patient = a.getPatient();
        Clinic clinic = a.getClinic();

        return AppointmentResponseDto.builder()
                .id(a.getId())
                .clinicId(clinic != null ? clinic.getId() : null)
                .clinicName(clinic != null ? clinic.getName() : null)
                .doctorId(doctor != null ? doctor.getId() : null)
                .doctorName(doctor != null && doctor.getUser() != null
                        ? doctor.getUser().getName()
                        : null)
                .doctorSpecialization(doctor != null ? doctor.getSpecialization() : null)
                .patientId(patient != null ? patient.getId() : null)
                .patientName(
                        patient == null
                                ? null
                                : patient.getPatientName() != null
                                        ? patient.getPatientName()
                                        : patient.getUser() != null
                                                ? patient.getUser().getName()
                                                : null)
                .patientAge(patient != null ? patient.getAge() : null)
                .patientGender(patient != null ? patient.getGender() : null)
                .patientPhoneNumber(patient != null ? patient.getPhoneNumber() : null)
                .appointmentDate(a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : null)
                .appointmentTime(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : null)
                .appointmentType(a.getAppointmentType() != null ? a.getAppointmentType().toString() : null)
                .status(a.getStatus() != null ? a.getStatus().toString() : null)
                .queueNumber(a.getQueueNumber())
                .meetingLink(a.getMeetingLink())
                .paymentStatus(a.getPaymentStatus() != null ? a.getPaymentStatus().toString() : null)
                .notes(a.getNotes())
                .build();
    }
}
