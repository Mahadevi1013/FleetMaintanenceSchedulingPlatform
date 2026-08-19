package com.fleet.maintenance.repository;

import com.fleet.maintenance.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
}