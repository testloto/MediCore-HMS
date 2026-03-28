package org.hms.modules.auth.service;

import org.hms.common.exception.BadRequestException;
import org.hms.common.exception.ResourceNotFoundException;
import org.hms.common.util.JwtUtil;
import org.hms.modules.auth.dto.*;
import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.entity.User;
import org.hms.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public RegistrationResponse register(RegistrationRequest request) {
        // Validate passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered. Please use a different email or login.");
        }

        // Check if username (email) already exists
        if (userRepository.existsByUsername(request.getEmail())) {
            throw new BadRequestException("Username already taken");
        }

        // Create new user with PENDING status
        var user = User.builder()
                .username(request.getEmail()) // Using email as username
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .department(request.getDepartment())
                .employeeId(request.getEmployeeId())
                .licenseId(request.getLicenseId())
                .reasonForAccess(request.getReasonForAccess())
                .accountStatus(AccountStatus.PENDING)
                .enabled(false) // Disabled until approved
                .emailVerified(false)
                .build();

        User savedUser = userRepository.save(user);

        log.info("New registration request received for user: {} with role: {}", savedUser.getEmail(), savedUser.getRole());

        // Create response
        return RegistrationResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phoneNumber(savedUser.getPhoneNumber())
                .role(savedUser.getRole())
                .department(savedUser.getDepartment())
                .employeeId(savedUser.getEmployeeId())
                .licenseId(savedUser.getLicenseId())
                .accountStatus(savedUser.getAccountStatus())
                .message("Registration request submitted successfully. Please wait for admin approval.")
                .registeredAt(savedUser.getCreatedAt())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        try {
            // Authenticate using email and password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            // Check account status
            if (user.getAccountStatus() == AccountStatus.PENDING) {
                throw new BadRequestException("Your account is pending approval. Please wait for admin approval.");
            }

            if (user.getAccountStatus() == AccountStatus.REJECTED) {
                throw new BadRequestException("Your registration request has been rejected. Reason: " +
                        (user.getRejectionReason() != null ? user.getRejectionReason() : "Contact admin for details"));
            }

            // Update last login
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generate JWT token
            var jwtToken = jwtUtil.generateToken(user);

            return LoginResponse.builder()
                    .token(jwtToken)
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole())
                    .department(user.getDepartment())
                    .phoneNumber(user.getPhoneNumber())
                    .accountStatus(user.getAccountStatus())
                    .isApproved(user.getAccountStatus() == AccountStatus.APPROVED)
                    .message("Login successful")
                    .build();

        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid email or password");
        } catch (DisabledException e) {
            throw new BadRequestException("Your account is not activated. Please check your email or contact admin.");
        }
    }

    // Quick demo login for UI
    public LoginResponse demoLogin(String role) {
        // This is for demo purposes - in production, you'd have predefined demo accounts
        String email = getDemoEmailByRole(role);
        String password = "demo123"; // Default demo password

        LoginRequest request = new LoginRequest(email, password);
        return login(request);
    }
    // registration response(pending)
    public RegistrationResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return RegistrationResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .department(user.getDepartment())
                .accountStatus(user.getAccountStatus())
                .build();
    }

    private String getDemoEmailByRole(String role) {
        switch (role.toLowerCase()) {
            case "admin":
                return "admin@medicore.in";
            case "doctor":
                return "dr.arjun@medicore.in";
            case "nurse":
                return "ritu.sharma@medicore.in";
            case "receptionist":
                return "mohan.lal@medicore.in";
            case "pharmacist":
                return "pooja.singh@medicore.in";
            case "lab_technician":
                return "anil.kumar@medicore.in";
            default:
                return "demo@medicore.in";
        }
    }
}