const API_BASE = "http://localhost:8080/api";

/* =========================================================
   LOGIN
========================================================= */

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("loginMessage");

    if (email === "admin@fleet.com" && password === "admin123") {

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");

        message.innerText = "";

        loadDashboard();

    } else {

        message.style.color = "red";
        message.innerText = "Invalid email or password";

    }
});


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    document.getElementById("app").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");

    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
}


/* =========================================================
   NAVIGATION
========================================================= */

const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {

    item.addEventListener("click", function () {

        const sectionId = this.dataset.section;

        showSection(sectionId);

    });

});


function showSection(sectionId) {

    const sections = document.querySelectorAll(".page-section");

    sections.forEach(section => {
        section.classList.add("hidden");
    });

    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.remove("hidden");
    }

    menuItems.forEach(item => {

        item.classList.remove("active");

        if (item.dataset.section === sectionId) {
            item.classList.add("active");
        }

    });

    const titles = {

        dashboardSection: "Dashboard",
        vehiclesSection: "Vehicles",
        maintenanceTypesSection: "Maintenance Types",
        schedulesSection: "Maintenance Schedules",
        historySection: "Maintenance History",
        usersSection: "Users",
        notificationsSection: "Notifications"

    };

    document.getElementById("pageTitle").innerText =
        titles[sectionId] || "Dashboard";


    if (sectionId === "dashboardSection") {
        loadDashboard();
    }

    if (sectionId === "vehiclesSection") {
        loadVehicles();
    }

    if (sectionId === "maintenanceTypesSection") {
        loadMaintenanceTypes();
    }

    if (sectionId === "schedulesSection") {
        loadSchedules();
    }

}


/* =========================================================
   DASHBOARD
========================================================= */

async function loadDashboard() {

    try {

        const vehicleResponse =
            await fetch(`${API_BASE}/vehicles`);

        const scheduleResponse =
            await fetch(`${API_BASE}/maintenance-schedules`);

        if (!vehicleResponse.ok) {
            throw new Error("Vehicle API error");
        }

        if (!scheduleResponse.ok) {
            throw new Error("Schedule API error");
        }

        const vehicles = await vehicleResponse.json();
        const schedules = await scheduleResponse.json();

        document.getElementById("vehicleCount").innerText =
            vehicles.length;

        document.getElementById("scheduleCount").innerText =
            schedules.length;

        const pending = schedules.filter(schedule =>
            String(schedule.status).toUpperCase() === "PENDING"
        );

        const completed = schedules.filter(schedule =>
            String(schedule.status).toUpperCase() === "COMPLETED"
        );

        document.getElementById("pendingCount").innerText =
            pending.length;

        document.getElementById("completedCount").innerText =
            completed.length;

        displayDashboardSchedules(schedules);

    } catch (error) {

        console.error("Dashboard error:", error);

        document.getElementById("vehicleCount").innerText = "0";
        document.getElementById("scheduleCount").innerText = "0";
        document.getElementById("pendingCount").innerText = "0";
        document.getElementById("completedCount").innerText = "0";

    }

}


/* =========================================================
   DASHBOARD SCHEDULE TABLE
========================================================= */

function displayDashboardSchedules(schedules) {

    const table =
        document.getElementById("dashboardScheduleTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!schedules || schedules.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    No maintenance schedules found.
                </td>
            </tr>
        `;

        return;
    }

    schedules.slice(0, 10).forEach(schedule => {

        const vehicle =
            schedule.vehicle
                ? schedule.vehicle.vehicleNumber
                : "-";

        const maintenanceType =
            schedule.maintenanceType
                ? schedule.maintenanceType.name
                : "-";

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${safe(schedule.id)}</td>
            <td>${safe(vehicle)}</td>
            <td>${safe(maintenanceType)}</td>
            <td>${safe(schedule.scheduledDate)}</td>
            <td>${statusBadge(schedule.status)}</td>
            <td>${priorityText(schedule.priority)}</td>
        `;

        table.appendChild(row);

    });

}


/* =========================================================
   VEHICLES
========================================================= */

let allVehicles = [];


async function loadVehicles() {

    const table = document.getElementById("vehicleTable");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="7">Loading vehicles...</td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_BASE}/vehicles`);

        if (!response.ok) {
            throw new Error("Vehicle API failed");
        }

        allVehicles = await response.json();

        displayVehicles(allVehicles);

    } catch (error) {

        console.error("Vehicle error:", error);

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    Cannot load vehicles.
                </td>
            </tr>
        `;

    }

}


function displayVehicles(vehicles) {

    const table =
        document.getElementById("vehicleTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!vehicles || vehicles.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No vehicles found.
                </td>
            </tr>
        `;

        return;
    }

    vehicles.forEach(vehicle => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${safe(vehicle.id)}</td>

            <td>
                <strong>${safe(vehicle.vehicleNumber)}</strong>
            </td>

            <td>${safe(vehicle.manufacturer)}</td>

            <td>${safe(vehicle.model)}</td>

            <td>${safe(vehicle.currentMileage)}</td>

            <td>
                ${statusBadge(vehicle.status)}
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteVehicle(${vehicle.id})"
                >
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });

}


/* =========================================================
   VEHICLE SEARCH
========================================================= */

function filterVehicles() {

    const search =
        document.getElementById("vehicleSearch").value
            .toLowerCase()
            .trim();

    const filtered =
        allVehicles.filter(vehicle => {

            const number =
                String(vehicle.vehicleNumber || "")
                    .toLowerCase();

            const manufacturer =
                String(vehicle.manufacturer || "")
                    .toLowerCase();

            const model =
                String(vehicle.model || "")
                    .toLowerCase();

            return (
                number.includes(search) ||
                manufacturer.includes(search) ||
                model.includes(search)
            );

        });

    displayVehicles(filtered);

}


/* =========================================================
   VEHICLE FORM
========================================================= */

function openVehicleForm() {

    document
        .getElementById("vehicleFormContainer")
        .classList.remove("hidden");

}


function closeVehicleForm() {

    document
        .getElementById("vehicleFormContainer")
        .classList.add("hidden");

    document
        .getElementById("vehicleForm")
        .reset();

}


const vehicleForm =
    document.getElementById("vehicleForm");

if (vehicleForm) {

    vehicleForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const vehicleTypeId =
            Number(
                document.getElementById("vehicleTypeId").value
            );

        const vehicle = {

            vehicleNumber:
                document.getElementById("vehicleNumber").value.trim(),

            manufacturer:
                document.getElementById("manufacturer").value.trim(),

            model:
                document.getElementById("vehicleModel").value.trim(),

            vehicleType: {
                id: vehicleTypeId
            },

            currentMileage:
                Number(
                    document.getElementById("currentMileage").value
                ),

            status:
                document.getElementById("vehicleStatus").value

        };

        try {

            const response =
                await fetch(`${API_BASE}/vehicles`, {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(vehicle)

                });

            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(errorText);
            }

            const message =
                document.getElementById("vehicleMessage");

            message.style.color = "green";

            message.innerText =
                "Vehicle added successfully.";

            this.reset();

            await loadVehicles();
            await loadDashboard();

        } catch (error) {

            console.error("Add vehicle error:", error);

            const message =
                document.getElementById("vehicleMessage");

            message.style.color = "red";

            message.innerText =
                "Unable to add vehicle.";

        }

    });

}


/* =========================================================
   DELETE VEHICLE
========================================================= */

async function deleteVehicle(id) {

    const confirmed =
        confirm("Are you sure you want to delete this vehicle?");

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(`${API_BASE}/vehicles/${id}`, {
                method: "DELETE"
            });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Vehicle deleted successfully.");

        await loadVehicles();
        await loadDashboard();

    } catch (error) {

        console.error("Delete vehicle error:", error);

        alert("Unable to delete vehicle.");

    }

}


/* =========================================================
   MAINTENANCE TYPES
========================================================= */

let allMaintenanceTypes = [];


async function loadMaintenanceTypes() {

    const table =
        document.getElementById("maintenanceTypeTable");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="4">
                Loading maintenance types...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_BASE}/maintenance-types`);

        if (!response.ok) {
            throw new Error("Maintenance type API failed");
        }

        allMaintenanceTypes =
            await response.json();

        displayMaintenanceTypes(
            allMaintenanceTypes
        );

    } catch (error) {

        console.error(
            "Maintenance type error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    Cannot load maintenance types.
                </td>
            </tr>
        `;

    }

}


function displayMaintenanceTypes(types) {

    const table =
        document.getElementById("maintenanceTypeTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!types || types.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4">
                    No maintenance types found.
                </td>
            </tr>
        `;

        return;
    }

    types.forEach(type => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${safe(type.id)}</td>

            <td>
                <strong>${safe(type.name)}</strong>
            </td>

            <td>${safe(type.description)}</td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteMaintenanceType(${type.id})"
                >
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });

}


/* =========================================================
   MAINTENANCE TYPE FORM
========================================================= */

function openMaintenanceTypeForm() {

    document
        .getElementById("maintenanceTypeFormContainer")
        .classList.remove("hidden");

}


function closeMaintenanceTypeForm() {

    document
        .getElementById("maintenanceTypeFormContainer")
        .classList.add("hidden");

    document
        .getElementById("maintenanceTypeForm")
        .reset();

}


const maintenanceTypeForm =
    document.getElementById("maintenanceTypeForm");

if (maintenanceTypeForm) {

    maintenanceTypeForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const maintenanceType = {

                name:
                    document
                        .getElementById("maintenanceTypeName")
                        .value
                        .trim(),

                description:
                    document
                        .getElementById("maintenanceTypeDescription")
                        .value
                        .trim()

            };

            try {

                const response =
                    await fetch(
                        `${API_BASE}/maintenance-types`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    maintenanceType
                                )

                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(errorText);
                }

                const message =
                    document.getElementById(
                        "maintenanceTypeMessage"
                    );

                message.style.color = "green";

                message.innerText =
                    "Maintenance type added successfully.";

                this.reset();

                await loadMaintenanceTypes();
                await loadDashboard();

            } catch (error) {

                console.error(
                    "Add maintenance type error:",
                    error
                );

                const message =
                    document.getElementById(
                        "maintenanceTypeMessage"
                    );

                message.style.color = "red";

                message.innerText =
                    "Unable to add maintenance type.";

            }

        }
    );

}


/* =========================================================
   DELETE MAINTENANCE TYPE
========================================================= */

async function deleteMaintenanceType(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this maintenance type?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE}/maintenance-types/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert(
            "Maintenance type deleted successfully."
        );

        await loadMaintenanceTypes();

    } catch (error) {

        console.error(
            "Delete maintenance type error:",
            error
        );

        alert(
            "Unable to delete maintenance type."
        );

    }

}


/* =========================================================
   MAINTENANCE SCHEDULES
========================================================= */

let allSchedules = [];


async function loadSchedules() {

    const table =
        document.getElementById("scheduleTable");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="8">
                Loading schedules...
            </td>
        </tr>
    `;

    try {

        const response =
            await fetch(
                `${API_BASE}/maintenance-schedules`
            );

        if (!response.ok) {
            throw new Error("Schedule API failed");
        }

        allSchedules =
            await response.json();

        displaySchedules(allSchedules);

    } catch (error) {

        console.error(
            "Schedule error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    Cannot load maintenance schedules.
                </td>
            </tr>
        `;

    }

}


function displaySchedules(schedules) {

    const table =
        document.getElementById("scheduleTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!schedules || schedules.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    No maintenance schedules found.
                </td>
            </tr>
        `;

        return;
    }

    schedules.forEach(schedule => {

        const vehicle =
            schedule.vehicle
                ? schedule.vehicle.vehicleNumber
                : "-";

        const maintenanceType =
            schedule.maintenanceType
                ? schedule.maintenanceType.name
                : "-";

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${safe(schedule.id)}</td>

            <td>${safe(vehicle)}</td>

            <td>${safe(maintenanceType)}</td>

            <td>${safe(schedule.scheduledDate)}</td>

            <td>${safe(schedule.scheduledMileage)}</td>

            <td>
                ${statusBadge(schedule.status)}
            </td>

            <td>
                ${priorityText(schedule.priority)}
            </td>

            <td>
                <button
                    class="delete-btn"
                    onclick="deleteSchedule(${schedule.id})"
                >
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });

}


/* =========================================================
   SCHEDULE FORM
========================================================= */

function openScheduleForm() {

    document
        .getElementById("scheduleFormContainer")
        .classList.remove("hidden");

}


function closeScheduleForm() {

    document
        .getElementById("scheduleFormContainer")
        .classList.add("hidden");

    document
        .getElementById("scheduleForm")
        .reset();

}


const scheduleForm =
    document.getElementById("scheduleForm");

if (scheduleForm) {

    scheduleForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const vehicleId =
                Number(
                    document
                        .getElementById("scheduleVehicleId")
                        .value
                );

            const maintenanceTypeId =
                Number(
                    document
                        .getElementById(
                            "scheduleMaintenanceTypeId"
                        )
                        .value
                );

            const schedule = {

                vehicle: {
                    id: vehicleId
                },

                maintenanceType: {
                    id: maintenanceTypeId
                },

                scheduledDate:
                    document
                        .getElementById("scheduledDate")
                        .value,

                scheduledMileage:
                    Number(
                        document
                            .getElementById("scheduledMileage")
                            .value
                    ),

                priority:
                    document
                        .getElementById("schedulePriority")
                        .value,

                status:
                    document
                        .getElementById("scheduleStatus")
                        .value,

                notes:
                    document
                        .getElementById("scheduleNotes")
                        .value
                        .trim()

            };

            try {

                const response =
                    await fetch(
                        `${API_BASE}/maintenance-schedules`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(schedule)

                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(errorText);
                }

                const message =
                    document.getElementById(
                        "scheduleMessage"
                    );

                message.style.color = "green";

                message.innerText =
                    "Maintenance schedule created successfully.";

                this.reset();

                await loadSchedules();
                await loadDashboard();

            } catch (error) {

                console.error(
                    "Create schedule error:",
                    error
                );

                const message =
                    document.getElementById(
                        "scheduleMessage"
                    );

                message.style.color = "red";

                message.innerText =
                    "Unable to create maintenance schedule.";

            }

        }
    );

}


/* =========================================================
   DELETE SCHEDULE
========================================================= */

async function deleteSchedule(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this schedule?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE}/maintenance-schedules/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert(
            "Maintenance schedule deleted successfully."
        );

        await loadSchedules();
        await loadDashboard();

    } catch (error) {

        console.error(
            "Delete schedule error:",
            error
        );

        alert(
            "Unable to delete maintenance schedule."
        );

    }

}


/* =========================================================
   UI HELPERS
========================================================= */

function statusBadge(status) {

    if (!status) {
        return `<span class="status-badge">-</span>`;
    }

    const value =
        String(status).toUpperCase();

    let cssClass = "";

    if (value === "PENDING") {
        cssClass = "status-pending";
    }
    else if (value === "COMPLETED") {
        cssClass = "status-completed";
    }
    else if (
        value === "IN_PROGRESS" ||
        value === "IN PROGRESS"
    ) {
        cssClass = "status-progress";
    }
    else if (value === "CANCELLED") {
        cssClass = "status-cancelled";
    }

    return `
        <span class="status-badge ${cssClass}">
            ${safe(value)}
        </span>
    `;

}


function priorityText(priority) {

    if (!priority) {
        return "-";
    }

    const value =
        String(priority).toUpperCase();

    let cssClass = "";

    if (value === "HIGH" || value === "URGENT") {
        cssClass = "priority-high";
    }
    else if (value === "MEDIUM") {
        cssClass = "priority-medium";
    }
    else if (value === "LOW") {
        cssClass = "priority-low";
    }

    return `
        <span class="${cssClass}">
            ${safe(value)}
        </span>
    `;

}


function safe(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "-";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   INITIAL PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    document
        .getElementById("loginPage")
        .classList.remove("hidden");

    document
        .getElementById("app")
        .classList.add("hidden");

});
/* =========================================================
   MAINTENANCE HISTORY
========================================================= */

async function loadHistory() {

    const table = document.getElementById("historyTable");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="8">Loading maintenance history...</td>
        </tr>
    `;

    try {

        const response =
            await fetch(`${API_BASE}/maintenances`);

        if (!response.ok) {
            throw new Error("Maintenance API failed");
        }

        const maintenances = await response.json();

        displayHistory(maintenances);

    } catch (error) {

        console.error("Maintenance history error:", error);

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    Cannot load maintenance history.
                </td>
            </tr>
        `;
    }
}


function displayHistory(maintenances) {

    const table =
        document.getElementById("historyTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    if (!maintenances || maintenances.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="8">
                    No maintenance history found.
                </td>
            </tr>
        `;

        return;
    }

    maintenances.forEach(maintenance => {

        const vehicle =
            maintenance.vehicle
                ? maintenance.vehicle.vehicleNumber
                : "-";

        const maintenanceType =
            maintenance.maintenanceType
                ? maintenance.maintenanceType.name
                : "-";

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${safe(maintenance.id)}</td>

            <td>
                <strong>${safe(vehicle)}</strong>
            </td>

            <td>${safe(maintenanceType)}</td>

            <td>${safe(maintenance.description)}</td>

            <td>${safe(maintenance.serviceDate)}</td>

            <td>${safe(maintenance.mileage)}</td>

            <td>
                ${statusBadge(maintenance.status)}
            </td>

            <td>${safe(maintenance.notes)}</td>
        `;

        table.appendChild(row);
    });
}