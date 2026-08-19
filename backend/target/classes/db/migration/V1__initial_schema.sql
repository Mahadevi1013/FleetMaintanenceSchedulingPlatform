CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
);

CREATE TABLE vehicle_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL UNIQUE,
    vehicle_type_id BIGINT NOT NULL,
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    registration_date DATE,
    current_mileage BIGINT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehicles_type
        FOREIGN KEY (vehicle_type_id)
        REFERENCES vehicle_types(id)
);

CREATE TABLE maintenance_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE maintenances (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    maintenance_type_id BIGINT NOT NULL,
    description TEXT,
    service_date DATE,
    mileage BIGINT,
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_maintenance_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id),

    CONSTRAINT fk_maintenance_type
        FOREIGN KEY (maintenance_type_id)
        REFERENCES maintenance_types(id)
);

CREATE TABLE maintenance_schedules (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    maintenance_type_id BIGINT NOT NULL,
    due_date DATE,
    due_mileage BIGINT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_schedule_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id),

    CONSTRAINT fk_schedule_type
        FOREIGN KEY (maintenance_type_id)
        REFERENCES maintenance_types(id)
);

CREATE TABLE maintenance_assignments (
    id BIGSERIAL PRIMARY KEY,
    maintenance_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    assigned_date DATE,
    status VARCHAR(50),

    CONSTRAINT fk_assignment_maintenance
        FOREIGN KEY (maintenance_id)
        REFERENCES maintenances(id),

    CONSTRAINT fk_assignment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);

CREATE TABLE maintenance_history (
    id BIGSERIAL PRIMARY KEY,
    maintenance_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    completed_date DATE,
    completed_mileage BIGINT,
    service_details TEXT,
    notes TEXT,

    CONSTRAINT fk_history_maintenance
        FOREIGN KEY (maintenance_id)
        REFERENCES maintenances(id),

    CONSTRAINT fk_history_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
);

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    maintenance_id BIGINT,
    message TEXT NOT NULL,
    notification_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_notification_maintenance
        FOREIGN KEY (maintenance_id)
        REFERENCES maintenances(id)
);