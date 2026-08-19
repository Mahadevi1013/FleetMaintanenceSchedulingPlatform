CREATE TABLE maintenance_schedules (
    id BIGSERIAL PRIMARY KEY,

    vehicle_id BIGINT NOT NULL,
    maintenance_type_id BIGINT NOT NULL,

    scheduled_date DATE,
    scheduled_mileage BIGINT,

    priority VARCHAR(50),
    status VARCHAR(50),

    notes TEXT,

    created_at TIMESTAMP,

    CONSTRAINT fk_schedule_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id),

    CONSTRAINT fk_schedule_maintenance_type
        FOREIGN KEY (maintenance_type_id)
        REFERENCES maintenance_types(id)
);