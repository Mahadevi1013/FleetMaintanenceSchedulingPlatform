package com.fleet.maintenance.controller;

import com.fleet.maintenance.entity.MaintenanceType;
import com.fleet.maintenance.service.MaintenanceTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-types")
@CrossOrigin
public class MaintenanceTypeController {

    private final MaintenanceTypeService maintenanceTypeService;

    public MaintenanceTypeController(MaintenanceTypeService maintenanceTypeService) {
        this.maintenanceTypeService = maintenanceTypeService;
    }

    @GetMapping
    public List<MaintenanceType> getAllMaintenanceTypes() {
        return maintenanceTypeService.getAllMaintenanceTypes();
    }

    @GetMapping("/{id}")
    public MaintenanceType getMaintenanceTypeById(@PathVariable Long id) {
        return maintenanceTypeService.getMaintenanceTypeById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance type not found"));
    }

    @PostMapping
    public MaintenanceType createMaintenanceType(
            @RequestBody MaintenanceType maintenanceType) {
        return maintenanceTypeService.saveMaintenanceType(maintenanceType);
    }

    @DeleteMapping("/{id}")
    public String deleteMaintenanceType(@PathVariable Long id) {
        maintenanceTypeService.deleteMaintenanceType(id);
        return "Maintenance type deleted successfully";
    }
}