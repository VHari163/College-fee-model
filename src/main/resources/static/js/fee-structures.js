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
// EDIT MODAL ELEMENTS
// =========================================================

const editModal =
    document.getElementById("editFeeStructureModal");

const editClose =
    document.getElementById("editFeeStructureClose");

const editCancel =
    document.getElementById("editFeeStructureCancel");

const editForm =
    document.getElementById("editFeeStructureForm");

const editId =
    document.getElementById("editFeeStructureId");

const editCourseSelect =
    document.getElementById("editCourseSelect");

const editAcademicYearSelect =
    document.getElementById("editAcademicYearSelect");

const editFeeTypeSelect =
    document.getElementById("editFeeTypeSelect");

const editFeeAmount =
    document.getElementById("editFeeAmount");

const editDueDate =
    document.getElementById("editDueDate");


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

    feeStructureMessage.textContent = message;

    feeStructureMessage.className =
        "fee-type-message " + type;

    setTimeout(() => {

        feeStructureMessage.textContent = "";

        feeStructureMessage.className =
            "fee-type-message";

    }, 5000);
}


// =========================================================
// LOAD COURSES
// =========================================================

async function loadCourses(
    targetSelect = courseSelect
) {

    if (!targetSelect) {
        return;
    }

    try {

        targetSelect.innerHTML = `
            <option value="">
                Loading courses...
            </option>
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


        targetSelect.innerHTML = `
            <option value="">
                Select Course
            </option>
        `;


        if (
            !courses ||
            courses.length === 0
        ) {

            targetSelect.innerHTML = `
                <option value="">
                    No courses available
                </option>
            `;

            return;
        }


        courses.forEach(course => {

            const option =
                document.createElement("option");

            option.value =
                course.courseId;

            option.textContent =
                `${course.courseName} (${course.courseCode})`;

            targetSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Course loading error:",
            error
        );


        targetSelect.innerHTML = `
            <option value="">
                Unable to load courses
            </option>
        `;
    }
}


// =========================================================
// LOAD ACADEMIC YEARS
// =========================================================

async function loadAcademicYears(
    targetSelect = academicYearSelect
) {

    if (!targetSelect) {
        return;
    }

    try {

        targetSelect.innerHTML = `
            <option value="">
                Loading academic years...
            </option>
        `;


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


        targetSelect.innerHTML = `
            <option value="">
                Select Academic Year
            </option>
        `;


        if (
            !academicYears ||
            academicYears.length === 0
        ) {

            targetSelect.innerHTML = `
                <option value="">
                    No academic years available
                </option>
            `;

            return;
        }


        academicYears.forEach(year => {

            const option =
                document.createElement("option");

            option.value =
                year.academicYearId;

            option.textContent =
                year.academicYear;

            targetSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Academic year loading error:",
            error
        );


        targetSelect.innerHTML = `
            <option value="">
                Unable to load academic years
            </option>
        `;
    }
}


// =========================================================
// LOAD FEE TYPES
// =========================================================

async function loadFeeTypes(
    targetSelect = feeTypeSelect
) {

    if (!targetSelect) {
        return;
    }

    try {

        targetSelect.innerHTML = `
            <option value="">
                Loading fee types...
            </option>
        `;


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


        targetSelect.innerHTML = `
            <option value="">
                Select Fee Type
            </option>
        `;


        if (
            !feeTypes ||
            feeTypes.length === 0
        ) {

            targetSelect.innerHTML = `
                <option value="">
                    No fee types available
                </option>
            `;

            return;
        }


        feeTypes.forEach(feeType => {

            const option =
                document.createElement("option");

            option.value =
                feeType.feeTypeId;

            option.textContent =
                feeType.feeName;

            targetSelect.appendChild(
                option
            );

        });

    }
    catch (error) {

        console.error(
            "Fee type loading error:",
            error
        );


        targetSelect.innerHTML = `
            <option value="">
                Unable to load fee types
            </option>
        `;
    }
}


// =========================================================
// LOAD ALL FEE STRUCTURES
// =========================================================

async function loadFeeStructures() {

    try {

        feeStructuresTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="loading-cell">
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


        const feeStructures =
            await response.json();


        feeStructuresTableBody.innerHTML = "";


        if (
            !feeStructures ||
            feeStructures.length === 0
        ) {

            feeStructuresTableBody.innerHTML = `
                <tr>
                    <td
                        colspan="7"
                        class="empty-cell">

                        No fee structures found.

                    </td>
                </tr>
            `;

            return;
        }


        feeStructures.forEach(fee => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${fee.feeStructureId}
                </td>


                <td>
                    ${
                        fee.course
                            ? escapeHtml(
                                fee.course.courseName
                            )
                            : "-"
                    }
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


                <td>

                    <div class="fee-structure-actions">

                        <button
                            type="button"
                            class="fee-structure-edit-btn"
                            onclick="openEditFeeStructure(
                                ${fee.feeStructureId}
                            )">

                            Edit

                        </button>


                        <button
                            type="button"
                            class="fee-structure-delete-btn"
                            onclick="deleteFeeStructure(
                                ${fee.feeStructureId}
                            )">

                            Delete

                        </button>

                    </div>

                </td>

            `;


            feeStructuresTableBody.appendChild(
                row
            );

        });

    }
    catch (error) {

        console.error(
            "Fee structure loading error:",
            error
        );


        feeStructuresTableBody.innerHTML = `
            <tr>

                <td
                    colspan="7"
                    class="error-cell">

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


            if (
                !amount ||
                amount <= 0
            ) {

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


                feeAmount.value = "";
                dueDate.value = "";


                await loadFeeStructures();

            }
            catch (error) {

                console.error(
                    "Add fee structure error:",
                    error
                );


                showMessage(
                    "Unable to add fee structure. This combination may already exist.",
                    "error"
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


        const fee =
            await response.json();


        // Load edit dropdowns

        await loadCourses(
            editCourseSelect
        );

        await loadAcademicYears(
            editAcademicYearSelect
        );

        await loadFeeTypes(
            editFeeTypeSelect
        );


        // Set current values

        editId.value =
            fee.feeStructureId;


        editCourseSelect.value =
            fee.course.courseId;


        editAcademicYearSelect.value =
            fee.academicYear.academicYearId;


        editFeeTypeSelect.value =
            fee.feeType.feeTypeId;


        editFeeAmount.value =
            fee.amount;


        editDueDate.value =
            fee.dueDate || "";


        // Show modal

        editModal.classList.add(
            "show"
        );

    }
    catch (error) {

        console.error(
            "Edit loading error:",
            error
        );


        showMessage(
            "Unable to load fee structure.",
            "error"
        );
    }
}


// =========================================================
// CLOSE EDIT MODAL
// =========================================================

function closeEditModal() {

    if (editModal) {

        editModal.classList.remove(
            "show"
        );
    }
}


if (editClose) {

    editClose.addEventListener(
        "click",
        closeEditModal
    );
}


if (editCancel) {

    editCancel.addEventListener(
        "click",
        closeEditModal
    );
}


// =========================================================
// UPDATE FEE STRUCTURE
// =========================================================

if (editForm) {

    editForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const id =
                Number(
                    editId.value
                );


            const updatedData = {

                courseId:
                    Number(
                        editCourseSelect.value
                    ),

                academicYearId:
                    Number(
                        editAcademicYearSelect.value
                    ),

                feeTypeId:
                    Number(
                        editFeeTypeSelect.value
                    ),

                amount:
                    Number(
                        editFeeAmount.value
                    ),

                dueDate:
                    editDueDate.value ||
                    null

            };


            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (
                !updatedData.courseId ||
                !updatedData.academicYearId ||
                !updatedData.feeTypeId
            ) {

                showMessage(
                    "Please complete all required fields.",
                    "error"
                );

                return;
            }


            if (
                !updatedData.amount ||
                updatedData.amount <= 0
            ) {

                showMessage(
                    "Amount must be greater than zero.",
                    "error"
                );

                return;
            }


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
                                JSON.stringify(
                                    updatedData
                                )
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


                closeEditModal();


                showMessage(
                    "Fee structure updated successfully.",
                    "success"
                );


                await loadFeeStructures();

            }
            catch (error) {

                console.error(
                    "Update error:",
                    error
                );


                showMessage(
                    "Unable to update fee structure. Check whether the same course, academic year and fee type combination already exists.",
                    "error"
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


        const responseText =
            await response.text();


        if (!response.ok) {

            let message =
                "Unable to delete fee structure.";


            try {

                const errorData =
                    JSON.parse(
                        responseText
                    );


                if (errorData.message) {

                    message =
                        errorData.message;
                }

            }
            catch (e) {

                if (responseText) {

                    message =
                        responseText;
                }
            }


            throw new Error(
                message
            );
        }


        showMessage(
            "Fee structure deleted successfully.",
            "success"
        );


        await loadFeeStructures();

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "This fee structure may already be referenced by a payment and cannot be deleted.",
            "error"
        );
    }
}


// =========================================================
// REFRESH BUTTON
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
// PLACEHOLDER LINKS
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
// MODAL EVENTS
// =========================================================

if (editModal) {

    editModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                editModal
            ) {

                closeEditModal();
            }

        }
    );
}


document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            editModal &&
            editModal.classList.contains("show")
        ) {

            closeEditModal();
        }

    }
);


// =========================================================
// PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        try {

            await loadCourses();

            await loadAcademicYears();

            await loadFeeTypes();

            await loadFeeStructures();

        }
        catch (error) {

            console.error(
                "Page initialization error:",
                error
            );


            showMessage(
                "Unable to load fee structure data.",
                "error"
            );
        }

    }
);