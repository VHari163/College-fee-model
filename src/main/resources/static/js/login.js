const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    try {

        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {

            message.textContent = data.message;
            message.className = "success";

            // Save basic user information
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", data.username);
            localStorage.setItem("role", data.role);
            localStorage.setItem("email", data.email);

            // Go to dashboard
            window.location.href = "dashboard.html";

        } else {

            message.textContent =
                data.message || "Invalid username or password";

            message.className = "error";
        }

    } catch (error) {

        console.error("Login error:", error);

        message.textContent =
            "Unable to connect to the server";

        message.className = "error";
    }
});