package org.hms.modules.auth.service;

import org.hms.common.exception.BadRequestException;
import org.hms.common.exception.ResourceNotFoundException;
import org.hms.modules.auth.dto.ApprovalRequest;
import org.hms.modules.auth.dto.RegistrationResponse;
import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.entity.User;
import org.hms.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getPendingRegistrations() {
        return userRepository.findByAccountStatus(AccountStatus.PENDING).stream()
                .map(this::mapToRegistrationResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RegistrationResponse> getAllRegistrations() {
        return userRepository.findAll().stream()
                .map(this::mapToRegistrationResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RegistrationResponse approveUser(ApprovalRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        if (user.getAccountStatus() != AccountStatus.PENDING) {
            throw new BadRequestException("User is not in PENDING state");
        }

        String approvedBy = getCurrentUsername();

        if (request.getAction() == AccountStatus.APPROVED) {
            user.setAccountStatus(AccountStatus.APPROVED);
            user.setEnabled(true);
            user.setApprovedBy(approvedBy);
            user.setApprovedDate(LocalDateTime.now());
            log.info("User {} approved by {}", user.getEmail(), approvedBy);
        } else if (request.getAction() == AccountStatus.REJECTED) {
            if (request.getRejectionReason() == null || request.getRejectionReason().trim().isEmpty()) {
                throw new BadRequestException("Rejection reason is required");
            }
            user.setAccountStatus(AccountStatus.REJECTED);
            user.setEnabled(false);
            user.setRejectionReason(request.getRejectionReason());
            user.setApprovedBy(approvedBy);
            user.setApprovedDate(LocalDateTime.now());
            log.info("User {} rejected by {}. Reason: {}", user.getEmail(), approvedBy, request.getRejectionReason());
        }

        User updatedUser = userRepository.save(user);
        return mapToRegistrationResponse(updatedUser);
    }

    @Transactional
    public RegistrationResponse resendApprovalNotification(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Here you would implement email notification logic
        log.info("Approval notification resent to user: {}", user.getEmail());

        return mapToRegistrationResponse(user);
    }

    private String getCurrentUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        return principal.toString();
    }

    private RegistrationResponse mapToRegistrationResponse(User user) {
        return RegistrationResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .department(user.getDepartment())
                .employeeId(user.getEmployeeId())
                .licenseId(user.getLicenseId())
                .accountStatus(user.getAccountStatus())
                .message(getStatusMessage(user))
                .registeredAt(user.getCreatedAt())
                .build();
    }

    private String getStatusMessage(User user) {
        switch (user.getAccountStatus()) {
            case PENDING:
                return "Awaiting approval";
            case APPROVED:
                return "Approved by " + user.getApprovedBy() + " on " + user.getApprovedDate();
            case REJECTED:
                return "Rejected: " + user.getRejectionReason();
            default:
                return "";
        }
    }
}