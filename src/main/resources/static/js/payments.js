const API_URL = "http://localhost:8081/api";


// =========================================================
// LOGIN INFORMATION
// =========================================================

const username = localStorage.getItem("username");


// =========================================================
// HTML ELEMENTS
// =========================================================

const paymentHistory =
    document.getElementById("paymentHistory");

const totalPayments =
    document.getElementById("totalPayments");

const totalAmount =
    document.getElementById("totalAmount");

const studentName =
    document.getElementById("studentName");

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const logoutBtn =
    document.getElementById("logoutBtn");


// =========================================================
// PAYMENT DETAILS / RECEIPT MODAL
// =========================================================

const paymentDetailsModal =
    document.getElementById("paymentDetailsModal");

const paymentDetailsClose =
    document.getElementById("paymentDetailsClose");

const receiptCloseBtn =
    document.getElementById("receiptCloseBtn");

const downloadReceiptBtn =
    document.getElementById("downloadReceiptBtn");

const receiptStudentName =
    document.getElementById("receiptStudentName");

const receiptRollNumber =
    document.getElementById("receiptRollNumber");

const detailsFee =
    document.getElementById("detailsFee");

const detailsAmount =
    document.getElementById("detailsAmount");

const detailsAcademicYear =
    document.getElementById("detailsAcademicYear");

const detailsTransaction =
    document.getElementById("detailsTransaction");

const detailsMethod =
    document.getElementById("detailsMethod");

const detailsDate =
    document.getElementById("detailsDate");

const detailsStatus =
    document.getElementById("detailsStatus");


// =========================================================
// GLOBAL DATA
// =========================================================

let currentStudent = null;

let studentPayments = [];

let selectedPayment = null;


// =========================================================
// CHECK LOGIN
// =========================================================

if (!username) {

    window.location.href = "index.html";

} else {

    loadPaymentHistory();

}


// =========================================================
// LOAD PAYMENT HISTORY
// =========================================================

async function loadPaymentHistory() {

    try {

        showLoading();


        // -------------------------------------------------
        // 1. Get students
        // -------------------------------------------------

        const studentsResponse =
            await fetch(
                `${API_URL}/students`
            );


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
            students.find(student => {

                return (
                    student.rollNumber &&
                    student.rollNumber
                        .trim()
                        .toLowerCase() ===
                    username
                        .trim()
                        .toLowerCase()
                );

            });


        // -------------------------------------------------
        // 3. Student not found
        // -------------------------------------------------

        if (!student) {

            paymentHistory.innerHTML = `

                <div class="payment-error">

                    <div class="error-icon">
                        ⚠
                    </div>

                    <h3>
                        Student Not Found
                    </h3>

                    <p>
                        No student record was found
                        for ${escapeHtml(username)}.
                    </p>

                </div>

            `;

            return;

        }


        currentStudent =
            student;


        // -------------------------------------------------
        // 4. Display student name
        // -------------------------------------------------

        if (studentName) {

            studentName.textContent =
                student.name;

        }


        // -------------------------------------------------
        // 5. Get student payments
        // -------------------------------------------------

        const response =
            await fetch(
                `${API_URL}/payments/student/${student.studentId}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load payment history"
            );

        }


        const payments =
            await response.json();


        studentPayments =
            payments || [];


        // -------------------------------------------------
        // 6. Display payments
        // -------------------------------------------------

        displayPayments(
            studentPayments
        );

    }
    catch (error) {

        console.error(
            "Payment history error:",
            error
        );


        paymentHistory.innerHTML = `

            <div class="payment-error">

                <div class="error-icon">
                    ⚠
                </div>

                <h3>
                    Unable to Load Payment History
                </h3>

                <p>
                    ${escapeHtml(
                        error.message
                    )}
                </p>

            </div>

        `;

    }

}


// =========================================================
// DISPLAY PAYMENTS
// =========================================================

function displayPayments(
    payments
) {

    // -----------------------------------------------------
    // No payments
    // -----------------------------------------------------

    if (
        !payments ||
        payments.length === 0
    ) {

        totalPayments.textContent =
            "0";

        totalAmount.textContent =
            "₹0.00";


        paymentHistory.innerHTML = `

            <div class="no-payments">

                <div class="no-payment-icon">
                    💳
                </div>

                <h3>
                    No Payments Yet
                </h3>

                <p>
                    Your fee payments will
                    appear here.
                </p>

                <a
                    href="fees.html"
                    class="go-to-fees-btn">

                    View My Fees

                </a>

            </div>

        `;

        return;

    }


    // -----------------------------------------------------
    // Calculate total amount
    // -----------------------------------------------------

    let totalPaid = 0;


    payments.forEach(
        payment => {

            totalPaid +=
                Number(
                    payment.amount || 0
                );

        }
    );


    // -----------------------------------------------------
    // Update summary
    // -----------------------------------------------------

    totalPayments.textContent =
        payments.length;


    totalAmount.textContent =
        formatCurrency(
            totalPaid
        );


    // -----------------------------------------------------
    // Sort newest first
    // -----------------------------------------------------

    payments.sort(
        (a, b) => {

            return (
                new Date(
                    b.paymentDate
                ) -
                new Date(
                    a.paymentDate
                )
            );

        }
    );


    // -----------------------------------------------------
    // Clear old records
    // -----------------------------------------------------

    paymentHistory.innerHTML =
        "";


    // -----------------------------------------------------
    // Create cards
    // -----------------------------------------------------

    payments.forEach(
        payment => {

            const card =
                createPaymentCard(
                    payment
                );

            paymentHistory.appendChild(
                card
            );

        }
    );

}


// =========================================================
// CREATE PAYMENT CARD
// =========================================================

function createPaymentCard(
    payment
) {

    const card =
        document.createElement("div");


    card.className =
        "payment-history-item";


    // -----------------------------------------------------
    // Payment values
    // -----------------------------------------------------

    const feeName =
        payment.feeType &&
        payment.feeType.feeName
            ? payment.feeType.feeName
            : "Fee Payment";


    const amount =
        Number(
            payment.amount || 0
        );


    const transactionId =
        payment.transactionId ||
        "N/A";


    const paymentMethod =
        payment.paymentMethod ||
        "MOCK";


    const status =
        payment.paymentStatus ||
        "SUCCESS";


    const paymentDate =
        formatDate(
            payment.paymentDate
        );


    const normalizedStatus =
        status.toUpperCase();


    const statusClass =
        normalizedStatus === "SUCCESS"
            ? "success"
            : "failed";


    // -----------------------------------------------------
    // Payment card
    // -----------------------------------------------------

    card.innerHTML = `

        <div class="payment-main">

            <div class="payment-fee-icon">
                ₹
            </div>


            <div class="payment-info">

                <h3>
                    ${escapeHtml(
                        feeName
                    )}
                </h3>


                <p>
                    ${paymentDate}
                </p>

            </div>

        </div>


        <div class="payment-details">


            <div class="payment-detail">

                <span>
                    Amount
                </span>

                <strong>
                    ${formatCurrency(
                        amount
                    )}
                </strong>

            </div>


            <div class="payment-detail">

                <span>
                    Transaction ID
                </span>

                <strong class="transaction-id">

                    ${escapeHtml(
                        transactionId
                    )}

                </strong>

            </div>


            <div class="payment-detail">

                <span>
                    Method
                </span>

                <strong>

                    ${escapeHtml(
                        paymentMethod
                    )}

                </strong>

            </div>


            <div class="payment-actions">

                <span
                    class="status-badge ${statusClass}">

                    ${escapeHtml(
                        normalizedStatus
                    )}

                </span>


                <button
                    type="button"
                    class="view-payment-btn">

                    View Details

                </button>

            </div>


        </div>

    `;


    // -----------------------------------------------------
    // View Details button
    // -----------------------------------------------------

    const viewButton =
        card.querySelector(
            ".view-payment-btn"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            () => {

                openPaymentDetails(
                    payment
                );

            }
        );

    }


    return card;

}


// =========================================================
// OPEN PAYMENT DETAILS / RECEIPT
// =========================================================

function openPaymentDetails(
    payment
) {

    if (!paymentDetailsModal) {

        return;

    }


    selectedPayment =
        payment;


    // -----------------------------------------------------
    // Student name
    // -----------------------------------------------------

    if (receiptStudentName) {

        receiptStudentName.textContent =
            currentStudent &&
            currentStudent.name
                ? currentStudent.name
                : "-";

    }


    // -----------------------------------------------------
    // Roll number
    // -----------------------------------------------------

    if (receiptRollNumber) {

        receiptRollNumber.textContent =
            currentStudent &&
            currentStudent.rollNumber
                ? currentStudent.rollNumber
                : "-";

    }


    // -----------------------------------------------------
    // Fee type
    // -----------------------------------------------------

    if (detailsFee) {

        detailsFee.textContent =
            payment.feeType &&
            payment.feeType.feeName
                ? payment.feeType.feeName
                : "Fee Payment";

    }


    // -----------------------------------------------------
    // Amount
    // -----------------------------------------------------

    if (detailsAmount) {

        detailsAmount.textContent =
            formatCurrency(
                payment.amount
            );

    }


    // -----------------------------------------------------
    // Academic year
    // -----------------------------------------------------

    if (detailsAcademicYear) {

        detailsAcademicYear.textContent =
            payment.academicYear &&
            payment.academicYear.academicYear
                ? payment.academicYear.academicYear
                : "-";

    }


    // -----------------------------------------------------
    // Transaction ID
    // -----------------------------------------------------

    if (detailsTransaction) {

        detailsTransaction.textContent =
            payment.transactionId ||
            "N/A";

    }


    // -----------------------------------------------------
    // Payment method
    // -----------------------------------------------------

    if (detailsMethod) {

        detailsMethod.textContent =
            payment.paymentMethod ||
            "MOCK";

    }


    // -----------------------------------------------------
    // Payment date
    // -----------------------------------------------------

    if (detailsDate) {

        detailsDate.textContent =
            formatDate(
                payment.paymentDate
            );

    }


    // -----------------------------------------------------
    // Payment status
    // -----------------------------------------------------

    if (detailsStatus) {

        detailsStatus.textContent =
            payment.paymentStatus ||
            "SUCCESS";

    }


    // -----------------------------------------------------
    // Show modal
    // -----------------------------------------------------

    paymentDetailsModal.classList.add(
        "show"
    );

}


// =========================================================
// CLOSE PAYMENT DETAILS
// =========================================================

function closePaymentDetails() {

    if (paymentDetailsModal) {

        paymentDetailsModal.classList.remove(
            "show"
        );

    }


    selectedPayment =
        null;

}


// =========================================================
// CLOSE MODAL BUTTON
// =========================================================

if (paymentDetailsClose) {

    paymentDetailsClose.addEventListener(
        "click",
        () => {

            closePaymentDetails();

        }
    );

}


// =========================================================
// RECEIPT CLOSE BUTTON
// =========================================================

if (receiptCloseBtn) {

    receiptCloseBtn.addEventListener(
        "click",
        () => {

            closePaymentDetails();

        }
    );

}


// =========================================================
// DOWNLOAD / PRINT RECEIPT
// =========================================================

if (downloadReceiptBtn) {

    downloadReceiptBtn.addEventListener(
        "click",
        () => {

            printReceipt();

        }
    );

}


// =========================================================
// PRINT RECEIPT
// =========================================================

function printReceipt() {

    if (!selectedPayment) {

        return;

    }


    const receiptContent =
        document.getElementById(
            "receiptContent"
        );


    if (!receiptContent) {

        return;

    }


    const printWindow =
        window.open(
            "",
            "_blank",
            "width=800,height=900"
        );


    if (!printWindow) {

        return;

    }


    printWindow.document.write(`

        <!DOCTYPE html>

        <html lang="en">

        <head>

            <meta charset="UTF-8">

            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0">

            <title>
                Payment Receipt
            </title>


            <style>

                * {
                    box-sizing: border-box;
                }


                body {

                    font-family:
                        Arial,
                        Helvetica,
                        sans-serif;

                    background: white;

                    color: #111827;

                    padding: 35px;

                }


                .receipt {

                    max-width: 700px;

                    margin: 0 auto;

                    border:
                        1px solid #d1d5db;

                    border-radius: 14px;

                    padding: 35px;

                }


                .receipt-header {

                    text-align: center;

                    border-bottom:
                        2px solid #e5e7eb;

                    padding-bottom: 20px;

                    margin-bottom: 20px;

                }


                .receipt-logo {

                    width: 55px;

                    height: 55px;

                    border-radius: 50%;

                    margin: 0 auto 10px;

                    display: flex;

                    align-items: center;

                    justify-content: center;

                    background: #eff6ff;

                    color: #2563eb;

                    font-size: 24px;

                    font-weight: bold;

                }


                .receipt-header h2 {

                    margin: 5px 0;

                    font-size: 24px;

                }


                .receipt-header p {

                    color: #6b7280;

                    margin: 0;

                }


                .receipt-success {

                    text-align: center;

                    background: #dcfce7;

                    color: #166534;

                    padding: 12px;

                    border-radius: 8px;

                    font-weight: 700;

                    margin-bottom: 25px;

                }


                .receipt-student,
                .receipt-payment {

                    margin-bottom: 25px;

                }


                .receipt-student h3,
                .receipt-payment h3 {

                    font-size: 17px;

                    margin-bottom: 10px;

                    border-bottom:
                        1px solid #e5e7eb;

                    padding-bottom: 8px;

                }


                .receipt-row {

                    display: flex;

                    justify-content:
                        space-between;

                    gap: 25px;

                    padding: 10px 0;

                    border-bottom:
                        1px solid #f1f5f9;

                }


                .receipt-row span {

                    color: #6b7280;

                }


                .receipt-row strong {

                    text-align: right;

                }


                .receipt-transaction {

                    font-family:
                        Consolas,
                        monospace;

                }


                .receipt-footer {

                    text-align: center;

                    margin-top: 30px;

                    padding-top: 20px;

                    border-top:
                        1px dashed #d1d5db;

                }


                .receipt-footer p {

                    margin-bottom: 7px;

                }


                .receipt-footer small {

                    color: #6b7280;

                }


                @media print {

                    body {

                        padding: 0;

                    }


                    .receipt {

                        border: none;

                    }

                }

            </style>

        </head>


        <body>

            <div class="receipt">

                ${receiptContent.innerHTML}

            </div>

        </body>

        </html>

    `);


    printWindow.document.close();


    printWindow.focus();


    setTimeout(
        () => {

            printWindow.print();

        },
        300
    );

}


// =========================================================
// CLICK OUTSIDE MODAL
// =========================================================

if (paymentDetailsModal) {

    paymentDetailsModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                paymentDetailsModal
            ) {

                closePaymentDetails();

            }

        }
    );

}


// =========================================================
// ESC KEY
// =========================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            paymentDetailsModal &&
            paymentDetailsModal.classList.contains(
                "show"
            )
        ) {

            closePaymentDetails();

        }

    }
);


// =========================================================
// FORMAT CURRENCY
// =========================================================

function formatCurrency(
    amount
) {

    return "₹" +
        Number(
            amount || 0
        ).toLocaleString(
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

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "Date unavailable";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return "Date unavailable";

    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",

            month: "short",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit"
        }
    );

}


// =========================================================
// SHOW LOADING
// =========================================================

function showLoading() {

    if (!paymentHistory) {

        return;

    }


    paymentHistory.innerHTML = `

        <div class="payment-loading">

            Loading payment history...

        </div>

    `;

}


// =========================================================
// MOBILE MENU
// =========================================================

if (menuBtn) {

    menuBtn.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.toggle(
                    "open"
                );

            }


            if (overlay) {

                overlay.classList.toggle(
                    "show"
                );

            }

        }
    );

}


// =========================================================
// MOBILE OVERLAY
// =========================================================

if (overlay) {

    overlay.addEventListener(
        "click",
        () => {

            if (sidebar) {

                sidebar.classList.remove(
                    "open"
                );

            }


            overlay.classList.remove(
                "show"
            );

        }
    );

}


// =========================================================
// LOGOUT
// =========================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();


            localStorage.clear();


            window.location.href =
                "index.html";

        }
    );

}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value ?? "";


    return div.innerHTML;

}