package com.saket.hospital_queue_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalQueueSystemApplication {

	public static void main(String[] args) {
		System.out.println("=== Hospital Queue System Starting ===");
		SpringApplication.run(HospitalQueueSystemApplication.class, args);
		System.out.println("=== Application Started Successfully ===");
	}

}
