package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {
}
