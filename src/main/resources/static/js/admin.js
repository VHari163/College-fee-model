const API_URL = "http://localhost:8081/api";

// =========================================================
// ADMIN LOGIN CHECK
// =========================================================

const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (role !== "ADMIN") {
    window.location.href = "index.html";
}


// =========================================================
// ADMIN INFORMATION
// =========================================================

const adminName = document.getElementById("adminName");
const adminRole = document.getElementById("adminRole");
const welcomeAdmin = document.getElementById("welcomeAdmin");

if (adminName) {
    adminName.textContent = username || "Admin";
}

if (adminRole) {
    adminRole.textContent = "Administrator";
}

if (welcomeAdmin) {
    welcomeAdmin.textContent = username || "Admin";
}


// =========================================================
// DASHBOARD CARDS
// =========================================================

const totalStudents = document.getElementById("totalStudents");
const totalDepartments = document.getElementById("totalDepartments");
const totalCourses = document.getElementById("totalCourses");
const totalFeeTypes = document.getElementById("totalFeeTypes");
const totalPayments = document.getElementById("totalPayments");


// =========================================================
// LOAD DASHBOARD DATA
// =========================================================

async function loadAdminDashboard() {

    try {

        const response = await fetch(`${API_URL}/students`);

        if (response.ok) {
            const data = await response.json();

            if (totalStudents) {
                totalStudents.textContent = data.length;
            }
        }

    } catch (error) {
        console.error("Students error:", error);
    }


    try {

        const response = await fetch(`${API_URL}/departments`);

        if (response.ok) {
            const data = await response.json();

            if (totalDepartments) {
                totalDepartments.textContent = data.length;
            }
        }

    } catch (error) {
        console.error("Departments error:", error);
    }


    try {

        const response = await fetch(`${API_URL}/courses`);

        if (response.ok) {
            const data = await response.json();

            if (totalCourses) {
                totalCourses.textContent = data.length;
            }
        }

    } catch (error) {
        console.error("Courses error:", error);
    }


    try {

        const response = await fetch(`${API_URL}/fee-types`);

        if (response.ok) {
            const data = await response.json();

            if (totalFeeTypes) {
                totalFeeTypes.textContent = data.length;
            }
        }

    } catch (error) {
        console.error("Fee types error:", error);
    }


    try {

        const response = await fetch(`${API_URL}/payments`);

        if (response.ok) {
            const data = await response.json();

            if (totalPayments) {
                totalPayments.textContent = data.length;
            }
        }

    } catch (error) {
        console.error("Payments error:", error);
    }
}


// =========================================================
// HAMBURGER / SIDEBAR
// =========================================================

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        sidebar.classList.toggle("active");

        if (mainContent) {
            mainContent.classList.toggle("sidebar-open");
        }

    });
}


// =========================================================
// CLOSE SIDEBAR WHEN CLICKING OUTSIDE
// =========================================================

document.addEventListener("click", function (event) {

    if (!sidebar || !menuBtn) {
        return;
    }

    const clickedInsideSidebar =
        sidebar.contains(event.target);

    const clickedMenuButton =
        menuBtn.contains(event.target);

    if (
        sidebar.classList.contains("active") &&
        !clickedInsideSidebar &&
        !clickedMenuButton
    ) {

        sidebar.classList.remove("active");

        if (mainContent) {
            mainContent.classList.remove("sidebar-open");
        }
    }
});


// =========================================================
// SIDEBAR LINKS
// =========================================================

const dashboardLink =
    document.getElementById("dashboardLink");

const studentsLink =
    document.getElementById("studentsLink");

const departmentsLink =
    document.getElementById("departmentsLink");

const coursesLink =
    document.getElementById("coursesLink");

const academicYearsLink =
    document.getElementById("academicYearsLink");

const feeTypesLink =
    document.getElementById("feeTypesLink");

const feeStructuresLink =
    document.getElementById("feeStructuresLink");

const paymentsLink =
    document.getElementById("paymentsLink");


// Dashboard
if (dashboardLink) {

    dashboardLink.addEventListener("click", function (event) {

        event.preventDefault();

        window.location.href = "admin.html";

    });
}


// Students
if (studentsLink) {

    studentsLink.addEventListener("click", function (event) {

        event.preventDefault();

        alert("Students Management will be added next.");

    });
}


// Departments
if (departmentsLink) {

    departmentsLink.addEventListener("click", function (event) {

        event.preventDefault();

        alert("Department Management will be added next.");

    });
}


// Courses
if (coursesLink) {

    coursesLink.addEventListener("click", function (event) {

        event.preventDefault();

        alert("Course Management will be added next.");

    });
}


// Academic Years
if (academicYearsLink) {

    academicYearsLink.addEventListener("click", function (event) {

        event.preventDefault();

        alert("Academic Year Management will be added next.");

    });
}


// Fee Types
if (feeTypesLink) {

    feeTypesLink.addEventListener("click", function (event) {

        event.preventDefault();

        window.location.href = "fee-types.html";

    });
}


// Fee Structures
if (feeStructuresLink) {

    feeStructuresLink.addEventListener("click", function (event) {

        event.preventDefault();

        window.location.href = "fee-structures.html";

    });

}


// Payments
if (paymentsLink) {

    paymentsLink.addEventListener("click", function (event) {

        event.preventDefault();

        alert("Payment Management will be added next.");

    });
}


// =========================================================
// MANAGEMENT CARD BUTTONS
// =========================================================

const studentsManagementBtn =
    document.getElementById("studentsManagementBtn");

const departmentsManagementBtn =
    document.getElementById("departmentsManagementBtn");

const coursesManagementBtn =
    document.getElementById("coursesManagementBtn");

const feeTypesManagementBtn =
    document.getElementById("feeTypesManagementBtn");

const feeStructuresManagementBtn =
    document.getElementById("feeStructuresManagementBtn");

const paymentsManagementBtn =
    document.getElementById("paymentsManagementBtn");


if (studentsManagementBtn) {

    studentsManagementBtn.addEventListener("click", function () {

        alert("Students Management will be added next.");

    });
}


if (departmentsManagementBtn) {

    departmentsManagementBtn.addEventListener("click", function () {

        alert("Department Management will be added next.");

    });
}


if (coursesManagementBtn) {

    coursesManagementBtn.addEventListener("click", function () {

        alert("Course Management will be added next.");

    });
}


if (feeTypesManagementBtn) {

    feeTypesManagementBtn.addEventListener("click", function () {

        window.location.href = "fee-types.html";

    });
}


if (feeStructuresManagementBtn) {

    feeStructuresManagementBtn.addEventListener("click", function () {

        window.location.href = "fee-structures.html";

    });

}


if (paymentsManagementBtn) {

    paymentsManagementBtn.addEventListener("click", function () {

        alert("Payment Management will be added next.");

    });
}


// =========================================================
// LOGOUT
// =========================================================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("email");

        window.location.href = "index.html";

    });
}


// =========================================================
// LOAD DASHBOARD
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    loadAdminDashboard();

});