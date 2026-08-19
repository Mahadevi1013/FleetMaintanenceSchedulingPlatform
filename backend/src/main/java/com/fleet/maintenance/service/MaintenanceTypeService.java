package com.fleet.maintenance.service;

import com.fleet.maintenance.entity.MaintenanceType;
import com.fleet.maintenance.repository.MaintenanceTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MaintenanceTypeService {

    private final MaintenanceTypeRepository maintenanceTypeRepository;

    public MaintenanceTypeService(MaintenanceTypeRepository maintenanceTypeRepository) {
        this.maintenanceTypeRepository = maintenanceTypeRepository;
    }

    public MaintenanceType saveMaintenanceType(MaintenanceType maintenanceType) {
        return maintenanceTypeRepository.save(maintenanceType);
    }

    public List<MaintenanceType> getAllMaintenanceTypes() {
        return maintenanceTypeRepository.findAll();
    }

    public Optional<MaintenanceType> getMaintenanceTypeById(Long id) {
        return maintenanceTypeRepository.findById(id);
    }

    public void deleteMaintenanceType(Long id) {
        maintenanceTypeRepository.deleteById(id);
    }
}