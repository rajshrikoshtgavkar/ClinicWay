package com.saket.hospital_queue_system.dto;

public record OrderRequest(String appointmentId, Long amount, String currency) {}