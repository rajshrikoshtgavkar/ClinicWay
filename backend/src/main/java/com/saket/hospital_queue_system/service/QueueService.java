package com.saket.hospital_queue_system.service;

import com.saket.hospital_queue_system.dto.QueueCheckInRequest;
import com.saket.hospital_queue_system.dto.QueueStatusResponse;
import com.saket.hospital_queue_system.dto.DoctorQueueResponse;
import com.saket.hospital_queue_system.dto.QueueEntryDto;
import com.saket.hospital_queue_system.entity.*;
import com.saket.hospital_queue_system.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueueService {

  private static final Logger logger = LoggerFactory.getLogger(QueueService.class);
  private static final Integer AVG_CONSULTATION_MINUTES = 15;

  @Autowired
  private QueueRepository queueRepository;

  @Autowired
  private AppointmentRepository appointmentRepository;

  @Autowired
  private PatientRepository patientRepository;

  @Autowired
  private DoctorRepository doctorRepository;

  @Autowired
  private UserRepository userRepository;

  /**
   * Create queue entry automatically when appointment is booked
   */
  public void createQueueEntry(Appointment appointment) {
    logger.info("Creating queue entry for appointment ID: {}", appointment.getId());

    // Get all queue entries for this doctor on the same date
    List<Queue> existingQueues = queueRepository.findTodayQueueByDoctor(appointment.getDoctor());

    // Calculate next position (FIFO)
    int nextPosition = existingQueues.size() + 1;

    // Calculate estimated wait time
    Integer estimatedWait = (nextPosition - 1) * AVG_CONSULTATION_MINUTES;

    // Create queue entry
    Queue queue = new Queue();
    queue.setAppointment(appointment);
    queue.setPatient(appointment.getPatient());
    queue.setDoctor(appointment.getDoctor());
    queue.setStatus(QueueStatus.WAITING);
    queue.setPosition(nextPosition);
    queue.setEstimatedWaitMinutes(estimatedWait);

    Queue savedQueue = queueRepository.save(queue);
    logger.info("Queue entry created with position: {} for doctor: {}", nextPosition,
        appointment.getDoctor().getUser().getName());

    // Update appointment with queue number
    appointment.setQueueNumber(nextPosition);
    appointmentRepository.save(appointment);
  }

  public QueueStatusResponse checkIn(String patientEmail, QueueCheckInRequest request) {
    logger.info("Patient {} checking in for appointment {}", patientEmail, request.getAppointmentId());

    User user = userRepository.findByEmail(patientEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Patient patient = patientRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
        .orElseThrow(() -> new RuntimeException("Appointment not found"));

    // Verify appointment belongs to patient
    if (!appointment.getPatient().getId().equals(patient.getId())) {
      throw new RuntimeException("Appointment does not belong to this patient");
    }

    // Verify appointment is for today
    if (!appointment.getAppointmentDate().equals(LocalDate.now())) {
      throw new RuntimeException("Can only check in for today's appointments");
    }

    // Check if already checked in
    appointment.getAppointmentDate().equals(LocalDate.now());
    List<Queue> existingQueues = queueRepository.findTodayQueueByPatient(patient);
    boolean alreadyCheckedIn = existingQueues.stream()
        .anyMatch(q -> !q.getStatus().equals(QueueStatus.CANCELLED));
    if (alreadyCheckedIn) {
      throw new RuntimeException("Patient already checked in for today");
    }

    // Get current position
    List<Queue> todayQueues = queueRepository.findTodayQueueByDoctor(appointment.getDoctor());
    Integer newPosition = todayQueues.size() + 1;

    // Calculate estimated wait time
    Integer estimatedWait = (newPosition - 1) * AVG_CONSULTATION_MINUTES;

    // Create queue entry
    Queue queueEntry = new Queue();
    queueEntry.setPatient(patient);
    queueEntry.setDoctor(appointment.getDoctor());
    queueEntry.setAppointment(appointment);
    queueEntry.setStatus(QueueStatus.WAITING);
    queueEntry.setPosition(newPosition);
    queueEntry.setCheckInTime(LocalDateTime.now());
    queueEntry.setEstimatedWaitMinutes(estimatedWait);

    Queue savedQueue = queueRepository.save(queueEntry);
    logger.info("Patient checked in successfully with queue position: {}", newPosition);

    return convertToQueueStatusResponse(savedQueue);
  }

  @Transactional(readOnly = true)
  public QueueStatusResponse getQueueStatus(String patientEmail) {
    logger.info("Getting queue status for patient: {}", patientEmail);

    User user = userRepository.findByEmail(patientEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Patient patient = patientRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    Queue queue = queueRepository.findTodayActiveQueueByPatient(patient)
        .orElseThrow(() -> new RuntimeException("No active queue found for today"));

    return convertToQueueStatusResponse(queue);
  }

  @Transactional(readOnly = true)
  public DoctorQueueResponse getDoctorQueue(String doctorEmail) {
    logger.info("Getting queue for doctor: {}", doctorEmail);

    User user = userRepository.findByEmail(doctorEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Doctor doctor = doctorRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Doctor not found"));

    // Get current patient (IN_PROGRESS)
    List<Queue> inProgressQueues = queueRepository.findByDoctorAndStatusOrderByPositionAsc(
        doctor, QueueStatus.IN_PROGRESS);
    QueueEntryDto currentPatient = inProgressQueues.isEmpty() ? null : convertToQueueEntryDto(inProgressQueues.get(0));

    // Get waiting patients
    List<QueueEntryDto> waitingPatients = queueRepository
        .findByDoctorAndStatusOrderByPositionAsc(doctor, QueueStatus.WAITING)
        .stream()
        .map(this::convertToQueueEntryDto)
        .collect(Collectors.toList());

    // Get completed patients for today
    List<QueueEntryDto> completedPatients = queueRepository
        .findTodayQueueByDoctor(doctor)
        .stream()
        .filter(q -> q.getStatus().equals(QueueStatus.COMPLETED))
        .map(this::convertToQueueEntryDto)
        .collect(Collectors.toList());

    Integer totalSeenToday = queueRepository.countCompletedTodayByDoctor(doctor);

    DoctorQueueResponse response = new DoctorQueueResponse();
    response.setCurrentPatient(currentPatient);
    response.setWaitingPatients(waitingPatients);
    response.setCompletedPatients(completedPatients);
    response.setTotalSeenToday(totalSeenToday != null ? totalSeenToday : 0);

    logger.info("Doctor queue retrieved successfully");
    return response;
  }

  public QueueStatusResponse callNextPatient(String doctorEmail) {
    logger.info("Doctor {} calling next patient", doctorEmail);

    User user = userRepository.findByEmail(doctorEmail)
        .orElseThrow(() -> new RuntimeException("User not found"));

    Doctor doctor = doctorRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Doctor not found"));

    // Complete current patient if exists
    List<Queue> inProgress = queueRepository
        .findByDoctorAndStatusOrderByPositionAsc(doctor, QueueStatus.IN_PROGRESS);
    if (!inProgress.isEmpty()) {
      Queue current = inProgress.get(0);
      current.setStatus(QueueStatus.COMPLETED);
      current.setCompletedTime(LocalDateTime.now());
      queueRepository.save(current);
      logger.info("Patient {} marked as completed", current.getPatient().getId());
    }

    // Get next waiting patient
    List<Queue> waiting = queueRepository
        .findByDoctorAndStatusOrderByPositionAsc(doctor, QueueStatus.WAITING);
    if (waiting.isEmpty()) {
      throw new RuntimeException("No patients waiting in queue");
    }

    Queue nextPatient = waiting.get(0);
    nextPatient.setStatus(QueueStatus.IN_PROGRESS);
    nextPatient.setCalledTime(LocalDateTime.now());

    // Update positions
    for (int i = 0; i < waiting.size(); i++) {
      waiting.get(i).setPosition(i + 1);
    }

    Queue savedQueue = queueRepository.save(nextPatient);
    queueRepository.saveAll(waiting);

    logger.info("Next patient called: {}", nextPatient.getPatient().getId());
    return convertToQueueStatusResponse(savedQueue);
  }

  public QueueStatusResponse completePatient(String doctorEmail, Long queueId) {
    logger.info("Doctor {} completing patient from queue {}", doctorEmail, queueId);

    Queue queue = queueRepository.findById(queueId)
        .orElseThrow(() -> new RuntimeException("Queue entry not found"));

    queue.setStatus(QueueStatus.COMPLETED);
    queue.setCompletedTime(LocalDateTime.now());

    Queue savedQueue = queueRepository.save(queue);
    logger.info("Patient marked as completed");
    return convertToQueueStatusResponse(savedQueue);
  }

  private QueueStatusResponse convertToQueueStatusResponse(Queue queue) {
    QueueStatusResponse response = new QueueStatusResponse();
    response.setQueueId(queue.getId());
    response.setAppointmentId(queue.getAppointment().getId());
    response.setPatientName(queue.getPatient().getUser().getName());
    response.setDoctorName(queue.getDoctor().getUser().getName());
    response.setDoctorSpecialization(queue.getDoctor().getSpecialization());
    response.setStatus(queue.getStatus().toString());
    response.setPosition(queue.getPosition());
    response.setEstimatedWaitMinutes(queue.getEstimatedWaitMinutes());
    response.setCheckInTime(queue.getCheckInTime());
    response.setCalledTime(queue.getCalledTime());
    response.setCompletedTime(queue.getCompletedTime());
    return response;
  }

  private QueueEntryDto convertToQueueEntryDto(Queue queue) {
    QueueEntryDto dto = new QueueEntryDto();
    dto.setAppointmentId(queue.getAppointment().getId());
    dto.setQueueId(queue.getId());
    dto.setPatientId(queue.getPatient().getId());
    dto.setPatientName(queue.getPatient().getUser().getName());
    dto.setPatientPhone(queue.getPatient().getUser().getPhone());
    dto.setPatientAge(queue.getPatient().getAge());
    dto.setPatientGender(queue.getPatient().getGender());
    dto.setStatus(queue.getStatus().toString());
    dto.setPosition(queue.getPosition());
    dto.setEstimatedWaitMinutes(queue.getEstimatedWaitMinutes());
    dto.setCheckInTime(queue.getCheckInTime());
    dto.setCalledTime(queue.getCalledTime());
    dto.setAppointmentTime(queue.getAppointment().getAppointmentDate()
        .atTime(queue.getAppointment().getAppointmentTime()));
    return dto;
  }
}
