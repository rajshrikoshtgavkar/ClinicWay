package com.saket.hospital_queue_system.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

  @GetMapping("/health")
  public Map<String, String> health() {
    System.out.println("Health check endpoint called");
    Map<String, String> response = new HashMap<>();
    response.put("status", "UP");
    response.put("message", "Hospital Queue System is running");
    return response;
  }
}
