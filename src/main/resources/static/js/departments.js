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
// ELEMENTS
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

const departmentMessage =
    document.getElementById("departmentMessage");

const departmentsTableBody =
    document.getElementById("departmentsTableBody");

const refreshDepartmentsBtn =
    document.getElementById("refreshDepartmentsBtn");


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
// SHOW MESSAGE
// =========================================================

function showMessage(message, type) {

    if (!departmentMessage) {
        return;
    }

    departmentMessage.textContent =
        message;

    departmentMessage.className =
        "fee-type-message " + type;

    setTimeout(() => {

        departmentMessage.textContent =
            "";

        departmentMessage.className =
            "fee-type-message";

    }, 5000);
}


// =========================================================
// LOAD DEPARTMENTS
// =========================================================

async function loadDepartments() {

    try {

        departmentsTableBody.innerHTML = `
            <tr>
                <td colspan="3"
                    class="loading-cell">
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
                    <td colspan="3"
                        class="empty-cell">
                        No departments found.
                    </td>
                </tr>
            `;

            return;
        }


        departments.forEach(department => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${department.departmentId}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            department.departmentName
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        department.departmentCode
                    )}
                </td>

            `;


            departmentsTableBody.appendChild(
                row
            );

        });

    }
    catch (error) {

        console.error(
            "Department loading error:",
            error
        );


        departmentsTableBody.innerHTML = `
            <tr>

                <td
                    colspan="3"
                    class="error-cell">

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
                departmentCode.value.trim()
                    .toUpperCase();


            if (!name) {

                showMessage(
                    "Please enter department name.",
                    "error"
                );

                return;
            }


            if (!code) {

                showMessage(
                    "Please enter department code.",
                    "error"
                );

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


                showMessage(
                    "Department added successfully.",
                    "success"
                );


                departmentForm.reset();


                await loadDepartments();

            }
            catch (error) {

                console.error(
                    "Add department error:",
                    error
                );


                showMessage(
                    "Unable to add department. The department name or code may already exist.",
                    "error"
                );
            }

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
// SIDEBAR
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
// NAVIGATION
// =========================================================

const studentsLink =
    document.getElementById("studentsLink");

const coursesLink =
    document.getElementById("coursesLink");

const academicYearsLink =
    document.getElementById("academicYearsLink");

const paymentsLink =
    document.getElementById("paymentsLink");


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


if (coursesLink) {

    coursesLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Course Management will be added next."
            );

        }
    );
}


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
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDepartments();

    }
);