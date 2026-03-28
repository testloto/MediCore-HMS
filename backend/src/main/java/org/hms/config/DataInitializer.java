package org.hms.config;

import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.entity.Role;
import org.hms.modules.auth.entity.User;
import org.hms.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing demo users...");

        // Array of demo users
        Object[][] demoUsers = {
                {"admin@medicore.in", "Admin User", "admin123", Role.ADMIN, "Administration", "EMP001", null},
                {"dr.arjun@medicore.in", "Dr. Arjun Mehra", "demo123", Role.DOCTOR, "General Medicine", "DOC001", "LIC12345"},
                {"ritu.sharma@medicore.in", "Ritu Sharma", "demo123", Role.NURSE, "Nursing", "NUR001", null},
                {"mohan.lal@medicore.in", "Mohan Lal", "demo123", Role.RECEPTIONIST, "Front Office", "REC001", null},
                {"pooja.singh@medicore.in", "Pooja Singh", "demo123", Role.PHARMACIST, "Pharmacy", "PHA001", "PHARM12345"},
                {"anil.kumar@medicore.in", "Anil Kumar", "demo123", Role.LAB_TECHNICIAN, "Laboratory", "LAB001", "LAB12345"},
                {"chitra@medicore.in", "Chitra Sarkar", "123456", Role.DOCTOR, "Cardiology", "DOC004", "LIC12348"}
        };

        for (Object[] userData : demoUsers) {
            String email = (String) userData[0];
            String fullName = (String) userData[1];
            String password = (String) userData[2];
            Role role = (Role) userData[3];
            String department = (String) userData[4];
            String employeeId = (String) userData[5];
            String licenseId = (String) userData[6];

            createUserIfNotExists(email, fullName, password, role, department, employeeId, licenseId);
        }

        log.info("Demo users initialized successfully!");
    }

    private void createUserIfNotExists(String email, String fullName, String password,
                                       Role role, String department, String employeeId,
                                       String licenseId) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .username(email)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .fullName(fullName)
                    .phoneNumber("9876543210")
                    .role(role)
                    .department(department)
                    .employeeId(employeeId)
                    .licenseId(licenseId)
                    .accountStatus(AccountStatus.APPROVED)  // Auto-approve for demo
                    .enabled(true)
                    .emailVerified(true)
                    .approvedBy("SYSTEM")
                    .approvedDate(LocalDateTime.now())
                    .build();

            userRepository.save(user);
            log.info("Created user: {} ({})", email, role);
        } else {
            // Update existing user to APPROVED if needed
            User existingUser = userRepository.findByEmail(email).orElse(null);
            if (existingUser != null && existingUser.getAccountStatus() != AccountStatus.APPROVED) {
                existingUser.setAccountStatus(AccountStatus.APPROVED);
                existingUser.setEnabled(true);
                userRepository.save(existingUser);
                log.info("Updated user {} to APPROVED", email);
            }
        }
    }
}