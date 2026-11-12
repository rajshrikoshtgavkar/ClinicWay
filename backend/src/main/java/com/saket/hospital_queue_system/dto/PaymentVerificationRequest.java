package com.saket.hospital_queue_system.dto;

public record PaymentVerificationRequest(
        String razorpayOrderId,
        String razorpayPaymentId,
        String razorpaySignature,
        String appointmentId
) {}
