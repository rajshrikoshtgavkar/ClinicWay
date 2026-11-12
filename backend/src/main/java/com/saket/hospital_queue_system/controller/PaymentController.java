package com.saket.hospital_queue_system.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.saket.hospital_queue_system.dto.OrderRequest;
import com.saket.hospital_queue_system.dto.OrderResponse;
import com.saket.hospital_queue_system.dto.PaymentVerificationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest req) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", req.amount());
        orderRequest.put("currency", req.currency());
        orderRequest.put("receipt", "txn_" + req.appointmentId());

        Order order = client.orders.create(orderRequest);

        // Save the order.get("id") to your database linked to the appointment
        return ResponseEntity.ok(new OrderResponse(order.get("id"), req.amount(), req.currency()));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            // 1. Collect data from request
            String orderId = data.get("razorpayOrderId");
            String paymentId = data.get("razorpayPaymentId");
            String signature = data.get("razorpaySignature");

            // 2. Prepare the JSONObject for the SDK
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", orderId);
            options.put("razorpay_payment_id", paymentId);
            options.put("razorpay_signature", signature);

            // 3. Use the SDK to verify (this matches the required: JSONObject, String signature)
            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);

            if (isValid) {
                // Success: Update your database here
                // e.g., appointmentService.updateStatus(data.get("appointmentId"), "PAID");
                return ResponseEntity.ok(Map.of("status", "success", "message", "Payment Verified"));
            } else {
                return ResponseEntity.status(400).body("Signature verification failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Verification error: " + e.getMessage());
        }
    }
}