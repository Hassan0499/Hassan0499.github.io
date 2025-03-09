const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cors());

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Session Configuration
app.use(
    session({
        secret: "testing",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Set to true if using HTTPS
    })
);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// MongoDB Models
const User = mongoose.model("Login_Info", new mongoose.Schema({
    name: String,
    email: String,
    password: String
}));

const StudentRegistration = mongoose.model("StudentRegistration", new mongoose.Schema({
    degree: String,
    student_name: String,
    department: String,
    program: String,
    email: String // Links student registration to logged-in user
}));

// ==================================================================
// 🚀 ROUTES
// ==================================================================

// Serve HTML Pages
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/register", (req, res) => res.sendFile(path.join(__dirname, "public", "register.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/dashboard", (req, res) => {
    if (!req.session.email) return res.redirect("/login");
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// ==================================================================
// ✅ SIGNUP (USER REGISTRATION) API
// ==================================================================
app.post("/api/register", async (req, res) => {
    console.log("Received User Registration Data:", req.body); // Debugging

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ status: "error", message: "⚠ All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.json({ status: "error", message: "⚠ Email already registered. Try logging in." });
    }

    await User.create({ name, email, password });

    res.json({ status: "success", message: "✅ Registration successful! Redirecting to login..." });
});

// ==================================================================
// ✅ LOGIN API
// ==================================================================
app.post("/api/login", async (req, res) => {
    console.log("Received Login Data:", req.body); // Debugging

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
        return res.json({ status: "error", message: "Invalid email or password. Try again." });
    }

    req.session.email = email; // Store user in session

    res.json({ status: "success", message: "Login successful!", redirect: "/dashboard" });
});

// ==================================================================
// ✅ STUDENT REGISTRATION API (AFTER LOGIN)
// ==================================================================
app.post("/api/register_student", async (req, res) => {
    if (!req.session.email) {
        return res.json({ status: "error", message: "Unauthorized access. Please log in." });
    }

    console.log("Received Student Registration Data:", req.body); // Debugging

    const { degree, student_name, department, program } = req.body;

    if (!degree || !student_name || !department || !program) {
        return res.json({ status: "error", message: "All fields are required." });
    }

    await StudentRegistration.create({
        degree,
        student_name,
        department,
        program,
        email: req.session.email
    });

    res.json({ status: "success", message: "Student registered successfully!" });
});

// ==================================================================
// ✅ LOGOUT API
// ==================================================================
app.get("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

// ==================================================================
// 🚀 START SERVER
// ==================================================================
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
