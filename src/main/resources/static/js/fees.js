const API_URL = "http://localhost:8081/api";

// =========================================================
// LOGIN
// =========================================================

const username = localStorage.getItem("username");

if (!username) {
    window.location.href = "index.html";
}


// =========================================================
// HTML ELEMENTS
// =========================================================

const studentName =
    document.getElementById("studentName");

const feeTypeSelect =
    document.getElementById("feeTypeSelect");

const feeDetails =
    document.getElementById("feeDetails");


// =========================================================
// PAYMENT NOTIFICATION ELEMENTS
// =========================================================

const paymentNotification =
    document.getElementById("paymentNotification");

const notificationIcon =
    document.getElementById("notificationIcon");

const notificationTitle =
    document.getElementById("notificationTitle");

const notificationMessage =
    document.getElementById("notificationMessage");

const notificationClose =
    document.getElementById("notificationClose");

let notificationTimer;


// =========================================================
// PAYMENT CONFIRMATION MODAL ELEMENTS
// =========================================================

const paymentConfirmModal =
    document.getElementById("paymentConfirmModal");

const paymentModalClose =
    document.getElementById("paymentModalClose");

const paymentCancelBtn =
    document.getElementById("paymentCancelBtn");

const paymentConfirmBtn =
    document.getElementById("paymentConfirmBtn");

const confirmFeeName =
    document.getElementById("confirmFeeName");

const confirmAmount =
    document.getElementById("confirmAmount");

const confirmRemaining =
    document.getElementById("confirmRemaining");


// =========================================================
// GLOBAL DATA
// =========================================================

let currentStudent = null;
let feeStructures = [];
let pendingPayment = null;


// =========================================================
// CHECK LOGIN
// =========================================================

if (!username) {
    window.location.href = "index.html";
} else {
    loadFees();
}


// =========================================================
// LOAD FEES
// =========================================================

async function loadFees() {

    try {

        showLoading();

        // -------------------------------------------------
        // 1. Get all students
        // -------------------------------------------------

        const studentsResponse =
            await fetch(`${API_URL}/students`);

        if (!studentsResponse.ok) {
            throw new Error(
                "Unable to load student details"
            );
        }

        const students =
            await studentsResponse.json();


        // -------------------------------------------------
        // 2. Find logged-in student
        // -------------------------------------------------

        const student =
            students.find(student =>
                student.rollNumber &&
                student.rollNumber.trim().toLowerCase() ===
                username.trim().toLowerCase()
            );

        if (!student) {

            showMessage(
                "Student Not Found",
                `No student record was found for ${username}.`
            );

            return;
        }


        currentStudent = student;


        if (studentName) {
            studentName.textContent =
                student.name;
        }


        // -------------------------------------------------
        // 3. Get courses
        // -------------------------------------------------

        const coursesResponse =
            await fetch(`${API_URL}/courses`);

        if (!coursesResponse.ok) {
            throw new Error(
                "Unable to load courses"
            );
        }

        const courses =
            await coursesResponse.json();


        // -------------------------------------------------
        // 4. Find student's course
        // -------------------------------------------------

        const studentCourseName =
            (student.course || "")
                .trim()
                .toLowerCase();


        const studentCourse =
            courses.find(course =>
                (course.courseName || "")
                    .trim()
                    .toLowerCase() ===
                studentCourseName
            );


        if (!studentCourse) {

            showMessage(
                "Course Not Found",
                `Your course "${student.course}" is not configured in the system.`
            );

            return;
        }


        // -------------------------------------------------
        // 5. Get fee structures
        // -------------------------------------------------

        const feesResponse =
            await fetch(
                `${API_URL}/fee-structures/course/${studentCourse.courseId}`
            );


        if (!feesResponse.ok) {
            throw new Error(
                "Unable to load fee structures"
            );
        }


        let allFeeStructures =
            await feesResponse.json();


        // -------------------------------------------------
        // 6. Filter conditional fees
        // -------------------------------------------------

        feeStructures =
            allFeeStructures.filter(fee => {

                if (
                    !fee ||
                    !fee.feeType
                ) {
                    return false;
                }


                const feeName =
                    (
                        fee.feeType.feeName ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                // -----------------------------------------
                // HOSTEL FEE
                // -----------------------------------------

                if (
                    feeName === "hostel fee"
                ) {

                    return (
                        student.hostelStatus &&
                        student.hostelStatus
                            .trim()
                            .toUpperCase() ===
                        "HOSTELLER"
                    );
                }


                // -----------------------------------------
                // BUS FEE
                // -----------------------------------------

                if (
                    feeName === "bus fee"
                ) {

                    return (
                        student.transportStatus &&
                        student.transportStatus
                            .trim()
                            .toUpperCase() ===
                        "YES"
                    );
                }


                // -----------------------------------------
                // TRANSPORT FEE
                // -----------------------------------------

                if (
                    feeName === "transport fee"
                ) {

                    return (
                        student.transportStatus &&
                        student.transportStatus
                            .trim()
                            .toUpperCase() ===
                        "YES"
                    );
                }


                // -----------------------------------------
                // NORMAL FEES
                // -----------------------------------------

                return true;

            });


        // -------------------------------------------------
        // 7. Check fees
        // -------------------------------------------------

        if (
            !feeStructures ||
            feeStructures.length === 0
        ) {

            showMessage(
                "No Fees Available",
                "No applicable fee structures have been configured for your course."
            );

            return;
        }


        // -------------------------------------------------
        // 8. Remove duplicate fee types
        // -------------------------------------------------

        const uniqueFees =
            new Map();


        feeStructures.forEach(fee => {

            if (
                fee &&
                fee.feeType &&
                fee.feeType.feeTypeId
            ) {

                const feeTypeId =
                    fee.feeType.feeTypeId;


                if (
                    !uniqueFees.has(feeTypeId)
                ) {

                    uniqueFees.set(
                        feeTypeId,
                        fee
                    );
                }
            }

        });


        feeStructures =
            Array.from(
                uniqueFees.values()
            );


        // -------------------------------------------------
        // 9. Populate dropdown
        // -------------------------------------------------

        populateFeeTypes();


        // -------------------------------------------------
        // 10. Select first fee
        // -------------------------------------------------

        if (
            feeStructures.length > 0
        ) {

            feeTypeSelect.value =
                feeStructures[0]
                    .feeStructureId;


            await displaySelectedFee(
                feeStructures[0]
            );
        }

    }
    catch (error) {

        console.error(
            "Fee loading error:",
            error
        );


        showMessage(
            "Unable to Load Fees",
            error.message
        );

    }
}


// =========================================================
// POPULATE FEE TYPE DROPDOWN
// =========================================================

function populateFeeTypes() {

    if (!feeTypeSelect) {
        return;
    }

    feeTypeSelect.innerHTML = "";


    // Default option

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        "Select Fee Type";

    defaultOption.disabled = true;
    defaultOption.selected = true;

    feeTypeSelect.appendChild(
        defaultOption
    );


    // Add fee types

    feeStructures.forEach(fee => {

        if (
            !fee ||
            !fee.feeType
        ) {
            return;
        }

        const option =
            document.createElement("option");

        option.value =
            fee.feeStructureId;

        option.textContent =
            fee.feeType.feeName;

        feeTypeSelect.appendChild(
            option
        );
    });
}


// =========================================================
// FEE TYPE CHANGE
// =========================================================

if (feeTypeSelect) {

    feeTypeSelect.addEventListener(
        "change",
        async function () {

            const selectedId =
                Number(this.value);

            const selectedFee =
                feeStructures.find(
                    fee =>
                        fee.feeStructureId ===
                        selectedId
                );

            if (!selectedFee) {

                feeDetails.innerHTML = "";

                return;
            }

            await displaySelectedFee(
                selectedFee
            );
        }
    );
}


// =========================================================
// DISPLAY SELECTED FEE
// =========================================================

async function displaySelectedFee(fee) {

    try {

        feeDetails.innerHTML = `
            <div class="fee-loading">
                Loading ${fee.feeType.feeName} details...
            </div>
        `;


        // -------------------------------------------------
        // Get remaining amount
        // -------------------------------------------------

        const remainingResponse =
            await fetch(
                `${API_URL}/payments/remaining` +
                `?studentId=${currentStudent.studentId}` +
                `&academicYearId=${fee.academicYear.academicYearId}` +
                `&feeTypeId=${fee.feeType.feeTypeId}`
            );

        if (!remainingResponse.ok) {
            throw new Error(
                "Unable to get remaining amount"
            );
        }

        const remainingAmount =
            Number(
                await remainingResponse.json()
            );


        // -------------------------------------------------
        // Total amount
        // -------------------------------------------------

        const totalAmount =
            Number(fee.amount);


        // -------------------------------------------------
        // Paid amount
        // -------------------------------------------------

        const paidAmount =
            Math.max(
                0,
                totalAmount - remainingAmount
            );


        // -------------------------------------------------
        // Status
        // -------------------------------------------------

        let status = "PENDING";
        let statusClass = "pending";

        if (remainingAmount <= 0) {

            status = "PAID";
            statusClass = "paid";

        }
        else if (paidAmount > 0) {

            status = "PARTIALLY PAID";
            statusClass = "partial";
        }


        // -------------------------------------------------
        // Display fee details
        // -------------------------------------------------

        feeDetails.innerHTML = `

            <div class="selected-fee-header">

                <div>

                    <p class="fee-label">
                        Selected Fee
                    </p>

                    <h2>
                        ${escapeHtml(
                            fee.feeType.feeName
                        )}
                    </h2>

                </div>

                <span class="fee-status ${statusClass}">
                    ${status}
                </span>

            </div>


            <div class="fee-information">

                <div class="fee-info-item">

                    <span>
                        Academic Year
                    </span>

                    <strong>
                        ${escapeHtml(
                            fee.academicYear.academicYear
                        )}
                    </strong>

                </div>


                <div class="fee-info-item">

                    <span>
                        Due Date
                    </span>

                    <strong>
                        ${formatDate(fee.dueDate)}
                    </strong>

                </div>

            </div>


            <div class="fee-summary">

                <div class="summary-item">

                    <span>
                        Total Fee
                    </span>

                    <strong>
                        ₹${formatAmount(totalAmount)}
                    </strong>

                </div>


                <div class="summary-item">

                    <span>
                        Paid Amount
                    </span>

                    <strong>
                        ₹${formatAmount(paidAmount)}
                    </strong>

                </div>


                <div class="summary-item remaining">

                    <span>
                        Remaining
                    </span>

                    <strong>
                        ₹${formatAmount(remainingAmount)}
                    </strong>

                </div>

            </div>


            ${
                remainingAmount > 0

                ?

                `
                <div class="payment-area">

                    <label for="paymentAmount">
                        Amount to Pay
                    </label>

                    <input
                        type="number"
                        id="paymentAmount"
                        min="1"
                        max="${remainingAmount}"
                        step="0.01"
                        placeholder="Enter amount"
                    >

                    <small>
                        Maximum amount:
                        ₹${formatAmount(remainingAmount)}
                    </small>

                    <button
                        class="pay-btn"
                        id="payButton"
                        type="button"
                    >
                        Pay Now
                    </button>

                </div>
                `

                :

                `
                <div class="fully-paid-message">
                    ✓ This fee has been fully paid.
                </div>
                `
            }

        `;


        // -------------------------------------------------
        // Pay button
        // -------------------------------------------------

        const payButton =
            document.getElementById("payButton");

        if (payButton) {

            payButton.addEventListener(
                "click",
                () => {

                    makePayment(
                        fee,
                        remainingAmount
                    );

                }
            );
        }

    }
    catch (error) {

        console.error(
            "Fee detail error:",
            error
        );

        feeDetails.innerHTML = `
            <div class="error-message">

                <h3>
                    Unable to Load Fee
                </h3>

                <p>
                    ${escapeHtml(error.message)}
                </p>

            </div>
        `;
    }
}


// =========================================================
// MAKE PAYMENT
// =========================================================

async function makePayment(
    fee,
    remainingAmount
) {

    const paymentAmountInput =
        document.getElementById(
            "paymentAmount"
        );

    if (!paymentAmountInput) {
        return;
    }


    // -------------------------------------------------
    // Get entered amount
    // -------------------------------------------------

    const amount =
        Number(
            paymentAmountInput.value
        );


    // -------------------------------------------------
    // Validate amount
    // -------------------------------------------------

    if (!amount || amount <= 0) {

        showNotification(
            "error",
            "Invalid Amount",
            "Please enter a valid payment amount."
        );

        paymentAmountInput.focus();

        return;
    }


    // -------------------------------------------------
    // Prevent overpayment
    // -------------------------------------------------

    if (amount > remainingAmount) {

        showNotification(
            "error",
            "Invalid Amount",
            `You cannot pay more than ₹${formatAmount(
                remainingAmount
            )}.`
        );

        paymentAmountInput.focus();

        return;
    }


    // -------------------------------------------------
    // Open confirmation modal
    // -------------------------------------------------

    openPaymentConfirmation(
        fee,
        amount,
        remainingAmount
    );
}


// =========================================================
// OPEN PAYMENT CONFIRMATION MODAL
// =========================================================

function openPaymentConfirmation(
    fee,
    amount,
    remainingAmount
) {

    if (!paymentConfirmModal) {

        processPayment(
            fee,
            amount
        );

        return;
    }


    pendingPayment = {
        fee: fee,
        amount: amount,
        remainingAmount: remainingAmount
    };


    // -------------------------------------------------
    // Fill modal
    // -------------------------------------------------

    if (confirmFeeName) {

        confirmFeeName.textContent =
            fee.feeType.feeName;
    }

    if (confirmAmount) {

        confirmAmount.textContent =
            `₹${formatAmount(amount)}`;
    }

    if (confirmRemaining) {

        confirmRemaining.textContent =
            `₹${formatAmount(
                remainingAmount - amount
            )}`;
    }


    // -------------------------------------------------
    // Reset confirm button
    // -------------------------------------------------

    if (paymentConfirmBtn) {

        paymentConfirmBtn.disabled = false;

        paymentConfirmBtn.textContent =
            "Confirm Payment";
    }


    // -------------------------------------------------
    // Show modal
    // -------------------------------------------------

    paymentConfirmModal.classList.add(
        "show"
    );
}


// =========================================================
// CLOSE PAYMENT CONFIRMATION MODAL
// =========================================================

function closePaymentConfirmation() {

    if (paymentConfirmModal) {

        paymentConfirmModal.classList.remove(
            "show"
        );
    }

    pendingPayment = null;
}


// =========================================================
// PROCESS CONFIRMED PAYMENT
// =========================================================

async function processConfirmedPayment() {

    if (!pendingPayment) {
        return;
    }

    const fee =
        pendingPayment.fee;

    const amount =
        pendingPayment.amount;

    const payButton =
        document.getElementById(
            "payButton"
        );


    // -------------------------------------------------
    // Disable buttons
    // -------------------------------------------------

    if (payButton) {

        payButton.disabled = true;

        payButton.textContent =
            "Processing...";
    }

    if (paymentConfirmBtn) {

        paymentConfirmBtn.disabled = true;

        paymentConfirmBtn.textContent =
            "Processing...";
    }


    // -------------------------------------------------
    // Payment request
    // -------------------------------------------------

    const paymentData = {

        studentId:
            currentStudent.studentId,

        academicYearId:
            fee.academicYear.academicYearId,

        feeTypeId:
            fee.feeType.feeTypeId,

        amount:
            amount,

        paymentMethod:
            "MOCK",

        remarks:
            "Prototype payment"
    };


    try {

        // -------------------------------------------------
        // Send request
        // -------------------------------------------------

        const response =
            await fetch(
                `${API_URL}/payments`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            paymentData
                        )
                }
            );


        // -------------------------------------------------
        // Check response
        // -------------------------------------------------

        if (!response.ok) {

            const errorText =
                await response.text();

            let errorMessage =
                "Payment failed.";

            try {

                const errorData =
                    JSON.parse(
                        errorText
                    );

                if (errorData.message) {

                    errorMessage =
                        errorData.message;

                }
                else if (errorData.error) {

                    errorMessage =
                        errorData.error;

                }
                else {

                    errorMessage =
                        errorText ||
                        "Payment failed.";
                }

            }
            catch (e) {

                errorMessage =
                    errorText ||
                    "Payment failed.";
            }

            throw new Error(
                errorMessage
            );
        }


        // -------------------------------------------------
        // Get payment response
        // -------------------------------------------------

        const payment =
            await response.json();


        // -------------------------------------------------
        // Close confirmation modal
        // -------------------------------------------------

        closePaymentConfirmation();


        // -------------------------------------------------
        // Success notification
        // -------------------------------------------------

        showNotification(
            "success",
            "Payment Successful",
            `₹${formatAmount(
                payment.amount
            )} paid for ${
                payment.feeType.feeName
            }. Transaction ID: ${
                payment.transactionId
            }`
        );


        // -------------------------------------------------
        // Refresh fee data
        // -------------------------------------------------

        await loadFees();

    }
    catch (error) {

        console.error(
            "Payment error:",
            error
        );


        closePaymentConfirmation();


        showNotification(
            "error",
            "Payment Failed",
            error.message
        );


        if (payButton) {

            payButton.disabled =
                false;

            payButton.textContent =
                "Pay Now";
        }

    }
    finally {

        if (paymentConfirmBtn) {

            paymentConfirmBtn.disabled =
                false;

            paymentConfirmBtn.textContent =
                "Confirm Payment";
        }

    }
}


// =========================================================
// FALLBACK PAYMENT FUNCTION
// =========================================================

async function processPayment(
    fee,
    amount
) {

    const remainingAmount =
        Number(fee.amount);

    pendingPayment = {

        fee: fee,

        amount: amount,

        remainingAmount:
            remainingAmount
    };

    await processConfirmedPayment();
}


// =========================================================
// SHOW PAYMENT NOTIFICATION
// =========================================================

function showNotification(
    type,
    title,
    message
) {

    if (!paymentNotification) {

        console.error(
            "Payment notification element not found."
        );

        return;
    }


    clearTimeout(
        notificationTimer
    );


    // Reset animation

    paymentNotification.classList.remove(
        "show",
        "success",
        "error"
    );


    // Set type

    if (type === "success") {

        paymentNotification.classList.add(
            "success"
        );

        if (notificationIcon) {

            notificationIcon.textContent =
                "✓";
        }

    }
    else {

        paymentNotification.classList.add(
            "error"
        );

        if (notificationIcon) {

            notificationIcon.textContent =
                "!";
        }
    }


    // Set title

    if (notificationTitle) {

        notificationTitle.textContent =
            title;
    }


    // Set message

    if (notificationMessage) {

        notificationMessage.textContent =
            message;
    }


    // Force reflow

    void paymentNotification.offsetWidth;


    // Start animation

    paymentNotification.classList.add(
        "show"
    );


    // Automatically close

    notificationTimer =
        setTimeout(
            () => {

                paymentNotification.classList.remove(
                    "show"
                );

            },
            5000
        );
}


// =========================================================
// CLOSE NOTIFICATION
// =========================================================

if (notificationClose) {

    notificationClose.addEventListener(
        "click",
        () => {

            if (paymentNotification) {

                paymentNotification.classList.remove(
                    "show"
                );
            }

        }
    );
}


// =========================================================
// PAYMENT MODAL BUTTONS
// =========================================================

if (paymentModalClose) {

    paymentModalClose.addEventListener(
        "click",
        () => {

            closePaymentConfirmation();

        }
    );
}


if (paymentCancelBtn) {

    paymentCancelBtn.addEventListener(
        "click",
        () => {

            closePaymentConfirmation();

        }
    );
}


if (paymentConfirmBtn) {

    paymentConfirmBtn.addEventListener(
        "click",
        () => {

            processConfirmedPayment();

        }
    );
}


// =========================================================
// CLICK OUTSIDE PAYMENT MODAL
// =========================================================

if (paymentConfirmModal) {

    paymentConfirmModal.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                paymentConfirmModal
            ) {

                closePaymentConfirmation();
            }

        }
    );
}


// =========================================================
// ESC KEY CLOSE MODAL
// =========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            paymentConfirmModal &&
            paymentConfirmModal.classList.contains(
                "show"
            )
        ) {

            closePaymentConfirmation();

        }

    }
);


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
// SHOW MESSAGE
// =========================================================

function showMessage(
    title,
    message
) {

    if (feeTypeSelect) {

        feeTypeSelect.innerHTML = `
            <option value="">
                No fee types available
            </option>
        `;
    }

    if (feeDetails) {

        feeDetails.innerHTML = `
            <div class="no-fees">

                <h3>
                    ${escapeHtml(title)}
                </h3>

                <p>
                    ${escapeHtml(message)}
                </p>

            </div>
        `;
    }
}


// =========================================================
// LOADING
// =========================================================

function showLoading() {

    if (feeTypeSelect) {

        feeTypeSelect.innerHTML = `
            <option value="">
                Loading fee types...
            </option>
        `;
    }

    if (feeDetails) {

        feeDetails.innerHTML = `
            <div class="loading-message">
                Loading fee details...
            </div>
        `;
    }
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


// =========================================================
// SIDEBAR TOGGLE
// =========================================================

if (menuBtn && sidebar) {

    menuBtn.addEventListener(
        "click",
        (event) => {

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
// CLOSE SIDEBAR WHEN CLICKING OUTSIDE
// =========================================================

document.addEventListener(
    "click",
    (event) => {

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
        () => {

            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("email");

            window.location.href =
                "index.html";

        }
    );
}