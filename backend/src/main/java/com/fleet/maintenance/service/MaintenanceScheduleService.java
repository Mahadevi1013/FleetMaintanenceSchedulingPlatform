package com.fleet.maintenance.service;

import com.fleet.maintenance.entity.MaintenanceSchedule;
import com.fleet.maintenance.repository.MaintenanceScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceScheduleService {

    private final MaintenanceScheduleRepository scheduleRepository;

    public MaintenanceScheduleService(
            MaintenanceScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public MaintenanceSchedule saveSchedule(
            MaintenanceSchedule schedule) {
        return scheduleRepository.save(schedule);
    }

    public List<MaintenanceSchedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<MaintenanceSchedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public List<MaintenanceSchedule> getSchedulesByVehicle(
            Long vehicleId) {
        return scheduleRepository.findByVehicleId(vehicleId);
    }

    public List<MaintenanceSchedule> getSchedulesByStatus(
            String status) {
        return scheduleRepository.findByStatus(status);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }
}