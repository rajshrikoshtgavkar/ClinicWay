package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
  // COPILOT-FIX: CRITICAL - Use JOIN FETCH to prevent N+1 queries
  @Query("SELECT d FROM Doctor d " +
      "LEFT JOIN FETCH d.user " +
      "LEFT JOIN FETCH d.clinic " +
      "WHERE d.user.id = :userId")
  Optional<Doctor> findByUserId(@Param("userId") Long userId);

  // COPILOT-FIX: CRITICAL - Use JOIN FETCH for available doctors
  @Query("SELECT d FROM Doctor d " +
      "LEFT JOIN FETCH d.user " +
      "LEFT JOIN FETCH d.clinic " +
      "WHERE d.isAvailable = true")
  List<Doctor> findByIsAvailableTrue();

  // COPILOT-FIX: CRITICAL - Use JOIN FETCH for clinic doctors
  @Query("SELECT d FROM Doctor d " +
      "LEFT JOIN FETCH d.user " +
      "LEFT JOIN FETCH d.clinic " +
      "WHERE d.clinic.id = :clinicId")
  List<Doctor> findByClinicId(@Param("clinicId") Long clinicId);

  long countByClinicId(Long clinicId);
}
