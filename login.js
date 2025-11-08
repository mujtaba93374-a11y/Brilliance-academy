// Brilliance Academy - Unified Login System
document.addEventListener("DOMContentLoaded", () => {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  // Tab switching
  loginTab.addEventListener("click", () => {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  });

  registerTab.addEventListener("click", () => {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // Register new student
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const cls = document.getElementById("regClass").value;
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value.trim();

    if (!name || !cls || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    let users = JSON.parse(localStorage.getItem("academy_users") || "[]");
    if (users.find((u) => u.email === email)) {
      alert("Email already registered!");
      return;
    }

    users.push({ name, class: cls, email, password, role: "student", approved: false });
    localStorage.setItem("academy_users", JSON.stringify(users));
    alert("🎉 Registration successful! Please wait for admin approval.");
    loginTab.click();
    registerForm.reset();
  });

  // Login existing user (student / teacher / admin)
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    // === Admin Credentials ===
    if (email === "admin@brillianceacademy.com" && password === "admin123") {
      localStorage.setItem("academy_session", JSON.stringify({ name: "Admin", role: "admin" }));
      alert("Welcome Admin 👋");
      window.location.href = "../admin-dashboard.html";
      return;
    }

    // === Teacher Credentials ===
    if (email === "teacher@brillianceacademy.com" && password === "teach123") {
      localStorage.setItem("academy_session", JSON.stringify({ name: "Teacher", role: "teacher" }));
      alert("Welcome Teacher 👋");
      window.location.href = "../teacher-dashboard.html";
      return;
    }

    // === Students ===
    const users = JSON.parse(localStorage.getItem("academy_users") || "[]");
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid credentials ❌");
      return;
    }

    if (!user.approved) {
      alert("Your admission is pending admin approval.");
      return;
    }

    localStorage.setItem("academy_session", JSON.stringify(user));
    alert(`Welcome back, ${user.name}!`);
    window.location.href = "../student-dashboard.html";
  });
});
