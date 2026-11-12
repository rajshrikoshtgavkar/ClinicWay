package com.saket.hospital_queue_system.repository;

import com.saket.hospital_queue_system.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
  Optional<Staff> findByUserId(Long userId);
}
