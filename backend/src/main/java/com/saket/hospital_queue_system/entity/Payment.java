package com.saket.hospital_queue_system.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Payment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "appointment_id", nullable = false, unique = true)
  private Appointment appointment;

  @Column(nullable = false)
  private Double amount;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private PaymentStatus status; // PENDING, COMPLETED, FAILED, REFUNDED

  @Column(length = 50)
  private String paymentMethod; // RAZORPAY, CASH, ONLINE

  @Column(length = 100)
  private String transactionId;

  @Column(name = "razorpay_order_id", length = 100)
  private String razorpayOrderId;

  @Column(name = "razorpay_payment_id", length = 100)
  private String razorpayPaymentId;

  @Column(name = "razorpay_signature", length = 250)
  private String razorpaySignature;

  @Column(length = 250)
  private String notes;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    System.out.println("Payment entity created: Amount " + this.amount);
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
    System.out.println("Payment entity updated: Amount " + this.amount);
  }
}
