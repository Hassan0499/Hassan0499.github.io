document.addEventListener("DOMContentLoaded", function () {
    function showMessage(message, color) {
        let messageDiv = document.getElementById("message");
        messageDiv.style.display = "block";
        messageDiv.style.color = color;
        messageDiv.textContent = message;
    }

    // ==============================
    // ✅ User Registration (Signup)
    // ==============================
    let registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            
            let formData = {
                name: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value.trim(),
            };
            
            fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                showMessage(data.message, data.status === "success" ? "green" : "red");
                if (data.status === "success") {
                    setTimeout(() => window.location.href = "/login", 2000);
                }
            });
        });
    }

    // ==============================
    // ✅ User Login
    // ==============================
    let loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let formData = {
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value.trim(),
            };
            
            fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                showMessage(data.message, data.status === "success" ? "green" : "red");
                if (data.status === "success") {
                    setTimeout(() => window.location.href = "/dashboard", 2000);
                }
            });
        });
    }

    // ==============================
    // ✅ Student Registration (After Login)
    // ==============================
    let studentForm = document.getElementById("studentForm");
    if (studentForm) {
        studentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let formData = {
                degree: document.getElementById("degree").value,
                student_name: document.getElementById("student_name").value.trim(),
                department: document.getElementById("department").value.trim(),
                program: document.getElementById("program").value.trim(),
            };

            fetch("/api/register_student", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })
            .then(response => response.json())
            .then(data => {
                showMessage(data.message, data.status === "success" ? "green" : "red");

                if (data.status === "success") {
                    // Clear form fields after successful registration
                    studentForm.reset();
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }

    // ==============================
    // ✅ Logout
    // ==============================
    let logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (event) {
            event.preventDefault();
            
            fetch("/api/logout")
            .then(() => {
                window.location.href = "/";
            });
        });
    }
});
