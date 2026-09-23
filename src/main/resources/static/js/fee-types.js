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

const adminName = document.getElementById("adminName");
const adminRole = document.getElementById("adminRole");

const feeTypeForm = document.getElementById("feeTypeForm");
const feeName = document.getElementById("feeName");
const feeDescription = document.getElementById("feeDescription");

const feeTypesTableBody =
    document.getElementById("feeTypesTableBody");

const feeTypeMessage =
    document.getElementById("feeTypeMessage");

const refreshFeeTypesBtn =
    document.getElementById("refreshFeeTypesBtn");

// =========================================================
// EDIT MODAL ELEMENTS
// =========================================================

const editFeeTypeModal =
    document.getElementById("editFeeTypeModal");

const editFeeTypeClose =
    document.getElementById("editFeeTypeClose");

const editFeeTypeCancel =
    document.getElementById("editFeeTypeCancel");

const editFeeTypeForm =
    document.getElementById("editFeeTypeForm");

const editFeeTypeId =
    document.getElementById("editFeeTypeId");

const editFeeName =
    document.getElementById("editFeeName");

const editFeeDescription =
    document.getElementById("editFeeDescription");

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

    if (!feeTypeMessage) {
        return;
    }

    feeTypeMessage.textContent = message;

    feeTypeMessage.className =
        "fee-type-message " + type;

    setTimeout(() => {

        feeTypeMessage.textContent = "";

        feeTypeMessage.className =
            "fee-type-message";

    }, 4000);
}

// =========================================================
// LOAD FEE TYPES
// =========================================================

async function loadFeeTypes() {

    try {

        feeTypesTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="loading-cell">
                    Loading fee types...
                </td>
            </tr>
        `;

        const response =
            await fetch(`${API_URL}/fee-types`);

        if (!response.ok) {
            throw new Error("Unable to load fee types.");
        }

        const feeTypes =
            await response.json();

        feeTypesTableBody.innerHTML = "";

        if (!feeTypes || feeTypes.length === 0) {

            feeTypesTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-cell">
                        No fee types found.
                    </td>
                </tr>
            `;

            return;
        }

        feeTypes.forEach(feeType => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${feeType.feeTypeId}
                </td>

                <td>
                    <strong>
                        ${escapeHtml(feeType.feeName)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(
                        feeType.description ||
                        "No description"
                    )}
                </td>

                <td>
                    <div class="fee-type-actions">

                        <button
                            type="button"
                            class="fee-edit-btn"
                            onclick="openEditFeeType(
                                ${feeType.feeTypeId},
                                '${escapeJs(feeType.feeName)}',
                                '${escapeJs(
                                    feeType.description || ""
                                )}'
                            )">
                            Edit
                        </button>

                        <button
                            type="button"
                            class="fee-delete-btn"
                            onclick="deleteFeeType(
                                ${feeType.feeTypeId}
                            )">
                            Delete
                        </button>

                    </div>
                </td>
            `;

            feeTypesTableBody.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Error loading fee types:",
            error
        );

        feeTypesTableBody.innerHTML = `
            <tr>
                <td colspan="4" class="error-cell">
                    Unable to load fee types.
                </td>
            </tr>
        `;
    }
}

// =========================================================
// ADD FEE TYPE
// =========================================================

if (feeTypeForm) {

    feeTypeForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                feeName.value.trim();

            const description =
                feeDescription.value.trim();

            if (!name) {

                showMessage(
                    "Please enter a fee name.",
                    "error"
                );

                feeName.focus();

                return;
            }

            const feeTypeData = {

                feeName: name,

                description:
                    description || null
            };

            try {

                const response =
                    await fetch(
                        `${API_URL}/fee-types`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    feeTypeData
                                )
                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to add fee type."
                    );
                }

                showMessage(
                    "Fee type added successfully.",
                    "success"
                );

                feeTypeForm.reset();

                await loadFeeTypes();

            } catch (error) {

                console.error(
                    "Error adding fee type:",
                    error
                );

                showMessage(
                    "Unable to add fee type.",
                    "error"
                );
            }
        }
    );
}

// =========================================================
// OPEN EDIT MODAL
// =========================================================

function openEditFeeType(
    id,
    name,
    description
) {

    if (!editFeeTypeModal) {
        return;
    }

    editFeeTypeId.value = id;
    editFeeName.value = name;
    editFeeDescription.value = description;

    editFeeTypeModal.classList.add("show");

    editFeeName.focus();
}

// =========================================================
// CLOSE EDIT MODAL
// =========================================================

function closeEditFeeType() {

    if (editFeeTypeModal) {

        editFeeTypeModal.classList.remove(
            "show"
        );
    }
}

if (editFeeTypeClose) {

    editFeeTypeClose.addEventListener(
        "click",
        closeEditFeeType
    );
}

if (editFeeTypeCancel) {

    editFeeTypeCancel.addEventListener(
        "click",
        closeEditFeeType
    );
}

// =========================================================
// UPDATE FEE TYPE
// =========================================================

if (editFeeTypeForm) {

    editFeeTypeForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const id =
                editFeeTypeId.value;

            const name =
                editFeeName.value.trim();

            const description =
                editFeeDescription.value.trim();

            if (!name) {

                alert(
                    "Fee name cannot be empty."
                );

                editFeeName.focus();

                return;
            }

            const updatedFeeType = {

                feeName: name,

                description:
                    description || null
            };

            try {

                const response =
                    await fetch(
                        `${API_URL}/fee-types/${id}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    updatedFeeType
                                )
                        }
                    );

                if (!response.ok) {

                    const errorText =
                        await response.text();

                    throw new Error(
                        errorText ||
                        "Unable to update fee type."
                    );
                }

                closeEditFeeType();

                showMessage(
                    "Fee type updated successfully.",
                    "success"
                );

                await loadFeeTypes();

            } catch (error) {

                console.error(
                    "Error updating fee type:",
                    error
                );

                showMessage(
                    "Unable to update fee type.",
                    "error"
                );
            }
        }
    );
}

// =========================================================
// DELETE FEE TYPE
// =========================================================

async function deleteFeeType(id) {

    const confirmed =
        window.confirm(
            "Are you sure you want to delete this fee type?"
        );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/fee-types/${id}`,
                {
                    method: "DELETE"
                }
            );

        const responseText =
            await response.text();

        if (!response.ok) {

            let errorMessage =
                "Unable to delete fee type.";

            try {

                const errorData =
                    JSON.parse(responseText);

                if (errorData.message) {

                    errorMessage =
                        errorData.message;

                } else if (errorData.error) {

                    errorMessage =
                        errorData.error;
                }

            } catch (e) {

                if (responseText) {
                    errorMessage =
                        responseText;
                }
            }

            throw new Error(
                errorMessage
            );
        }

        showMessage(
            "Fee type deleted successfully.",
            "success"
        );

        await loadFeeTypes();

    } catch (error) {

        console.error(
            "Error deleting fee type:",
            error
        );

        showMessage(
            "Cannot delete this fee type because it may already be used by a fee structure or payment.",
            "error"
        );
    }
}

// =========================================================
// REFRESH
// =========================================================

if (refreshFeeTypesBtn) {

    refreshFeeTypesBtn.addEventListener(
        "click",
        loadFeeTypes
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
// ESCAPE JAVASCRIPT STRINGS
// =========================================================

function escapeJs(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");
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
// CLOSE SIDEBAR WHEN CLICKING OUTSIDE
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

// Students - not created yet
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

// Academic Years - not created yet
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
// CLOSE EDIT MODAL WITH ESC
// =========================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape" &&
            editFeeTypeModal &&
            editFeeTypeModal.classList.contains("show")
        ) {

            closeEditFeeType();
        }
    }
);

// =========================================================
// CLOSE MODAL BY CLICKING OUTSIDE
// =========================================================

if (editFeeTypeModal) {

    editFeeTypeModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                editFeeTypeModal
            ) {

                closeEditFeeType();
            }
        }
    );
}

// =========================================================
// LOAD PAGE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadFeeTypes();
    }
);

