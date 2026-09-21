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

const courseSelect =
    document.getElementById("courseSelect");

const academicYearSelect =
    document.getElementById("academicYearSelect");

const feeTypeSelect =
    document.getElementById("feeTypeSelect");

const feeAmount =
    document.getElementById("feeAmount");

const dueDate =
    document.getElementById("dueDate");

const feeStructureForm =
    document.getElementById("feeStructureForm");

const feeStructureMessage =
    document.getElementById("feeStructureMessage");

const feeStructuresTableBody =
    document.getElementById("feeStructuresTableBody");

const refreshStructuresBtn =
    document.getElementById("refreshStructuresBtn");


// =========================================================
// ADMIN INFORMATION
// =========================================================

if (adminName) {
    adminName.textContent = username || "Admin";
}

if (adminRole) {
    adminRole.textContent = "Administrator";
}


// =========================================================
// SHOW MESSAGE
// =========================================================

function showMessage(message, type) {

    if (!feeStructureMessage) {
        return;
    }

    feeStructureMessage.textContent =
        message;

    feeStructureMessage.className =
        "fee-type-message " + type;

    setTimeout(() => {

        feeStructureMessage.textContent =
            "";

        feeStructureMessage.className =
            "fee-type-message";

    }, 5000);
}


// =========================================================
// LOAD COURSES
// =========================================================

async function loadCourses() {

    try {

        const response =
            await fetch(`${API_URL}/courses`);

        if (!response.ok) {
            throw new Error(
                "Unable to load courses."
            );
        }

        const courses =
            await response.json();

        courseSelect.innerHTML = `
            <option value="">
                Select Course
            </option>
        `;


        courses.forEach(course => {

            const option =
                document.createElement("option");

            option.value =
                course.courseId;

            option.textContent =
                `${course.courseName} (${course.courseCode})`;

            courseSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Course loading error:",
            error
        );

        courseSelect.innerHTML = `
            <option value="">
                Unable to load courses
            </option>
        `;
    }
}


// =========================================================
// LOAD ACADEMIC YEARS
// =========================================================

async function loadAcademicYears() {

    try {

        const response =
            await fetch(
                `${API_URL}/academic-years`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load academic years."
            );
        }

        const academicYears =
            await response.json();

        academicYearSelect.innerHTML = `
            <option value="">
                Select Academic Year
            </option>
        `;


        academicYears.forEach(year => {

            const option =
                document.createElement("option");

            option.value =
                year.academicYearId;

            option.textContent =
                year.academicYear;

            academicYearSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Academic year loading error:",
            error
        );

        academicYearSelect.innerHTML = `
            <option value="">
                Unable to load academic years
            </option>
        `;
    }
}


// =========================================================
// LOAD FEE TYPES
// =========================================================

async function loadFeeTypes() {

    try {

        const response =
            await fetch(
                `${API_URL}/fee-types`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load fee types."
            );
        }

        const feeTypes =
            await response.json();

        feeTypeSelect.innerHTML = `
            <option value="">
                Select Fee Type
            </option>
        `;


        feeTypes.forEach(feeType => {

            const option =
                document.createElement("option");

            option.value =
                feeType.feeTypeId;

            option.textContent =
                feeType.feeName;

            feeTypeSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Fee type loading error:",
            error
        );

        feeTypeSelect.innerHTML = `
            <option value="">
                Unable to load fee types
            </option>
        `;
    }
}


// =========================================================
// LOAD FEE STRUCTURES
// =========================================================

async function loadFeeStructures() {

    const courseId =
        Number(courseSelect.value);


    if (!courseId) {

        feeStructuresTableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="loading-cell">

                    Select a course to view fee structures.

                </td>
            </tr>
        `;

        return;
    }


    try {

        feeStructuresTableBody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    class="loading-cell">

                    Loading fee structures...

                </td>
            </tr>
        `;


        const response =
            await fetch(
                `${API_URL}/fee-structures/course/${courseId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load fee structures."
            );
        }


        const feeStructures =
            await response.json();


        feeStructuresTableBody.innerHTML =
            "";


        if (
            !feeStructures ||
            feeStructures.length === 0
        ) {

            feeStructuresTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="5"
                        class="empty-cell">

                        No fee structures found
                        for this course.

                    </td>
                </tr>
            `;

            return;
        }


        feeStructures.forEach(
            fee => {

                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>
                        ${fee.feeStructureId}
                    </td>

                    <td>
                        ${
                            fee.academicYear
                                ? escapeHtml(
                                    fee.academicYear.academicYear
                                )
                                : "-"
                        }
                    </td>

                    <td>
                        ${
                            fee.feeType
                                ? escapeHtml(
                                    fee.feeType.feeName
                                )
                                : "-"
                        }
                    </td>

                    <td>
                        ₹${formatAmount(
                            fee.amount
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            fee.dueDate
                        )}
                    </td>

                `;


                feeStructuresTableBody.appendChild(
                    row
                );

            }
        );

    }
    catch (error) {

        console.error(
            "Fee structure loading error:",
            error
        );


        feeStructuresTableBody.innerHTML = `
            <tr>

                <td
                    colspan="5"
                    class="error-cell">

                    Unable to load fee structures.

                </td>

            </tr>
        `;
    }
}


// =========================================================
// COURSE CHANGE
// =========================================================

if (courseSelect) {

    courseSelect.addEventListener(
        "change",
        function () {

            loadFeeStructures();

        }
    );
}


// =========================================================
// ADD FEE STRUCTURE
// =========================================================

if (feeStructureForm) {

    feeStructureForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const courseId =
                Number(
                    courseSelect.value
                );

            const academicYearId =
                Number(
                    academicYearSelect.value
                );

            const feeTypeId =
                Number(
                    feeTypeSelect.value
                );

            const amount =
                Number(
                    feeAmount.value
                );

            const selectedDueDate =
                dueDate.value;


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (!courseId) {

                showMessage(
                    "Please select a course.",
                    "error"
                );

                return;
            }


            if (!academicYearId) {

                showMessage(
                    "Please select an academic year.",
                    "error"
                );

                return;
            }


            if (!feeTypeId) {

                showMessage(
                    "Please select a fee type.",
                    "error"
                );

                return;
            }


            if (!amount || amount <= 0) {

                showMessage(
                    "Please enter a valid amount.",
                    "error"
                );

                return;
            }


            // -----------------------------------------
            // REQUEST DATA
            // -----------------------------------------

            const feeStructureData = {

                courseId:
                    courseId,

                academicYearId:
                    academicYearId,

                feeTypeId:
                    feeTypeId,

                amount:
                    amount,

                dueDate:
                    selectedDueDate || null
            };


            try {

                const response =
                    await fetch(
                        `${API_URL}/fee-structures`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    feeStructureData
                                )
                        }
                    );


                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to add fee structure."
                    );
                }


                showMessage(
                    "Fee structure added successfully.",
                    "success"
                );


                // Reset only amount/date
                feeAmount.value = "";
                dueDate.value = "";


                // Refresh table
                await loadFeeStructures();

            }
            catch (error) {

                console.error(
                    "Add fee structure error:",
                    error
                );


                showMessage(
                    "Unable to add fee structure. It may already exist for this course, academic year and fee type.",
                    "error"
                );

            }

        }
    );
}


// =========================================================
// REFRESH
// =========================================================

if (refreshStructuresBtn) {

    refreshStructuresBtn.addEventListener(
        "click",
        function () {

            loadFeeStructures();

        }
    );
}


// =========================================================
// FORMAT AMOUNT
// =========================================================

function formatAmount(amount) {

    return Number(amount)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
}


// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(dateString) {

    if (!dateString) {
        return "Not specified";
    }

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
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
// SIDEBAR PLACEHOLDER LINKS
// =========================================================

const studentsLink =
    document.getElementById("studentsLink");

const departmentsLink =
    document.getElementById("departmentsLink");

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


if (departmentsLink) {

    departmentsLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "Department Management will be added next."
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
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadCourses();

        await loadAcademicYears();

        await loadFeeTypes();

        loadFeeStructures();

    }
);