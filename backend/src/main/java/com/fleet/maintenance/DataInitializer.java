package com.fleet.maintenance;

import com.fleet.maintenance.entity.Maintenance;
import com.fleet.maintenance.entity.MaintenanceType;
import com.fleet.maintenance.entity.Role;
import com.fleet.maintenance.entity.Vehicle;
import com.fleet.maintenance.entity.VehicleType;

import com.fleet.maintenance.repository.MaintenanceRepository;
import com.fleet.maintenance.repository.MaintenanceTypeRepository;
import com.fleet.maintenance.repository.RoleRepository;
import com.fleet.maintenance.repository.VehicleRepository;
import com.fleet.maintenance.repository.VehicleTypeRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final VehicleRepository vehicleRepository;
    private final VehicleTypeRepository vehicleTypeRepository;
    private final MaintenanceTypeRepository maintenanceTypeRepository;
    private final MaintenanceRepository maintenanceRepository;

    public DataInitializer(
            RoleRepository roleRepository,
            VehicleRepository vehicleRepository,
            VehicleTypeRepository vehicleTypeRepository,
            MaintenanceTypeRepository maintenanceTypeRepository,
            MaintenanceRepository maintenanceRepository) {

        this.roleRepository = roleRepository;
        this.vehicleRepository = vehicleRepository;
        this.vehicleTypeRepository = vehicleTypeRepository;
        this.maintenanceTypeRepository = maintenanceTypeRepository;
        this.maintenanceRepository = maintenanceRepository;
    }

    @Override
    public void run(String... args) {

        // Roles
        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("FLEET_MANAGER");
        createRoleIfNotExists("MAINTENANCE_OFFICER");

        // Vehicle Types
        createVehicleTypeIfNotExists(
                "Truck",
                "Heavy commercial vehicle"
        );

        createVehicleTypeIfNotExists(
                "Bus",
                "Passenger transport vehicle"
        );

        createVehicleTypeIfNotExists(
                "Van",
                "Light commercial vehicle"
        );

        createVehicleTypeIfNotExists(
                "Car",
                "Passenger car"
        );

        // Maintenance Types
        createMaintenanceTypeIfNotExists(
                "Oil Change",
                "Engine oil replacement"
        );

        createMaintenanceTypeIfNotExists(
                "Brake Service",
                "Brake inspection and service"
        );

        createMaintenanceTypeIfNotExists(
                "Tire Replacement",
                "Tire inspection and replacement"
        );

        createMaintenanceTypeIfNotExists(
                "General Service",
                "General vehicle inspection"
        );

        // Vehicle
        createVehicleIfNotExists(
                "TN01AB1234",
                "Truck",
                "Tata",
                "Prima",
                45000L,
                "ACTIVE"
        );

        // Maintenance Record
        createMaintenanceIfNotExists(
                "TN01AB1234",
                "Oil Change",
                "Regular engine oil service",
                45000L,
                "COMPLETED",
                "Engine oil and filter replaced"
        );
    }

    // ---------------- ROLE ----------------

    private void createRoleIfNotExists(String roleName) {

        boolean exists = roleRepository.findAll()
                .stream()
                .anyMatch(role ->
                        role.getName().equals(roleName)
                );

        if (!exists) {

            Role role = new Role();
            role.setName(roleName);

            roleRepository.save(role);
        }
    }

    // ---------------- VEHICLE TYPE ----------------

    private void createVehicleTypeIfNotExists(
            String name,
            String description) {

        boolean exists = vehicleTypeRepository.findAll()
                .stream()
                .anyMatch(type ->
                        type.getName().equals(name)
                );

        if (!exists) {

            VehicleType vehicleType = new VehicleType();

            vehicleType.setName(name);
            vehicleType.setDescription(description);

            vehicleTypeRepository.save(vehicleType);
        }
    }

    // ---------------- MAINTENANCE TYPE ----------------

    private void createMaintenanceTypeIfNotExists(
            String name,
            String description) {

        boolean exists = maintenanceTypeRepository.findAll()
                .stream()
                .anyMatch(type ->
                        type.getName().equals(name)
                );

        if (!exists) {

            MaintenanceType maintenanceType =
                    new MaintenanceType();

            maintenanceType.setName(name);
            maintenanceType.setDescription(description);

            maintenanceTypeRepository.save(maintenanceType);
        }
    }

    // ---------------- VEHICLE ----------------

    private void createVehicleIfNotExists(
            String vehicleNumber,
            String vehicleTypeName,
            String manufacturer,
            String model,
            Long mileage,
            String status) {

        boolean exists = vehicleRepository
                .findByVehicleNumber(vehicleNumber)
                .isPresent();

        if (!exists) {

            VehicleType vehicleType =
                    vehicleTypeRepository
                            .findAll()
                            .stream()
                            .filter(type ->
                                    type.getName()
                                            .equals(vehicleTypeName)
                            )
                            .findFirst()
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Vehicle type not found"
                                    )
                            );

            Vehicle vehicle = new Vehicle();

            vehicle.setVehicleNumber(vehicleNumber);
            vehicle.setVehicleType(vehicleType);
            vehicle.setManufacturer(manufacturer);
            vehicle.setModel(model);
            vehicle.setCurrentMileage(mileage);
            vehicle.setStatus(status);

            vehicleRepository.save(vehicle);
        }
    }

    // ---------------- MAINTENANCE ----------------

    private void createMaintenanceIfNotExists(
            String vehicleNumber,
            String maintenanceTypeName,
            String description,
            Long mileage,
            String status,
            String notes) {

        Vehicle vehicle = vehicleRepository
                .findByVehicleNumber(vehicleNumber)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found"
                        )
                );

        MaintenanceType maintenanceType =
                maintenanceTypeRepository
                        .findAll()
                        .stream()
                        .filter(type ->
                                type.getName()
                                        .equals(maintenanceTypeName)
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Maintenance type not found"
                                )
                        );

        boolean exists = maintenanceRepository
                .findAll()
                .stream()
                .anyMatch(maintenance ->
                        maintenance.getVehicle()
                                .getId()
                                .equals(vehicle.getId())
                        &&
                        maintenance.getMaintenanceType()
                                .getId()
                                .equals(maintenanceType.getId())
                );

        if (!exists) {

            Maintenance maintenance =
                    new Maintenance();

            maintenance.setVehicle(vehicle);
            maintenance.setMaintenanceType(
                    maintenanceType
            );
            maintenance.setDescription(
                    description
            );
            maintenance.setMileage(mileage);
            maintenance.setStatus(status);
            maintenance.setNotes(notes);

            maintenanceRepository.save(
                    maintenance
            );
        }
    }
}