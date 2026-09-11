document.addEventListener("DOMContentLoaded", function () {

    loadDashboard();

    setupMenu();

    setupLogout();

});


async function loadDashboard() {

    const studentId = localStorage.getItem("userId");

    if (!studentId) {
        window.location.href = "index.html";
        return;
    }

    try {

        const response =
            await fetch(`/api/students/${studentId}`);

        if (!response.ok) {
            throw new Error("Unable to load student information");
        }

        const student = await response.json();


        document.getElementById("studentId").textContent =
            student.studentId ?? "-";

        document.getElementById("rollNumber").textContent =
            student.rollNumber ?? "-";

        document.getElementById("name").textContent =
            student.name ?? "-";

        document.getElementById("studentName").textContent =
            student.name ?? "Student";

        document.getElementById("topStudentName").textContent =
            student.name ?? "Student";

        document.getElementById("email").textContent =
            student.email ?? "-";

        document.getElementById("department").textContent =
            student.department ?? "-";

        document.getElementById("course").textContent =
            student.course ?? "-";

        document.getElementById("year").textContent =
            student.yearOfStudy ?? "-";

    } catch (error) {

        console.error("Dashboard error:", error);

        alert("Unable to load student information.");
    }
}


function setupMenu() {

    const menuButton =
        document.getElementById("menuButton");

    const sidebar =
        document.getElementById("sidebar");

    const overlay =
        document.getElementById("sidebarOverlay");


    menuButton.addEventListener("click", function () {

        sidebar.classList.toggle("open");

        overlay.classList.toggle("active");

    });


    overlay.addEventListener("click", function () {

        sidebar.classList.remove("open");

        overlay.classList.remove("active");

    });


    const menuItems =
        document.querySelectorAll(".menu-item");


    menuItems.forEach(function (item) {

        item.addEventListener("click", function () {

            sidebar.classList.remove("open");

            overlay.classList.remove("active");

        });

    });

}


function setupLogout() {

    document
        .getElementById("logoutButton")
        .addEventListener("click", function () {

            localStorage.clear();

            window.location.href = "index.html";

        });

}