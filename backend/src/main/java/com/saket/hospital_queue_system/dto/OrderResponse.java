package com.saket.hospital_queue_system.dto;

public record OrderResponse(String razorpayOrderId, Long amount, String currency) {}