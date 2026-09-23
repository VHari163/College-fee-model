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

const adminName =
    document.getElementById("adminName");

const adminRole =
    document.getElementById("adminRole");

if (adminName) {
    adminName.textContent = username || "Admin";
}

if (adminRole) {
    adminRole.textContent = "Administrator";
}

// =========================================================
// ELEMENTS
// =========================================================

const feeStructureForm =
    document.getElementById("feeStructureForm");

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

const feeStructuresTableBody =
    document.getElementById("feeStructuresTableBody");

const refreshFeeStructuresBtn =
    document.getElementById(
        "refreshFeeStructuresBtn"
    );

// =========================================================
// EDIT MODAL
// =========================================================

const editFeeStructureModal =
    document.getElementById(
        "editFeeStructureModal"
    );

const editFeeStructureClose =
    document.getElementById(
        "editFeeStructureClose"
    );

const editFeeStructureCancel =
    document.getElementById(
        "editFeeStructureCancel"
    );

const editFeeStructureForm =
    document.getElementById(
        "editFeeStructureForm"
    );

const editFeeStructureId =
    document.getElementById(
        "editFeeStructureId"
    );

const editCourseSelect =
    document.getElementById(
        "editCourseSelect"
    );

const editAcademicYearSelect =
    document.getElementById(
        "editAcademicYearSelect"
    );

const editFeeTypeSelect =
    document.getElementById(
        "editFeeTypeSelect"
    );

const editFeeAmount =
    document.getElementById(
        "editFeeAmount"
    );

const editDueDate =
    document.getElementById(
        "editDueDate"
    );

// =========================================================
// LOAD COURSES
// =========================================================

async function loadCourses() {

    const response =
        await fetch(`${API_URL}/courses`);

    if (!response.ok) {
        throw new Error(
            "Unable to load courses."
        );
    }

    return await response.json();
}

// =========================================================
// LOAD ACADEMIC YEARS
// =========================================================

async function loadAcademicYears() {

    const response =
        await fetch(`${API_URL}/academic-years`);

    if (!response.ok) {
        throw new Error(
            "Unable to load academic years."
        );
    }

    return await response.json();
}

// =========================================================
// LOAD FEE TYPES
// =========================================================

async function loadFeeTypes() {

    const response =
        await fetch(`${API_URL}/fee-types`);

    if (!response.ok) {
        throw new Error(
            "Unable to load fee types."
        );
    }

    return await response.json();
}

// =========================================================
// FILL COURSE SELECT
// =========================================================

function fillCourseSelect(
    selectElement,
    courses
) {

    if (!selectElement) {
        return;
    }

    selectElement.innerHTML = `
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
            course.courseName;

        selectElement.appendChild(option);
    });
}

// =========================================================
// FILL ACADEMIC YEAR SELECT
// =========================================================

function fillAcademicYearSelect(
    selectElement,
    academicYears
) {

    if (!selectElement) {
        return;
    }

    selectElement.innerHTML = `
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

        selectElement.appendChild(option);
    });
}

// =========================================================
// FILL FEE TYPE SELECT
// =========================================================

function fillFeeTypeSelect(
    selectElement,
    feeTypes
) {

    if (!selectElement) {
        return;
    }

    selectElement.innerHTML = `
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

        selectElement.appendChild(option);
    });
}

// =========================================================
// LOAD ALL MASTER DATA
// =========================================================

async function loadMasterData() {

    try {

        const [
            courses,
            academicYears,
            feeTypes
        ] = await Promise.all([
            loadCourses(),
            loadAcademicYears(),
            loadFeeTypes()
        ]);

        fillCourseSelect(
            courseSelect,
            courses
        );

        fillAcademicYearSelect(
            academicYearSelect,
            academicYears
        );

        fillFeeTypeSelect(
            feeTypeSelect,
            feeTypes
        );

        fillCourseSelect(
            editCourseSelect,
            courses
        );

        fillAcademicYearSelect(
            editAcademicYearSelect,
            academicYears
        );

        fillFeeTypeSelect(
            editFeeTypeSelect,
            feeTypes
        );

    } catch (error) {

        console.error(
            "Error loading master data:",
            error
        );

        alert(
            "Unable to load course, academic year or fee type data."
        );
    }
}

// =========================================================
// LOAD FEE STRUCTURES
// =========================================================

async function loadFeeStructures() {

    try {

        feeStructuresTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Loading fee structures...
                </td>
            </tr>
        `;

        const response =
            await fetch(
                `${API_URL}/fee-structures`
            );

        if (!response.ok) {
            throw new Error(
                "Unable to load fee structures."
            );
        }

        const structures =
            await response.json();

        feeStructuresTableBody.innerHTML = "";

        if (
            !structures ||
            structures.length === 0
        ) {

            feeStructuresTableBody.innerHTML = `
                <tr>
                    <td colspan="7">
                        No fee structures found.
                    </td>
                </tr>
            `;

            return;
        }

        structures.forEach(structure => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${structure.feeStructureId}
                </td>

                <td>
                    ${escapeHtml(
                        structure.course?.courseName ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        structure.academicYear?.academicYear ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ${escapeHtml(
                        structure.feeType?.feeName ||
                        "Unknown"
                    )}
                </td>

                <td>
                    ₹${Number(
                        structure.amount
                    ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2
                    })}
                </td>

                <td>
                    ${
                        structure.dueDate ||
                        "-"
                    }
                </td>

                <td>

                    <div class="fee-structure-actions">

                        <button
                            type="button"
                            class="fee-edit-btn"
                            onclick="openEditFeeStructure(
                                ${structure.feeStructureId}
                            )">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="fee-delete-btn"
                            onclick="deleteFeeStructure(
                                ${structure.feeStructureId}
                            )">
                            Delete
                        </button>

                    </div>

                </td>
            `;

            feeStructuresTableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Error loading fee structures:",
            error
        );

        feeStructuresTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load fee structures.
                </td>
            </tr>
        `;
    }
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
                courseSelect.value;

            const academicYearId =
                academicYearSelect.value;

            const feeTypeId =
                feeTypeSelect.value;

            const amount =
                parseFloat(
                    feeAmount.value
                );

            const date =
                dueDate.value;

            if (!courseId) {

                alert(
                    "Please select a course."
                );

                return;
            }

            if (!academicYearId) {

                alert(
                    "Please select an academic year."
                );

                return;
            }

            if (!feeTypeId) {

                alert(
                    "Please select a fee type."
                );

                return;
            }

            if (
                isNaN(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid amount."
                );

                return;
            }

            const feeStructureData = {

                courseId:
                    parseInt(courseId),

                academicYearId:
                    parseInt(academicYearId),

                feeTypeId:
                    parseInt(feeTypeId),

                amount:
                    amount,

                dueDate:
                    date || null
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

                alert(
                    "Fee structure added successfully."
                );

                feeStructureForm.reset();

                await loadFeeStructures();

            } catch (error) {

                console.error(
                    "Error adding fee structure:",
                    error
                );

                alert(
                    "Unable to add fee structure."
                );
            }
        }
    );
}

// =========================================================
// OPEN EDIT MODAL
// =========================================================

async function openEditFeeStructure(id) {

    try {

        const response =
            await fetch(
                `${API_URL}/fee-structures/${id}`
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load fee structure."
            );
        }

        const structure =
            await response.json();

        editFeeStructureId.value =
            structure.feeStructureId;

        editCourseSelect.value =
            structure.course?.courseId || "";

        editAcademicYearSelect.value =
            structure.academicYear?.academicYearId || "";

        editFeeTypeSelect.value =
            structure.feeType?.feeTypeId || "";

        editFeeAmount.value =
            structure.amount || "";

        editDueDate.value =
            structure.dueDate || "";

        editFeeStructureModal.classList.add(
            "show"
        );

    } catch (error) {

        console.error(
            "Error opening fee structure:",
            error
        );

        alert(
            "Unable to load fee structure."
        );
    }
}

// =========================================================
// CLOSE EDIT MODAL
// =========================================================

function closeEditFeeStructure() {

    if (editFeeStructureModal) {

        editFeeStructureModal.classList.remove(
            "show"
        );
    }
}

if (editFeeStructureClose) {

    editFeeStructureClose.addEventListener(
        "click",
        closeEditFeeStructure
    );
}

if (editFeeStructureCancel) {

    editFeeStructureCancel.addEventListener(
        "click",
        closeEditFeeStructure
    );
}

// =========================================================
// UPDATE FEE STRUCTURE
// =========================================================

if (editFeeStructureForm) {

    editFeeStructureForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const id =
                editFeeStructureId.value;

            const data = {

                courseId:
                    parseInt(
                        editCourseSelect.value
                    ),

                academicYearId:
                    parseInt(
                        editAcademicYearSelect.value
                    ),

                feeTypeId:
                    parseInt(
                        editFeeTypeSelect.value
                    ),

                amount:
                    parseFloat(
                        editFeeAmount.value
                    ),

                dueDate:
                    editDueDate.value || null
            };

            try {

                const response =
                    await fetch(
                        `${API_URL}/fee-structures/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to update fee structure."
                    );
                }

                closeEditFeeStructure();

                alert(
                    "Fee structure updated successfully."
                );

                await loadFeeStructures();

            } catch (error) {

                console.error(
                    "Error updating fee structure:",
                    error
                );

                alert(
                    "Unable to update fee structure."
                );
            }
        }
    );
}

// =========================================================
// DELETE FEE STRUCTURE
// =========================================================

async function deleteFeeStructure(id) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this fee structure?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/fee-structures/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Unable to delete fee structure."
            );
        }

        alert(
            "Fee structure deleted successfully."
        );

        await loadFeeStructures();

    } catch (error) {

        console.error(
            "Error deleting fee structure:",
            error
        );

        alert(
            "Unable to delete fee structure. It may already be used by a payment."
        );
    }
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

            sidebar.classList.toggle("active");

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

            sidebar.classList.remove("active");

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
                "Student Management will be added next."
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

            window.location.href =
                "payments.html";
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
// CLOSE MODAL WITH ESC
// =========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            editFeeStructureModal &&
            editFeeStructureModal.classList.contains("show")
        ) {

            closeEditFeeStructure();
        }
    }
);

// =========================================================
// CLOSE MODAL BY CLICKING OUTSIDE
// =========================================================

if (editFeeStructureModal) {

    editFeeStructureModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                editFeeStructureModal
            ) {

                closeEditFeeStructure();
            }
        }
    );
}

// =========================================================
// LOAD PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        await loadMasterData();

        await loadFeeStructures();
    }
);

