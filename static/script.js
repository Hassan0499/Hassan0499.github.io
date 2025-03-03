document.addEventListener("DOMContentLoaded", function () {
    function showMessage(message, color) {
        let messageDiv = document.getElementById("message");
        messageDiv.style.display = "block";
        messageDiv.style.color = color;
        messageDiv.textContent = message;
    }

    function validateForm(name, email, password) {
        let nameRegex = /^[A-Za-z\s]{3,}$/; // Only letters and spaces, min 3 chars
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
        let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Min 6 chars, at least 1 letter and 1 number

        if (!nameRegex.test(name)) {
            showMessage("⚠ Name must be at least 3 letters long and contain only letters.", "red");
            return false;
        }
        if (!emailRegex.test(email)) {
            showMessage("⚠ Please enter a valid email address.", "red");
            return false;
        }
        if (!passwordRegex.test(password)) {
            showMessage("⚠ Password must be at least 6 characters long and contain at least 1 letter and 1 number.", "red");
            return false;
        }
        return true;
    }

    // Register Form Submission
    let registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let name = document.getElementById("name").value.trim();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value.trim();

            if (!validateForm(name, email, password)) return;

            let formData = new FormData(this);

            fetch("/register", {
                method: "POST",
                body: formData
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

    // Login Form Submission
    let loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
            let email = document.getElementById("email").value.trim();
            let password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {
                showMessage("⚠ Email and Password cannot be empty.", "red");
                return;
            }

            let formData = new FormData(this);

            fetch("/login", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showMessage(data.message, data.status === "success" ? "green" : "red");
                if (data.status === "success") {
                    setTimeout(() => window.location.href = data.redirect, 2000);
                }
            });
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    function showMessage(message, color) {
        let messageDiv = document.getElementById("form-message");
        messageDiv.style.display = "block";
        messageDiv.style.color = color;
        messageDiv.textContent = message;
    }

    let studentForm = document.getElementById("studentForm");
    if (studentForm) {
        studentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            let formData = new FormData(this);

            fetch("/register_student", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                showMessage(data.message, data.status === "success" ? "green" : "red");

                if (data.status === "success") {
                    // Clear form after successful submission
                    studentForm.reset();
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }
});
