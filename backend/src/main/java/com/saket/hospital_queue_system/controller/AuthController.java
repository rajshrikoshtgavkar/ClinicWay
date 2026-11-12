package com.saket.hospital_queue_system.controller;

import com.saket.hospital_queue_system.dto.*;
import com.saket.hospital_queue_system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // COPILOT-FIX: CRITICAL - Added @Valid annotation
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        System.out.println("AuthController: POST /api/auth/signup");
        try {
            boolean signupSuccess = authService.signup(request);

            if (signupSuccess) {
                return ResponseEntity.status(HttpStatus.CREATED)
                        .body("Signup successful");
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Signup failed");

        } catch (Exception e) {
            System.out.println("AuthController: Signup error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Signup failed: " + e.getMessage());
        }
    }

    // COPILOT-FIX: CRITICAL - Added @Valid annotation
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("AuthController: POST /api/auth/login");
        try {
            AuthResponse response = authService.login(request);
            String token = response.getToken();

            ResponseCookie cookie = ResponseCookie.from("authToken", token)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Lax")
                    .path("/")
                    .maxAge(60 * 60)
                    .build();

            // Hide token from response body
            response.setToken(null);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);

        } catch (Exception e) {
            System.out.println("AuthController: Login error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(
                            null, null, null, null, null,
                            "Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        System.out.println("AuthController: GET /api/auth/me");
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Object principal = authentication.getPrincipal();

            if (!(principal instanceof UserDetails userDetails)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String email = userDetails.getUsername();
            UserResponse response = authService.getCurrentUserByEmail(email);

            System.out.println("AuthController: Current user retrieved: " + email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("AuthController: Get current user error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout() {
        System.out.println("AuthController: GET /api/auth/logout");
        try {
            ResponseCookie cookie = ResponseCookie.from("authToken", "")
                    .httpOnly(true)
                    .secure(true)
                    .sameSite("None")
                    .path("/")
                    .maxAge(0)
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body("Logout successful");
        } catch (Exception e) {
            System.out.println("AuthController: Logout error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Logout failed: " + e.getMessage());
        }
    }
}
