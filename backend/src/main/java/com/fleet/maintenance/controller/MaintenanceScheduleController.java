package com.fleet.maintenance.controller;

import com.fleet.maintenance.entity.MaintenanceSchedule;
import com.fleet.maintenance.service.MaintenanceScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-schedules")
@CrossOrigin
public class MaintenanceScheduleController {

    private final MaintenanceScheduleService scheduleService;

    public MaintenanceScheduleController(
            MaintenanceScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping
    public List<MaintenanceSchedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    @GetMapping("/{id}")
    public MaintenanceSchedule getScheduleById(
            @PathVariable Long id) {

        return scheduleService.getScheduleById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Maintenance schedule not found"));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public List<MaintenanceSchedule> getSchedulesByVehicle(
            @PathVariable Long vehicleId) {

        return scheduleService.getSchedulesByVehicle(vehicleId);
    }

    @GetMapping("/status/{status}")
    public List<MaintenanceSchedule> getSchedulesByStatus(
            @PathVariable String status) {

        return scheduleService.getSchedulesByStatus(status);
    }

    @PostMapping
    public MaintenanceSchedule createSchedule(
            @RequestBody MaintenanceSchedule schedule) {

        return scheduleService.saveSchedule(schedule);
    }

    @DeleteMapping("/{id}")
    public String deleteSchedule(
            @PathVariable Long id) {

        scheduleService.deleteSchedule(id);

        return "Maintenance schedule deleted successfully";
    }
}