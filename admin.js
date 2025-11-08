// Brilliance Academy – Admin Dashboard Logic

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("academy_session"));
  const welcomeText = document.getElementById("welcomeText");
  const admissionList = document.getElementById("admissionList");
  const studentList = document.getElementById("studentList");
  const homeworkList = document.getElementById("homeworkList");

  if(!user || user.role !== "admin"){
    alert("Please login as admin!");
    window.location.href = "login.html";
    return;
  }

  welcomeText.textContent = `Welcome back, ${user.name} 👋`;

  const users = JSON.parse(localStorage.getItem("academy_users") || "[]");
  const homework = JSON.parse(localStorage.getItem("academy_homework") || "[]");
  const submissions = JSON.parse(localStorage.getItem("academy_submissions") || "[]");

  // === Admissions (students pending approval) ===
  function renderAdmissions(){
    const pending = users.filter(u => !u.approved && u.role === "student");
    admissionList.innerHTML = pending.length
      ? pending.map(u => `
        <div class="item">
          <div><b>${u.name}</b> - Class ${u.class} (${u.email})</div>
          <div>
            <button class="approve" data-email="${u.email}">Approve</button>
            <button class="delete" data-email="${u.email}">Delete</button>
          </div>
        </div>
      `).join("")
      : "<p>No new admissions.</p>";

    admissionList.querySelectorAll(".approve").forEach(btn => {
      btn.addEventListener("click", () => {
        const email = btn.dataset.email;
        const idx = users.findIndex(u => u.email === email);
        if(idx !== -1) users[idx].approved = true;
        localStorage.setItem("academy_users", JSON.stringify(users));
        alert("Admission approved ✅");
        renderAll();
      });
    });

    admissionList.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", () => {
        const email = btn.dataset.email;
        const filtered = users.filter(u => u.email !== email);
        localStorage.setItem("academy_users", JSON.stringify(filtered));
        alert("Admission deleted ❌");
        renderAll();
      });
    });
  }

  // === Students List ===
  function renderStudents(){
    const approved = users.filter(u => u.approved && u.role === "student");
    studentList.innerHTML = approved.length
      ? approved.map(u => `
        <div class="item">
          <div><b>${u.name}</b> - Class ${u.class}</div>
          <div>${u.email}</div>
        </div>
      `).join("")
      : "<p>No approved students yet.</p>";
  }

  // === Homework Overview ===
  function renderHomework(){
    homeworkList.innerHTML = homework.length
      ? homework.map(h => `
        <div class="item">
          <div><b>${h.title}</b> (${h.subject}) - Class ${h.class}</div>
          <div>By ${h.teacher} • ${h.date}</div>
        </div>
      `).join("")
      : "<p>No homework uploaded yet.</p>";
  }

  // === Graph ===
  function renderGraph(){
    const ctx = document.getElementById("statsChart");
    const classCounts = [6,7,8,9,10].map(c => 
      users.filter(u => u.class == c && u.role === "student" && u.approved).length
    );
    const subCount = submissions.length;

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Class 6","Class 7","Class 8","Class 9","Class 10"],
        datasets: [{
          label: "Students per Class",
          data: classCounts,
          backgroundColor: "#60A5FA"
        }]
      },
      options: {
        plugins:{legend:{display:false}},
        scales:{y:{beginAtZero:true}},
      }
    });
  }

  // === Logout ===
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("academy_session");
    window.location.href = "login.html";
  });

  // Render all sections
  function renderAll(){
    renderAdmissions();
    renderStudents();
    renderHomework();
    renderGraph();
  }
  renderAll();
});
