package com.fleet.maintenance.controller;

import com.fleet.maintenance.entity.VehicleType;
import com.fleet.maintenance.service.VehicleTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@CrossOrigin
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    public VehicleTypeController(VehicleTypeService vehicleTypeService) {
        this.vehicleTypeService = vehicleTypeService;
    }

    @GetMapping
    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeService.getAllVehicleTypes();
    }

    @GetMapping("/{id}")
    public VehicleType getVehicleTypeById(@PathVariable Long id) {
        return vehicleTypeService.getVehicleTypeById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle type not found"));
    }

    @PostMapping
    public VehicleType createVehicleType(@RequestBody VehicleType vehicleType) {
        return vehicleTypeService.saveVehicleType(vehicleType);
    }
}