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

const courseMessage =
    document.getElementById("courseMessage");

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
// SHOW MESSAGE
// =========================================================

function showMessage(message, type) {

    if (!courseMessage) {
        return;
    }

    courseMessage.textContent =
        message;

    courseMessage.className =
        "fee-type-message " + type;

    setTimeout(() => {

        courseMessage.textContent =
            "";

        courseMessage.className =
            "fee-type-message";

    }, 5000);
}


// =========================================================
// LOAD DEPARTMENTS
// =========================================================

async function loadDepartments() {

    try {

        departmentSelect.innerHTML = `
            <option value="">
                Loading departments...
            </option>
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


        departmentSelect.innerHTML = `
            <option value="">
                Select Department
            </option>
        `;


        if (
            !departments ||
            departments.length === 0
        ) {

            departmentSelect.innerHTML = `
                <option value="">
                    No departments available
                </option>
            `;

            return;
        }


        departments.forEach(department => {

            const option =
                document.createElement("option");


            option.value =
                department.departmentId;


            option.textContent =
                `${department.departmentName} (${department.departmentCode})`;


            departmentSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Department loading error:",
            error
        );


        departmentSelect.innerHTML = `
            <option value="">
                Unable to load departments
            </option>
        `;
    }
}


// =========================================================
// LOAD COURSES
// =========================================================

async function loadCourses() {

    try {

        coursesTableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="loading-cell">

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


        coursesTableBody.innerHTML =
            "";


        if (
            !courses ||
            courses.length === 0
        ) {

            coursesTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="empty-cell">

                        No courses found.

                    </td>
                </tr>
            `;

            return;
        }


        courses.forEach(course => {

            const row =
                document.createElement("tr");


            let departmentName =
                "Not assigned";


            if (
                course.department
            ) {

                departmentName =
                    `${course.department.departmentName}
                    (${course.department.departmentCode})`;

            }


            row.innerHTML = `

                <td>
                    ${course.courseId}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(
                            course.courseName
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        course.courseCode
                    )}
                </td>

                <td>
                    ${course.durationYears}
                    Years
                </td>

                <td>
                    ${escapeHtml(
                        departmentName
                    )}
                </td>

            `;


            coursesTableBody.appendChild(
                row
            );

        });

    }
    catch (error) {

        console.error(
            "Course loading error:",
            error
        );


        coursesTableBody.innerHTML = `
            <tr>

                <td
                    colspan="5"
                    class="error-cell">

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
                courseCode.value
                    .trim()
                    .toUpperCase();


            const duration =
                Number(
                    durationYears.value
                );


            const departmentId =
                Number(
                    departmentSelect.value
                );


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (!name) {

                showMessage(
                    "Please enter course name.",
                    "error"
                );

                courseName.focus();

                return;
            }


            if (!code) {

                showMessage(
                    "Please enter course code.",
                    "error"
                );

                courseCode.focus();

                return;
            }


            if (
                !duration ||
                duration <= 0
            ) {

                showMessage(
                    "Please enter a valid duration.",
                    "error"
                );

                durationYears.focus();

                return;
            }


            if (!departmentId) {

                showMessage(
                    "Please select a department.",
                    "error"
                );

                departmentSelect.focus();

                return;
            }


            // -----------------------------------------
            // REQUEST DATA
            // -----------------------------------------

            const courseData = {

                courseName:
                    name,

                courseCode:
                    code,

                durationYears:
                    duration,

                departmentId:
                    departmentId

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


                showMessage(
                    "Course added successfully.",
                    "success"
                );


                courseForm.reset();


                durationYears.value =
                    "4";


                await loadCourses();

            }
            catch (error) {

                console.error(
                    "Add course error:",
                    error
                );


                showMessage(
                    "Unable to add course. The course code may already exist.",
                    "error"
                );

            }

        }
    );
}


// =========================================================
// REFRESH BUTTON
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


if (
    menuBtn &&
    sidebar
) {

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

        if (
            !sidebar ||
            !menuBtn
        ) {

            return;

        }


        const clickedInsideSidebar =
            sidebar.contains(
                event.target
            );


        const clickedMenuButton =
            menuBtn.contains(
                event.target
            );


        if (
            sidebar.classList.contains(
                "active"
            ) &&
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

const studentsLink =
    document.getElementById(
        "studentsLink"
    );

const academicYearsLink =
    document.getElementById(
        "academicYearsLink"
    );

const paymentsLink =
    document.getElementById(
        "paymentsLink"
    );


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
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            localStorage.removeItem(
                "userId"
            );

            localStorage.removeItem(
                "username"
            );

            localStorage.removeItem(
                "role"
            );

            localStorage.removeItem(
                "email"
            );


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
    async function () {

        try {

            await loadDepartments();

            await loadCourses();

        }
        catch (error) {

            console.error(
                "Course page initialization error:",
                error
            );

            showMessage(
                "Unable to load course data.",
                "error"
            );

        }

    }
);