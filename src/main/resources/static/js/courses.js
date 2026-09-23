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

const courseForm =
    document.getElementById("courseForm");

const courseName =
    document.getElementById("courseName");

const courseCode =
    document.getElementById("courseCode");

const durationYears =
    document.getElementById("durationYears");

const departmentSelect =
    document.getElementById("departmentSelect");

const coursesTableBody =
    document.getElementById("coursesTableBody");

const refreshCoursesBtn =
    document.getElementById("refreshCoursesBtn");


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

    if (!departmentSelect) {
        return;
    }

    try {

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

        departmentSelect.innerHTML =
            `<option value="">Select Department</option>`;

        departments.forEach(
            function (department) {

                const option =
                    document.createElement("option");

                option.value =
                    department.departmentId;

                option.textContent =
                    `${department.departmentCode} - ${department.departmentName}`;

                departmentSelect.appendChild(
                    option
                );

            }
        );

    } catch (error) {

        console.error(
            "Error loading departments:",
            error
        );

        departmentSelect.innerHTML =
            `<option value="">Unable to load departments</option>`;

    }
}


// =========================================================
// LOAD COURSES
// =========================================================

async function loadCourses() {

    if (!coursesTableBody) {
        return;
    }

    try {

        coursesTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="loading-cell">
                    Loading courses...
                </td>
            </tr>
        `;

        const response =
            await fetch(
                `${API_URL}/courses`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load courses."
            );
        }

        const courses =
            await response.json();

        coursesTableBody.innerHTML = "";

        if (
            !courses ||
            courses.length === 0
        ) {

            coursesTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-cell">
                        No courses found.
                    </td>
                </tr>
            `;

            return;
        }


        courses.forEach(
            function (course) {

                const row =
                    document.createElement("tr");

                let departmentName =
                    "Not assigned";

                let departmentCode =
                    "";

                if (course.department) {

                    departmentName =
                        course.department.departmentName ||
                        "Not assigned";

                    departmentCode =
                        course.department.departmentCode ||
                        "";

                }

                row.innerHTML = `
                    <td>
                        ${course.courseId}
                    </td>

                    <td>
                        <strong>
                            ${escapeHtml(
                                course.courseName || ""
                            )}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(
                            course.courseCode || ""
                        )}
                    </td>

                    <td>
                        ${course.durationYears || ""}
                    </td>

                    <td>
                        ${escapeHtml(
                            departmentCode
                        )}
                        ${
                            departmentCode
                                ? " - "
                                : ""
                        }
                        ${escapeHtml(
                            departmentName
                        )}
                    </td>

                    <td>
                        <span class="status-badge">
                            Active
                        </span>
                    </td>
                `;

                coursesTableBody.appendChild(
                    row
                );

            }
        );

    } catch (error) {

        console.error(
            "Error loading courses:",
            error
        );

        coursesTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="error-cell">
                    Unable to load courses.
                </td>
            </tr>
        `;

    }
}


// =========================================================
// ADD COURSE
// =========================================================

if (courseForm) {

    courseForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                courseName.value.trim();

            const code =
                courseCode.value.trim();

            const duration =
                parseInt(
                    durationYears.value
                );

            const departmentId =
                departmentSelect.value;


            if (!name) {

                alert(
                    "Please enter course name."
                );

                courseName.focus();

                return;
            }


            if (!code) {

                alert(
                    "Please enter course code."
                );

                courseCode.focus();

                return;
            }


            if (
                !duration ||
                duration <= 0
            ) {

                alert(
                    "Please enter a valid duration."
                );

                durationYears.focus();

                return;
            }


            if (!departmentId) {

                alert(
                    "Please select a department."
                );

                departmentSelect.focus();

                return;
            }


            const courseData = {

                courseName: name,

                courseCode: code,

                durationYears: duration,

                departmentId:
                    parseInt(
                        departmentId
                    )

            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/courses`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    courseData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to add course."
                    );

                }


                alert(
                    "Course added successfully."
                );

                courseForm.reset();

                await loadDepartments();

                await loadCourses();


            } catch (error) {

                console.error(
                    "Error adding course:",
                    error
                );

                alert(
                    "Unable to add course.\n\n" +
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
// REFRESH COURSES
// =========================================================

if (refreshCoursesBtn) {

    refreshCoursesBtn.addEventListener(
        "click",
        function () {

            loadCourses();

        }
    );

}


// =========================================================
// LOAD PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadDepartments();

        await loadCourses();

    }
);

