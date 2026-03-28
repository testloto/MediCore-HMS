package org.hms.modules.auth.repository;

import org.hms.modules.auth.entity.AccountStatus;
import org.hms.modules.auth.entity.Role;
import org.hms.modules.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    List<User> findByRole(Role role);
    List<User> findByAccountStatus(AccountStatus status);
    List<User> findByEnabled(boolean enabled);

    Optional<User> findByEmailAndAccountStatus(String email, AccountStatus status);
}