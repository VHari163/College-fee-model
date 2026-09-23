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
// HTML ELEMENTS
// =========================================================

const adminName =
    document.getElementById("adminName");

const adminRole =
    document.getElementById("adminRole");

const departmentForm =
    document.getElementById("departmentForm");

const departmentName =
    document.getElementById("departmentName");

const departmentCode =
    document.getElementById("departmentCode");

const departmentsTableBody =
    document.getElementById(
        "departmentsTableBody"
    );

const refreshDepartmentsBtn =
    document.getElementById(
        "refreshDepartmentsBtn"
    );


// =========================================================
// ADMIN INFORMATION
// =========================================================

if (adminName) {

    adminName.textContent =
        username || "Admin";

}

if (adminRole) {

    adminRole.textContent =
        "Administrator";

}


// =========================================================
// LOAD DEPARTMENTS
// =========================================================

async function loadDepartments() {

    if (!departmentsTableBody) {
        return;
    }

    try {

        departmentsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="loading-cell">
                    Loading departments...
                </td>
            </tr>
        `;


        const response =
            await fetch(
                `${API_URL}/departments`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load departments."
            );

        }


        const departments =
            await response.json();


        departmentsTableBody.innerHTML =
            "";


        if (
            !departments ||
            departments.length === 0
        ) {

            departmentsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-cell">
                        No departments found.
                    </td>
                </tr>
            `;

            return;
        }


        departments.forEach(
            function (department) {

                const row =
                    document.createElement("tr");


                row.innerHTML = `
                    <td>
                        ${department.departmentId}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(
                                department.departmentCode || ""
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(
                            department.departmentName || ""
                        )}
                    </td>

                    <td>
                        <span class="status-badge">
                            Active
                        </span>
                    </td>
                `;


                departmentsTableBody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Error loading departments:",
            error
        );


        departmentsTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="error-cell">
                    Unable to load departments.
                </td>
            </tr>
        `;

    }
}


// =========================================================
// ADD DEPARTMENT
// =========================================================

if (departmentForm) {

    departmentForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                departmentName.value.trim();

            const code =
                departmentCode.value.trim();


            if (!name) {

                alert(
                    "Please enter department name."
                );

                departmentName.focus();

                return;
            }


            if (!code) {

                alert(
                    "Please enter department code."
                );

                departmentCode.focus();

                return;
            }


            const departmentData = {

                departmentName:
                    name,

                departmentCode:
                    code

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/departments`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    departmentData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to add department."
                    );

                }


                alert(
                    "Department added successfully."
                );


                departmentForm.reset();


                await loadDepartments();


            } catch (error) {

                console.error(
                    "Error adding department:",
                    error
                );


                alert(
                    "Unable to add department.\n\n" +
                    error.message
                );

            }

        }
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =========================================================
// HAMBURGER / SIDEBAR
// =========================================================

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const mainContent =
    document.getElementById("mainContent");


if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            sidebar.classList.toggle(
                "active"
            );


            if (mainContent) {

                mainContent.classList.toggle(
                    "sidebar-open"
                );

            }

        }
    );

}


// =========================================================
// CLOSE SIDEBAR OUTSIDE
// =========================================================

document.addEventListener(
    "click",
    function (event) {

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

            sidebar.classList.remove(
                "active"
            );


            if (mainContent) {

                mainContent.classList.remove(
                    "sidebar-open"
                );

            }

        }

    }
);


// =========================================================
// SIDEBAR NAVIGATION
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

    dashboardLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "admin.html";

        }
    );

}


// Students

if (studentsLink) {

    studentsLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Students Management will be added next."
            );

        }
    );

}


// Departments

if (departmentsLink) {

    departmentsLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "departments.html";

        }
    );

}


// Courses

if (coursesLink) {

    coursesLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "courses.html";

        }
    );

}


// Academic Years

if (academicYearsLink) {

    academicYearsLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Academic Year Management will be added next."
            );

        }
    );

}


// Fee Types

if (feeTypesLink) {

    feeTypesLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "fee-types.html";

        }
    );

}


// Fee Structures

if (feeStructuresLink) {

    feeStructuresLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.href =
                "fee-structures.html";

        }
    );

}


// Payments

if (paymentsLink) {

    paymentsLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Payment Management will be added next."
            );

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("email");


            window.location.href =
                "index.html";

        }
    );

}


// =========================================================
// REFRESH
// =========================================================

if (refreshDepartmentsBtn) {

    refreshDepartmentsBtn.addEventListener(
        "click",
        function () {

            loadDepartments();

        }
    );

}


// =========================================================
// LOAD PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDepartments();

    }
);

