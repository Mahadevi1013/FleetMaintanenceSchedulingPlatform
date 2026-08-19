package com.fleet.maintenance.repository;

import com.fleet.maintenance.entity.MaintenanceSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceScheduleRepository
        extends JpaRepository<MaintenanceSchedule, Long> {

    List<MaintenanceSchedule> findByVehicleId(Long vehicleId);

    List<MaintenanceSchedule> findByStatus(String status);
}