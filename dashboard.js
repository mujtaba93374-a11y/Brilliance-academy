// Brilliance Academy – Student Dashboard Logic

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("academy_session"));
  const welcomeText = document.getElementById("welcomeText");
  const homeworkList = document.getElementById("homeworkList");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const uploadForm = document.getElementById("uploadForm");

  if(!user){
    alert("Please login first!");
    window.location.href = "login.html";
    return;
  }

  // Personalized Greeting
  welcomeText.textContent = `Welcome back, ${user.name} 👋`;

  // Load Homework (teacher-assigned)
  const allHomework = JSON.parse(localStorage.getItem("academy_homework") || "[]");
  const myHomework = allHomework.filter(h => h.class === user.class);
  homeworkList.innerHTML = myHomework.length
    ? myHomework.map(h => `<div class="hw-item">${h.subject} – ${h.title}</div>`).join("")
    : "<p>No homework yet 🎉</p>";

  // Progress calc
  const submitted = JSON.parse(localStorage.getItem("academy_submissions") || "[]")
                    .filter(s => s.studentEmail === user.email).length;
  const percent = myHomework.length ? Math.round((submitted / myHomework.length) * 100) : 0;
  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "% completed";

  // Submit Homework
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const subject = document.getElementById("hwSubject").value;
    const text = document.getElementById("hwText").value.trim();
    const fileInput = document.getElementById("hwFile");
    if(!subject){alert("Select subject");return;}

    let submissions = JSON.parse(localStorage.getItem("academy_submissions") || "[]");
    const newSub = {
      id:Date.now(),
      studentEmail:user.email,
      name:user.name,
      class:user.class,
      subject,
      text,
      file:fileInput.files[0]?.name || "",
      date:new Date().toLocaleString()
    };
    submissions.push(newSub);
    localStorage.setItem("academy_submissions", JSON.stringify(submissions));
    alert("✅ Homework submitted successfully!");
    uploadForm.reset();
  });

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("academy_session");
    window.location.href = "login.html";
  });
});
const allHomework = JSON.parse(localStorage.getItem("academy_homework") || "[]");
const myHomework = allHomework.filter(h => h.class === user.class);

