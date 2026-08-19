package com.fleet.maintenance.repository;

import com.fleet.maintenance.entity.MaintenanceType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaintenanceTypeRepository extends JpaRepository<MaintenanceType, Long> {
}